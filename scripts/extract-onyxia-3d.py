#!/usr/bin/env python3
"""
Authentic 3D Asset, Mission Data, & CombatHUD Extractor for Onyxia's Lair.

Reads read-only Warcraft Rumble TACT/APK bundles and already-extracted mini statues
using environment-variable overrides (with user-home fallbacks) and writes:
  - src/data/onyxia-mission-data.json   (exact missiondata_onyxia_v1 geometry, roads, switches, deploy areas, units)
  - src/data/models-manifest.json       (complete 3D asset index for minis, pedestals, POIs, and specials)
  - public/r/3d/env/onyxia-lair.glb     (Terrain + Emissive RockWall + 4 Lava Unwalkables + SpikeRocks)
  - public/r/3d/poi/*.glb               (Onyxia Boss, Keep, Player/Enemy Towers, Gold Mine, Chest, Switch, Warder, Kobold, Whelp, Egg, Wolf, Skeleton)
  - public/r/3d/pedestals/*.glb         (Compressed 7 faction pedestals)
  - public/r/3d/minis/*.glb             (Compressed 81 playable mini statue .glb files)
  - public/r/hud/*.webp + manifest.json (Official CombatHUD & UnitIndicators UI sprites)
"""

import io
import json
import os
import re
import struct
import sys
import zipfile
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

import pygltflib
import UnityPy
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parents[1]
HOME_DIR = Path.home()

TACT_DIR = Path(
    os.environ.get(
        "RUMBLE_TACT_DIR",
        HOME_DIR
        / "Library/Containers/43E03D56-DF34-4FCD-B7D0-39C2DC68EE67/Data/Documents/TactData/LooseFiles/Bundle",
    )
)
APK_PATH = Path(
    os.environ.get("RUMBLE_SPLIT_APK", HOME_DIR / "IdeaProjects/rea/split_bundles.apk")
)
EXTRACTED_BUNDLES_DIR = Path(
    os.environ.get("RUMBLE_EXTRACTED_BUNDLES", HOME_DIR / "IdeaProjects/rea/extracted_bundles")
)
MINIAPP_DIR = Path(os.environ.get("RUMBLE_MINIAPP_DIR", HOME_DIR / "warcraft-rumble-miniapp"))

OUT_DATA_DIR = PROJECT_ROOT / "src/data"
OUT_3D_DIR = PROJECT_ROOT / "public/r/3d"
OUT_ENV_DIR = OUT_3D_DIR / "env"
OUT_POI_DIR = OUT_3D_DIR / "poi"
OUT_MINIS_DIR = OUT_3D_DIR / "minis"
OUT_PEDESTALS_DIR = OUT_3D_DIR / "pedestals"
OUT_HUD_DIR = PROJECT_ROOT / "public/r/hud"


def pad4(buf: bytearray) -> bytearray:
    while len(buf) % 4 != 0:
        buf.append(0)
    return buf


def parse_vec3_str(s: Optional[str]) -> List[float]:
    if not s:
        return [0.0, 0.0, 0.0]
    parts = [float(p.strip()) for p in str(s).split(",")]
    while len(parts) < 3:
        parts.append(0.0)
    return parts[:3]


def encode_gltf_image(img: Image.Image, max_size: int = 512, jpeg_quality: int = 82) -> Tuple[bytes, str, bool]:
    """
    Encode PIL Image cleanly for core Three.js GLTFLoader (only JPEG or PNG; never bare WebP).
    Uses PNG only if image actually carries meaningful transparency (min_alpha < 250).
    """
    w, h = img.size
    if max(w, h) > max_size:
        ratio = max_size / float(max(w, h))
        img = img.resize((max(1, int(round(w * ratio))), max(1, int(round(h * ratio)))), Image.LANCZOS)

    has_alpha = False
    if img.mode in ("RGBA", "LA") or ("transparency" in img.info):
        rgba = img.convert("RGBA")
        alpha_ext = rgba.getchannel("A").getextrema()
        if alpha_ext[0] < 245:
            has_alpha = True
            buf = io.BytesIO()
            rgba.save(buf, format="PNG", optimize=True)
            return buf.getvalue(), "image/png", True
        img = rgba.convert("RGB")
    elif img.mode != "RGB":
        img = img.convert("RGB")

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=jpeg_quality, optimize=True)
    return buf.getvalue(), "image/jpeg", has_alpha


def parse_obj_groups(
    obj_text: str,
    transform_fn=None,
    only_groups: Optional[Set[str]] = None,
) -> List[Dict[str, Any]]:
    """
    Parse Wavefront OBJ text (optionally splitting by `g` groups) into glTF-ready primitive arrays.
    Note: UnityPy mesh.export() outputs right-handed OBJ where v = (-x_u, y_u, z_u).
    """
    v_list: List[List[float]] = []
    vt_list: List[List[float]] = []
    vn_list: List[List[float]] = []
    groups: Dict[str, List[List[str]]] = {}
    current_group = "__default__"

    for raw in obj_text.splitlines():
        line = raw.strip()
        if not line:
            continue
        parts = line.split()
        tag = parts[0]
        if tag == "v" and len(parts) >= 4:
            v_list.append([float(parts[1]), float(parts[2]), float(parts[3])])
        elif tag == "vt" and len(parts) >= 3:
            vt_list.append([float(parts[1]), 1.0 - float(parts[2])])
        elif tag == "vn" and len(parts) >= 4:
            vn_list.append([float(parts[1]), float(parts[2]), float(parts[3])])
        elif tag == "g" and len(parts) >= 2:
            current_group = " ".join(parts[1:])
        elif tag == "f" and len(parts) >= 4:
            if only_groups is not None and current_group not in only_groups:
                continue
            fv = parts[1:]
            bucket = groups.setdefault(current_group, [])
            for k in range(1, len(fv) - 1):
                bucket.append([fv[0], fv[k], fv[k + 1]])

    out = []
    for gname, tris in groups.items():
        if not tris:
            continue
        positions: List[List[float]] = []
        normals: List[List[float]] = []
        uvs: List[List[float]] = []
        indices: List[int] = []
        vmap: Dict[Tuple[int, int, int], int] = {}
        for tri in tris:
            for vert in tri:
                vp = vert.split("/")
                vi = int(vp[0]) - 1
                vti = int(vp[1]) - 1 if len(vp) > 1 and vp[1] else -1
                vni = int(vp[2]) - 1 if len(vp) > 2 and vp[2] else -1
                key = (vi, vti, vni)
                if key in vmap:
                    indices.append(vmap[key])
                else:
                    idx = len(positions)
                    vmap[key] = idx
                    pos = list(v_list[vi])
                    nrm = list(vn_list[vni]) if 0 <= vni < len(vn_list) else [0.0, 1.0, 0.0]
                    uv = list(vt_list[vti]) if 0 <= vti < len(vt_list) else [0.0, 0.0]
                    if transform_fn is not None:
                        pos, nrm = transform_fn(pos, nrm)
                    positions.append(pos)
                    normals.append(nrm)
                    uvs.append(uv)
                    indices.append(idx)
        out.append(
            {
                "name": gname,
                "positions": positions,
                "normals": normals,
                "uvs": uvs,
                "indices": indices,
            }
        )
    return out


def merge_parts_geometry(parts: List[Dict[str, Any]]) -> Dict[str, Any]:
    positions: List[List[float]] = []
    normals: List[List[float]] = []
    uvs: List[List[float]] = []
    indices: List[int] = []
    for p in parts:
        off = len(positions)
        positions.extend(p["positions"])
        normals.extend(p["normals"])
        uvs.extend(p["uvs"])
        indices.extend(i + off for i in p["indices"])
    return {
        "name": "merged",
        "positions": positions,
        "normals": normals,
        "uvs": uvs,
        "indices": indices,
    }


def build_multimesh_glb(
    entries: List[Dict[str, Any]],
    out_path: Path,
    generator: str = "WarcraftRumbleOnyxia3D",
) -> Dict[str, Any]:
    """
    Build a multi-node / multi-material .glb file.
    Each entry dict:
      - name: str
      - geom: {positions, normals, uvs, indices}
      - base_color_img: PIL.Image (optional)
      - emissive_img: PIL.Image (optional)
      - emissive_factor: [r, g, b] (optional)
      - metallic: float (default 0.08)
      - roughness: float (default 0.80)
      - tex_size: int (default 512)
      - jpeg_quality: int (default 82)
      - center_xz: bool (default False)
      - ground_mode: 'none' | 'min_y' | 'offset_y' (default 'none')
      - y_offset: float (default 0.0)
      - scale: float (default 1.0)
    """
    out_path.parent.mkdir(parents=True, exist_ok=True)
    gltf = pygltflib.GLTF2()
    gltf.asset = pygltflib.Asset(generator=generator, version="2.0")
    gltf.scene = 0
    gltf.scenes = [pygltflib.Scene(nodes=list(range(len(entries))))]
    gltf.samplers = [
        pygltflib.Sampler(
            magFilter=pygltflib.LINEAR,
            minFilter=pygltflib.LINEAR_MIPMAP_LINEAR,
            wrapS=pygltflib.REPEAT,
            wrapT=pygltflib.REPEAT,
        )
    ]

    bin_blob = bytearray()
    buffer_views: List[pygltflib.BufferView] = []
    accessors: List[pygltflib.Accessor] = []
    images: List[pygltflib.Image] = []
    textures: List[pygltflib.Texture] = []
    materials: List[pygltflib.Material] = []
    meshes: List[pygltflib.Mesh] = []
    nodes: List[pygltflib.Node] = []

    def append_bytes(data: bytes, target: Optional[int] = None) -> int:
        offset = len(bin_blob)
        bin_blob.extend(data)
        pad4(bin_blob)
        bv = pygltflib.BufferView(buffer=0, byteOffset=offset, byteLength=len(data))
        if target is not None:
            bv.target = target
        bv_idx = len(buffer_views)
        buffer_views.append(bv)
        return bv_idx

    def add_image_tex(img: Image.Image, tex_size: int, jpeg_quality: int) -> Tuple[int, bool]:
        raw, mime, has_alpha = encode_gltf_image(img, max_size=tex_size, jpeg_quality=jpeg_quality)
        bv_idx = append_bytes(raw)
        img_idx = len(images)
        images.append(pygltflib.Image(bufferView=bv_idx, mimeType=mime))
        tex_idx = len(textures)
        textures.append(pygltflib.Texture(sampler=0, source=img_idx))
        return tex_idx, has_alpha

    global_min = [float("inf"), float("inf"), float("inf")]
    global_max = [float("-inf"), float("-inf"), float("-inf")]

    for idx_entry, entry in enumerate(entries):
        geom = entry["geom"]
        positions = [list(p) for p in geom["positions"]]
        normals = geom["normals"]
        uvs = geom["uvs"]
        indices = geom["indices"]

        sc = float(entry.get("scale", 1.0))
        if sc != 1.0:
            for p in positions:
                p[0] *= sc
                p[1] *= sc
                p[2] *= sc

        xs = [p[0] for p in positions]
        ys = [p[1] for p in positions]
        zs = [p[2] for p in positions]
        min_x, max_x = min(xs), max(xs)
        min_y, max_y = min(ys), max(ys)
        min_z, max_z = min(zs), max(zs)

        cx = (min_x + max_x) * 0.5 if entry.get("center_xz") else 0.0
        cz = (min_z + max_z) * 0.5 if entry.get("center_xz") else 0.0
        dy = 0.0
        if entry.get("ground_mode") == "min_y":
            dy = -min_y
        elif entry.get("ground_mode") == "offset_y":
            dy = float(entry.get("y_offset", 0.0))

        if cx != 0.0 or dy != 0.0 or cz != 0.0:
            for p in positions:
                p[0] -= cx
                p[1] += dy
                p[2] -= cz
            xs = [p[0] for p in positions]
            ys = [p[1] for p in positions]
            zs = [p[2] for p in positions]
            min_x, max_x = min(xs), max(xs)
            min_y, max_y = min(ys), max(ys)
            min_z, max_z = min(zs), max(zs)

        global_min = [min(global_min[0], min_x), min(global_min[1], min_y), min(global_min[2], min_z)]
        global_max = [max(global_max[0], max_x), max(global_max[1], max_y), max(global_max[2], max_z)]

        pos_b = bytearray()
        for p in positions:
            pos_b.extend(struct.pack("<fff", p[0], p[1], p[2]))
        nrm_b = bytearray()
        for n in normals:
            nrm_b.extend(struct.pack("<fff", n[0], n[1], n[2]))
        uv_b = bytearray()
        for u in uvs:
            uv_b.extend(struct.pack("<ff", u[0], u[1]))
        use_u32 = len(positions) > 65535
        idx_b = bytearray()
        fmt = "<I" if use_u32 else "<H"
        for i in indices:
            idx_b.extend(struct.pack(fmt, i))

        bv_pos = append_bytes(bytes(pos_b), pygltflib.ARRAY_BUFFER)
        bv_nrm = append_bytes(bytes(nrm_b), pygltflib.ARRAY_BUFFER)
        bv_uv = append_bytes(bytes(uv_b), pygltflib.ARRAY_BUFFER)
        bv_idx = append_bytes(bytes(idx_b), pygltflib.ELEMENT_ARRAY_BUFFER)

        acc_pos = len(accessors)
        accessors.append(
            pygltflib.Accessor(
                bufferView=bv_pos,
                byteOffset=0,
                componentType=pygltflib.FLOAT,
                count=len(positions),
                type="VEC3",
                min=[min_x, min_y, min_z],
                max=[max_x, max_y, max_z],
            )
        )
        acc_nrm = len(accessors)
        accessors.append(
            pygltflib.Accessor(
                bufferView=bv_nrm,
                byteOffset=0,
                componentType=pygltflib.FLOAT,
                count=len(normals),
                type="VEC3",
            )
        )
        acc_uv = len(accessors)
        accessors.append(
            pygltflib.Accessor(
                bufferView=bv_uv,
                byteOffset=0,
                componentType=pygltflib.FLOAT,
                count=len(uvs),
                type="VEC2",
            )
        )
        acc_idx = len(accessors)
        accessors.append(
            pygltflib.Accessor(
                bufferView=bv_idx,
                byteOffset=0,
                componentType=pygltflib.UNSIGNED_INT if use_u32 else pygltflib.UNSIGNED_SHORT,
                count=len(indices),
                type="SCALAR",
            )
        )

        tex_size = int(entry.get("tex_size", 512))
        jq = int(entry.get("jpeg_quality", 82))
        pbr = pygltflib.PbrMetallicRoughness(
            metallicFactor=float(entry.get("metallic", 0.08)),
            roughnessFactor=float(entry.get("roughness", 0.80)),
        )
        has_alpha = False
        if entry.get("base_color_img") is not None:
            tex_idx, has_alpha = add_image_tex(entry["base_color_img"], tex_size, jq)
            pbr.baseColorTexture = pygltflib.TextureInfo(index=tex_idx)

        mat_kwargs: Dict[str, Any] = {
            "name": f"{entry['name']}_Mat",
            "pbrMetallicRoughness": pbr,
            "doubleSided": True,
        }
        if entry.get("emissive_img") is not None:
            em_idx, _ = add_image_tex(entry["emissive_img"], tex_size, jq)
            mat_kwargs["emissiveTexture"] = pygltflib.TextureInfo(index=em_idx)
            mat_kwargs["emissiveFactor"] = entry.get("emissive_factor", [1.0, 0.45, 0.12])
        if has_alpha:
            mat_kwargs["alphaMode"] = "MASK"
            mat_kwargs["alphaCutoff"] = 0.4

        mat_idx = len(materials)
        materials.append(pygltflib.Material(**mat_kwargs))

        prim = pygltflib.Primitive(
            attributes=pygltflib.Attributes(POSITION=acc_pos, NORMAL=acc_nrm, TEXCOORD_0=acc_uv),
            indices=acc_idx,
            material=mat_idx,
        )
        mesh_idx = len(meshes)
        meshes.append(pygltflib.Mesh(primitives=[prim], name=entry["name"]))
        nodes.append(pygltflib.Node(mesh=mesh_idx, name=entry["name"]))

    gltf.buffers = [pygltflib.Buffer(byteLength=len(bin_blob))]
    gltf.bufferViews = buffer_views
    gltf.accessors = accessors
    gltf.images = images
    gltf.textures = textures
    gltf.materials = materials
    gltf.meshes = meshes
    gltf.nodes = nodes
    gltf.set_binary_blob(bytes(bin_blob))
    gltf.save(str(out_path))

    return {
        "bytes": out_path.stat().st_size,
        "bbox": {
            "min": [round(v, 3) for v in global_min],
            "max": [round(v, 3) for v in global_max],
            "size": [round(global_max[i] - global_min[i], 3) for i in range(3)],
        },
    }


def extract_mission_data() -> Dict[str, Any]:
    print("=== 1A. Extracting missiondata_onyxia_v1.bundle ===")
    env = UnityPy.load(str(TACT_DIR / "missiondata_onyxia_v1.bundle"))
    raw_mission = None
    for obj in env.objects:
        if obj.type.name == "TextAsset":
            d = obj.read()
            if d.m_Name == "Onyxia":
                txt = d.m_Script if isinstance(d.m_Script, str) else d.m_Script.decode("utf-8", "ignore")
                raw_mission = json.loads(txt)
                break
    if not raw_mission:
        raise RuntimeError("Could not find TextAsset 'Onyxia' in missiondata_onyxia_v1.bundle")

    # Official Chinese Onyxia taunts
    taunts = [
        "真走运……我的下一餐自己送上门来了。",
        "你会付出代价的！",
        "要明白你的处境！",
        "加时！",
        "还剩60秒……快抓紧时间！",
        "还剩10秒！",
    ]
    obu_path = MINIAPP_DIR / "scripts/official_blizzard_units.json"
    if obu_path.exists():
        obu = json.loads(obu_path.read_text(encoding="utf-8"))
        ox = obu.get("onyxia", {})
        if ox.get("desc_zh"):
            taunts = ox["desc_zh"]

    cam = (raw_mission.get("CameraBounds") or [{}])[0]
    cam_pos = parse_vec3_str(cam.get("Position", "0, 0, 39"))
    cam_scale = parse_vec3_str(cam.get("Scale", "56, 1, 114"))

    roads = []
    for r in raw_mission.get("Roads", []):
        pos = parse_vec3_str(r.get("Position"))
        roads.append(
            {
                "guid": r["Guid"],
                "name": r.get("Name", ""),
                "x": pos[0],
                "z": pos[2],
                "goals": [
                    {
                        "road": g.get("Road", ""),
                        "teamDirection": g.get("TeamDirection", "TowardsTop"),
                    }
                    for g in r.get("Goals", [])
                ],
            }
        )

    switches = []
    for sw in raw_mission.get("Switches", []):
        pos = parse_vec3_str(sw.get("Position"))
        switches.append(
            {
                "guid": sw["Guid"],
                "name": sw.get("Name", ""),
                "x": pos[0],
                "z": pos[2],
                "choices": [c.get("TargetRoad", "") for c in sw.get("Choices", [])],
            }
        )

    deploy_areas = []
    for da in raw_mission.get("DeployAreas", []):
        pos = parse_vec3_str(da.get("Position"))
        sc = parse_vec3_str(da.get("Scale", "6, 1, 6"))
        deploy_areas.append(
            {
                "guid": da["Guid"],
                "name": da.get("Name", ""),
                "unitGuid": da.get("Unit", ""),
                "x": pos[0],
                "z": pos[2],
                "width": sc[0],
                "depth": sc[2],
                "goals": [
                    {
                        "road": g.get("Road", ""),
                        "teamDirection": g.get("TeamDirection", "TowardsTop"),
                    }
                    for g in da.get("Goals", [])
                ],
            }
        )

    units = []
    for u in raw_mission.get("Units", []):
        pos = parse_vec3_str(u.get("Position"))
        units.append(
            {
                "guid": u["Guid"],
                "name": u.get("Name", ""),
                "x": pos[0],
                "z": pos[2],
            }
        )

    # Extract approximate XZ circles for the 4 lava Unwalkables directly from mission_onyxia.bundle
    env_scene = UnityPy.load(str(TACT_DIR / "mission_onyxia.bundle"))
    meshes_s = {o.read().m_Name: o.read() for o in env_scene.objects if o.type.name == "Mesh"}
    unwalkables_meta = [
        ("Onyxia_Unwalkable01_Mesh", (9.65, 0.29, 15.806)),
        ("Onyxia_Unwalkable02_Mesh", (-10.135, 0.167, 22.381)),
        ("Onyxia_Unwalkable03_Mesh", (1.827, 0.133, 38.226)),
        ("Onyxia_Unwalkable04_Mesh", (-2.624, 0.193, 56.401)),
    ]
    unwalkables = []
    for mname, (px, py, pz) in unwalkables_meta:
        m = meshes_s[mname]
        parsed = parse_obj_groups(
            m.export(),
            transform_fn=lambda p, n, px=px, py=py, pz=pz: (
                [-p[0] + px, p[1] + py, p[2] + pz],
                [-n[0], n[1], n[2]],
            ),
        )[0]
        xs = [p[0] for p in parsed["positions"]]
        zs = [p[2] for p in parsed["positions"]]
        unwalkables.append(
            {
                "id": mname,
                "cx": round((min(xs) + max(xs)) * 0.5, 2),
                "cz": round((min(zs) + max(zs)) * 0.5, 2),
                "rx": round((max(xs) - min(xs)) * 0.42, 2),
                "rz": round((max(zs) - min(zs)) * 0.42, 2),
            }
        )

    mission_out = {
        "source": "TACT/missiondata_onyxia_v1.bundle (TextAsset:Onyxia)",
        "cameraBounds": {
            "cx": cam_pos[0],
            "cz": cam_pos[2],
            "width": cam_scale[0],
            "depth": cam_scale[2],
        },
        "unwalkables": unwalkables,
        "roads": roads,
        "switches": switches,
        "deployAreas": deploy_areas,
        "units": units,
        "onyxiaTaunts": taunts,
    }
    OUT_DATA_DIR.mkdir(parents=True, exist_ok=True)
    out_file = OUT_DATA_DIR / "onyxia-mission-data.json"
    out_file.write_text(json.dumps(mission_out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"  Wrote {out_file} ({len(roads)} roads, {len(switches)} switches, {len(deploy_areas)} deploy areas, {len(units)} units)")
    return mission_out


def unity_obj_to_three(pos: List[float], nrm: List[float], px: float, py: float, pz: float):
    """
    UnityPy OBJ vertex -> Three.js right-handed world coordinates:
      Unity World = (-v_obj.x + px, v_obj.y + py, v_obj.z + pz)
      Three.js    = (unityX, unityY, -unityZ) = (-v_obj.x + px, v_obj.y + py, -v_obj.z - pz)
    Det = (-1)*(+1)*(-1) = +1 (winding preserved).
    """
    return (
        [-pos[0] + px, pos[1] + py, -pos[2] - pz],
        [-nrm[0], nrm[1], -nrm[2]],
    )


def unity_obj_rot_x_neg90_to_three(pos: List[float], nrm: List[float]):
    """
    For FBX meshes authored Z-up / XY-planar that Unity places with Quaternion(-0.707, 0, 0, 0.707):
      Unity Local (-90 deg X): (x_u, y_u, z_u) -> (x_u, z_u, -y_u)
      Three.js (x, y, -z):     (-v_obj.x, v_obj.z, v_obj.y)
    Det = +1 (winding preserved).
    """
    return (
        [-pos[0], pos[2], pos[1]],
        [-nrm[0], nrm[2], nrm[1]],
    )


def extract_onyxia_environment_glb():
    print("\n=== 1B. Building public/r/3d/env/onyxia-lair.glb from baked Combined Meshes ===")
    env = UnityPy.load(str(TACT_DIR / "mission_onyxia.bundle"))
    mats = {o.path_id: o.read().m_Name for o in env.objects if o.type.name == "Material"}
    textures = {o.read().m_Name: o.read().image for o in env.objects if o.type.name == "Texture2D"}

    env_props = UnityPy.load(str(TACT_DIR / "mission_onyxia_v1_propsets.bundle"))
    gos_p = {o.path_id: o.read().m_Name for o in env_props.objects if o.type.name == "GameObject"}
    mfs_p = {}
    for o in env_props.objects:
        if o.type.name == "MeshFilter":
            mf = o.read()
            mfs_p[mf.m_GameObject.path_id] = mf.m_Mesh.path_id
    meshes_p = {o.path_id: o.read() for o in env_props.objects if o.type.name == "Mesh"}

    # Pre-export & parse each Combined Mesh once (vertices are already in exact Unity world space)
    parsed_cache: Dict[int, Dict[str, Dict[str, Any]]] = {}
    for mpid, m_obj in meshes_p.items():
        parts = parse_obj_groups(
            m_obj.export(),
            transform_fn=lambda p, n: unity_obj_to_three(p, n, 0.0, 0.0, 0.0),
        )
        parsed_cache[mpid] = {part["name"]: part for part in parts}

    node_parts: Dict[str, List[Dict[str, Any]]] = {}
    for o in env_props.objects:
        if o.type.name != "MeshRenderer":
            continue
        mr = o.read()
        sb = getattr(mr, "m_StaticBatchInfo", None)
        if not sb or sb.subMeshCount <= 0:
            continue
        mpid = mfs_p.get(mr.m_GameObject.path_id)
        if mpid not in meshes_p or not getattr(mr, "m_Materials", None):
            continue

        m_obj = meshes_p[mpid]
        gname = gos_p.get(mr.m_GameObject.path_id, "")
        mat_name = mats.get(mr.m_Materials[0].path_id, "")
        target_node = None
        if mat_name == "Onyxia_Mat_Terrain":
            target_node = "Onyxia_Terrain_Mesh"
        elif mat_name == "Onyxia_Mat_RockWall":
            target_node = "Onyxia_RockWall_Mesh"
        elif mat_name == "Onyxia_Mat_Unwalkable":
            target_node = gname if gname.startswith("Onyxia_Unwalkable") else "Onyxia_Unwalkable_Misc"
        elif mat_name == "Onyxia_Mat_SpikeRocks":
            target_node = "Onyxia_SpikeRocks"

        if not target_node:
            continue
        by_group = parsed_cache[mpid]
        for sub_i in range(sb.firstSubMesh, sb.firstSubMesh + sb.subMeshCount):
            part = by_group.get(f"{m_obj.m_Name}_{sub_i}")
            if part:
                node_parts.setdefault(target_node, []).append(part)

    ordered_nodes = [
        ("Onyxia_Terrain_Mesh", "Onyxia_Tex_StoneTerrain_Color", None, None, 0.92, 1024),
        (
            "Onyxia_RockWall_Mesh",
            "Onyxia_Tex_RockWall_Color",
            "Onyxia_Tex_RockWall_Emissive",
            [1.65, 0.55, 0.14],
            0.88,
            1024,
        ),
        ("Onyxia_Unwalkable01_Mesh", "Onyxia_Tex_Unwalkables_Color", None, None, 0.90, 512),
        ("Onyxia_Unwalkable02_Mesh", "Onyxia_Tex_Unwalkables_Color", None, None, 0.90, 512),
        ("Onyxia_Unwalkable03_Mesh", "Onyxia_Tex_Unwalkables_Color", None, None, 0.90, 512),
        ("Onyxia_Unwalkable04_Mesh", "Onyxia_Tex_Unwalkables_Color", None, None, 0.90, 512),
        ("Onyxia_SpikeRocks", "Onyxia_Tex_SpikeRocks_Color", None, None, 0.90, 1024),
    ]

    entries = []
    for nname, color_tex, em_tex, em_fac, rough, tsize in ordered_nodes:
        parts = node_parts.get(nname)
        if not parts:
            raise RuntimeError(f"Missing baked static batch submeshes for {nname}")
        entries.append(
            {
                "name": nname,
                "geom": merge_parts_geometry(parts),
                "base_color_img": textures[color_tex],
                "emissive_img": textures[em_tex] if em_tex else None,
                "emissive_factor": em_fac,
                "roughness": rough,
                "metallic": 0.05,
                "tex_size": tsize,
                "jpeg_quality": 90,
            }
        )

    stats = build_multimesh_glb(entries, OUT_ENV_DIR / "onyxia-lair.glb")
    print(f"  onyxia-lair.glb: {stats['bytes']/1024:.1f} KB, bbox={stats['bbox']}")


def load_bundle(kind: str, rel: str) -> UnityPy.Environment:
    if kind == "tact":
        return UnityPy.load(str(TACT_DIR / rel))
    if kind == "ext":
        return UnityPy.load(str(EXTRACTED_BUNDLES_DIR / rel))
    if kind == "apk":
        with zipfile.ZipFile(APK_PATH, "r") as z:
            return UnityPy.load(z.read(rel))
    raise ValueError(f"Unknown bundle kind {kind}")


def get_mesh_by_name_or_pid(env: UnityPy.Environment, name: Optional[str] = None, pid: Optional[int] = None):
    for o in env.objects:
        if o.type.name == "Mesh":
            if pid is not None and o.path_id == pid:
                return o.read()
            if name is not None:
                m = o.read()
                if m.m_Name == name:
                    return m
    raise RuntimeError(f"Mesh not found: name={name} pid={pid}")


def get_tex(env: UnityPy.Environment, name: str) -> Image.Image:
    for o in env.objects:
        if o.type.name == "Texture2D":
            t = o.read()
            if t.m_Name == name:
                return t.image
    raise RuntimeError(f"Texture not found: {name}")


def extract_poi_and_special_glbs() -> Dict[str, Any]:
    print("\n=== 1C. Extracting Boss, Structures, POIs & Special Unit .glbs ===")
    poi_manifest: Dict[str, Any] = {}

    def save_single(slug: str, entries: List[Dict[str, Any]]):
        res = build_multimesh_glb(entries, OUT_POI_DIR / f"{slug}.glb")
        poi_manifest[slug] = {
            "glb": f"./r/3d/poi/{slug}.glb",
            "bytes": res["bytes"],
            "bbox": res["bbox"],
        }
        print(f"  {slug}.glb: {res['bytes']/1024:.1f} KB bbox={res['bbox']}")

    # 1. Onyxia Boss (scale 0.42 -> ~24m wingspan, facing +Z South toward player camera)
    env_ox = load_bundle("tact", "unitstatue_onyxia.bundle")
    m_ox = get_mesh_by_name_or_pid(env_ox, name="Onyxia_Model")
    tex_ox = get_tex(env_ox, "Onyxia_Tex_Boss_Color")
    geom_ox = merge_parts_geometry(
        parse_obj_groups(m_ox.export(), transform_fn=lambda p, n: ([-p[0], p[1], -p[2]], [-n[0], n[1], -n[2]]))
    )
    # Wait: verify high-Y head Z sign in geom_ox so Onyxia faces South (+Z_three):
    head_z_avg = sum(p[2] for p in geom_ox["positions"] if p[1] > 14.0 and abs(p[0]) < 6.0) / max(
        1, len([p for p in geom_ox["positions"] if p[1] > 14.0 and abs(p[0]) < 6.0])
    )
    if head_z_avg < 0:
        # Rotate 180° around Y so head faces +Z_three (South, toward player)
        for p in geom_ox["positions"]:
            p[0] = -p[0]
            p[2] = -p[2]
        for n in geom_ox["normals"]:
            n[0] = -n[0]
            n[2] = -n[2]
    save_single(
        "onyxia-boss",
        [
            {
                "name": "Onyxia_Boss",
                "geom": geom_ox,
                "base_color_img": tex_ox,
                "tex_size": 1024,
                "jpeg_quality": 85,
                "center_xz": True,
                "ground_mode": "min_y",
                "scale": 0.42,
            }
        ],
    )

    # 2. Player Keep (Judgement Barracks) & Player Guard Tower
    env_j = load_bundle("tact", "cosmetics_skins_structure_structurejudgement.bundle")
    tex_jb = get_tex(env_j, "Judgement_Barracks_Tex_Color")
    tex_jt = get_tex(env_j, "Judgement_Toppers_Tex_Color")
    m_jbar = get_mesh_by_name_or_pid(env_j, name="JudgementBarracks_Model")
    save_single(
        "player-keep",
        [
            {
                "name": "JudgementBarracks",
                "geom": merge_parts_geometry(
                    parse_obj_groups(m_jbar.export(), transform_fn=lambda p, n: ([-p[0], p[1], -p[2]], [-n[0], n[1], -n[2]]))
                ),
                "base_color_img": tex_jb,
                "tex_size": 512,
                "center_xz": True,
                "ground_mode": "offset_y",
                "y_offset": 0.2,
                "scale": 1.35,
            }
        ],
    )

    m_jtow = get_mesh_by_name_or_pid(env_j, name="JudgementTower_Model")
    m_jtop = get_mesh_by_name_or_pid(env_j, pid=8397542379385808599)
    save_single(
        "tower-player",
        [
            {
                "name": "JudgementTower",
                "geom": merge_parts_geometry(
                    parse_obj_groups(m_jtow.export(), transform_fn=lambda p, n: ([-p[0], p[1], -p[2]], [-n[0], n[1], -n[2]]))
                ),
                "base_color_img": tex_jb,
                "tex_size": 512,
                "center_xz": False,
                "ground_mode": "offset_y",
                "y_offset": -0.25,
                "scale": 1.35,
            },
            {
                "name": "JudgementSwordTop",
                "geom": merge_parts_geometry(
                    parse_obj_groups(m_jtop.export(), transform_fn=lambda p, n: ([-p[0], p[1], -p[2]], [-n[0], n[1], -n[2]]))
                ),
                "base_color_img": tex_jt,
                "tex_size": 512,
                "center_xz": False,
                "ground_mode": "offset_y",
                "y_offset": -0.25,
                "scale": 1.35,
            },
        ],
    )

    # 3. Enemy Tower (Horde Tower + Top Guard)
    env_h = load_bundle("tact", "cosmetics_skins_structure_structurehorde.bundle")
    tex_hb = get_tex(env_h, "Horde_Barracks_Tex_Color")
    tex_ht = get_tex(env_h, "Horde_Toppers_Tex_Color")
    m_htow = get_mesh_by_name_or_pid(env_h, name="HordeTower_Model")
    m_hguard = get_mesh_by_name_or_pid(env_h, name="HordeTopGuard_Model")
    save_single(
        "tower-enemy",
        [
            {
                "name": "HordeTower",
                "geom": merge_parts_geometry(
                    parse_obj_groups(m_htow.export(), transform_fn=lambda p, n: ([-p[0], p[1], -p[2]], [-n[0], n[1], -n[2]]))
                ),
                "base_color_img": tex_hb,
                "tex_size": 512,
                "ground_mode": "offset_y",
                "y_offset": 0.0,
                "scale": 1.35,
            },
            {
                "name": "HordeTopGuard",
                "geom": merge_parts_geometry(
                    parse_obj_groups(m_hguard.export(), transform_fn=lambda p, n: ([-p[0], p[1], -p[2]], [-n[0], n[1], -n[2]]))
                ),
                "base_color_img": tex_ht,
                "tex_size": 512,
                "ground_mode": "offset_y",
                "y_offset": 0.0,
                "scale": 1.35,
            },
        ],
    )

    # 4. Gold Mine (rotated -90 deg X so Z-up FBX stands upright!)
    env_gm = load_bundle("apk", "assets/assetpack/unitassets_poi_goldmine.bundle")
    m_gm = get_mesh_by_name_or_pid(env_gm, pid=4843919194426736259)
    tex_gm = get_tex(env_gm, "GoldMine_Color")
    save_single(
        "gold-mine",
        [
            {
                "name": "GoldMine",
                "geom": merge_parts_geometry(parse_obj_groups(m_gm.export(), transform_fn=unity_obj_rot_x_neg90_to_three)),
                "base_color_img": tex_gm,
                "tex_size": 512,
                "center_xz": True,
                "ground_mode": "min_y",
                "scale": 1.15,
            }
        ],
    )

    # 5. Treasure Chest (Y-up pid=7602436547955870921)
    env_tc = load_bundle("apk", "assets/assetpack/unitassets_poi_treasurechest.bundle")
    m_tc = get_mesh_by_name_or_pid(env_tc, pid=7602436547955870921)
    tex_tc = get_tex(env_tc, "TreasureChest_Color")
    save_single(
        "treasure-chest",
        [
            {
                "name": "TreasureChest",
                "geom": merge_parts_geometry(
                    parse_obj_groups(m_tc.export(), transform_fn=lambda p, n: ([-p[0], p[1], -p[2]], [-n[0], n[1], -n[2]]))
                ),
                "base_color_img": tex_tc,
                "tex_size": 512,
                "center_xz": True,
                "ground_mode": "min_y",
                "scale": 0.95,
            }
        ],
    )

    # 6. Lane Switch Base & Arrow (rotated -90 deg X so XY-planar lies flat on XZ ground!)
    env_sw = load_bundle("tact", "unitassets_poi_switch.bundle")
    m_sw = get_mesh_by_name_or_pid(env_sw, pid=-3040478994106583779)
    m_swa = get_mesh_by_name_or_pid(env_sw, pid=7013474314616426015)
    tex_sw = get_tex(env_sw, "SwitchV2_Color")
    save_single(
        "lane-switch",
        [
            {
                "name": "LaneSwitchBase",
                "geom": merge_parts_geometry(parse_obj_groups(m_sw.export(), transform_fn=unity_obj_rot_x_neg90_to_three)),
                "base_color_img": tex_sw,
                "tex_size": 512,
                "center_xz": True,
                "ground_mode": "min_y",
                "scale": 1.6,
            }
        ],
    )
    save_single(
        "lane-switch-arrow",
        [
            {
                "name": "LaneSwitchArrow",
                "geom": merge_parts_geometry(parse_obj_groups(m_swa.export(), transform_fn=unity_obj_rot_x_neg90_to_three)),
                "base_color_img": tex_sw,
                "tex_size": 512,
                "center_xz": False,
                "ground_mode": "min_y",
                "scale": 1.6,
            }
        ],
    )

    # 7. Special Battle Units (Warder, Kobold, Whelp Egg, Onyxia Whelp, Spirit Wolf, Skeleton)
    env_w = load_bundle("tact", "unitassets_unit_dragonspawn.bundle")
    save_single(
        "onyxia-warder",
        [
            {
                "name": "Dragonspawn",
                "geom": merge_parts_geometry(parse_obj_groups(get_mesh_by_name_or_pid(env_w, name="Dragonspawn_Mesh").export())),
                "base_color_img": get_tex(env_w, "DragonSpawn_Tex_Color"),
                "center_xz": True,
                "ground_mode": "min_y",
            }
        ],
    )

    env_k = load_bundle("apk", "assets/assetpack/unitassets_unit_kobold.bundle")
    save_single(
        "kobold-miner",
        [
            {
                "name": "KoboldMiner",
                "geom": merge_parts_geometry(parse_obj_groups(get_mesh_by_name_or_pid(env_k, name="Kobold_Model").export())),
                "base_color_img": get_tex(env_k, "Kobold_Tex_Color"),
                "center_xz": True,
                "ground_mode": "min_y",
                "scale": 0.85,
            }
        ],
    )

    env_we = load_bundle("tact", "unitassets_unit_whelpeggs.bundle")
    save_single(
        "onyxia-egg",
        [
            {
                "name": "WhelpEgg",
                "geom": merge_parts_geometry(parse_obj_groups(get_mesh_by_name_or_pid(env_we, name="WhelpEggs_Egg").export())),
                "base_color_img": get_tex(env_we, "WhelpEggs_Tex_Color"),
                "center_xz": True,
                "ground_mode": "min_y",
                "scale": 0.9,
            }
        ],
    )
    save_single(
        "onyxia-whelp",
        [
            {
                "name": "OnyxiaWhelp",
                "geom": merge_parts_geometry(parse_obj_groups(get_mesh_by_name_or_pid(env_we, name="WhelpEggs_Dragon").export())),
                "base_color_img": get_tex(env_we, "WhelpEggs_Tex_Color"),
                "center_xz": True,
                "ground_mode": "min_y",
                "scale": 0.72,
            }
        ],
    )

    env_swolf = load_bundle("tact", "unitassets_unit_spiritwolf.bundle")
    save_single(
        "spirit-wolf",
        [
            {
                "name": "SpiritWolf",
                "geom": merge_parts_geometry(parse_obj_groups(get_mesh_by_name_or_pid(env_swolf, name="Prowler_Model").export())),
                "base_color_img": get_tex(env_swolf, "SpiritWolves_Tex_Color"),
                "center_xz": True,
                "ground_mode": "min_y",
                "scale": 0.85,
            }
        ],
    )

    env_sk = load_bundle("tact", "unitassets_unit_skeletonwarrior.bundle")
    save_single(
        "skeleton-minion",
        [
            {
                "name": "SkeletonMinion",
                "geom": merge_parts_geometry(parse_obj_groups(get_mesh_by_name_or_pid(env_sk, name="SkeletonWarrior_Model").export())),
                "base_color_img": get_tex(env_sk, "SkeletonWarrior_Tex_Color"),
                "center_xz": True,
                "ground_mode": "min_y",
                "scale": 0.78,
            }
        ],
    )

    return poi_manifest


def recompress_glb(src_path: Path, dst_path: Path, max_size: int = 512, jpeg_quality: int = 82) -> int:
    """Re-encode embedded PNG textures inside a pre-extracted .glb to JPEG/compressed PNG to shrink repo size 5x."""
    gltf = pygltflib.GLTF2.load(str(src_path))
    blob = gltf.binary_blob()
    if not gltf.images or not blob:
        dst_path.parent.mkdir(parents=True, exist_ok=True)
        dst_path.write_bytes(src_path.read_bytes())
        return dst_path.stat().st_size

    # Extract original buffer slices for each bufferView, replace image bufferViews, rebuild contiguous bin blob
    new_blob = bytearray()
    bv_is_img: Dict[int, Tuple[int, bytes, str, bool]] = {}
    for img_idx, img in enumerate(gltf.images):
        bv = gltf.bufferViews[img.bufferView]
        raw_bytes = blob[bv.byteOffset : bv.byteOffset + bv.byteLength]
        pil = Image.open(io.BytesIO(raw_bytes))
        enc_bytes, mime, has_alpha = encode_gltf_image(pil, max_size=max_size, jpeg_quality=jpeg_quality)
        bv_is_img[img.bufferView] = (img_idx, enc_bytes, mime, has_alpha)

    alpha_images: Set[int] = set()
    for bv_idx, bv in enumerate(gltf.bufferViews):
        offset = len(new_blob)
        if bv_idx in bv_is_img:
            img_idx, enc_bytes, mime, has_alpha = bv_is_img[bv_idx]
            new_blob.extend(enc_bytes)
            pad4(new_blob)
            bv.byteOffset = offset
            bv.byteLength = len(enc_bytes)
            gltf.images[img_idx].mimeType = mime
            if has_alpha:
                alpha_images.add(img_idx)
        else:
            chunk = blob[bv.byteOffset : bv.byteOffset + bv.byteLength]
            new_blob.extend(chunk)
            pad4(new_blob)
            bv.byteOffset = offset

    # Set alphaMode if transparent PNG kept
    if alpha_images and gltf.materials and gltf.textures:
        for mat in gltf.materials:
            bct = mat.pbrMetallicRoughness.baseColorTexture if mat.pbrMetallicRoughness else None
            if bct is not None and gltf.textures[bct.index].source in alpha_images:
                mat.alphaMode = "MASK"
                mat.alphaCutoff = 0.4

    gltf.buffers[0].byteLength = len(new_blob)
    gltf.set_binary_blob(bytes(new_blob))
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    gltf.save(str(dst_path))
    return dst_path.stat().st_size


def repack_minis_and_pedestals(poi_manifest: Dict[str, Any]):
    print("\n=== 1D. Repacking & Compressing 81 Mini .glbs + 7 Pedestals ===")
    src_models_dir = MINIAPP_DIR / "output/models"
    raw_manifest = json.loads((src_models_dir / "manifest.json").read_text(encoding="utf-8"))

    pedestals_out: Dict[str, str] = {}
    ped_bytes = 0
    for fam, rel in raw_manifest.get("pedestals", {}).items():
        src = src_models_dir / rel
        dst = OUT_PEDESTALS_DIR / f"{fam}.glb"
        sz = recompress_glb(src, dst, max_size=512, jpeg_quality=82)
        ped_bytes += sz
        pedestals_out[fam] = f"./r/3d/pedestals/{fam}.glb"
    print(f"  7 pedestals compressed: {ped_bytes/1024:.1f} KB")

    minis_out: Dict[str, Any] = {}
    mini_bytes = 0
    for entry in raw_manifest.get("minis", []):
        slug = entry["slug"]
        src = src_models_dir / entry["glbFile"]
        if not src.exists():
            continue
        dst = OUT_MINIS_DIR / f"{slug}.glb"
        sz = recompress_glb(src, dst, max_size=512, jpeg_quality=80)
        mini_bytes += sz
        fam = (entry.get("families") or ["Neutral"])[0].lower()
        if fam not in pedestals_out:
            fam = "neutral"
        bbox = entry.get("boundingBox", {})
        sz_vec = bbox.get("size", [2.5, 3.8, 2.5])
        minis_out[slug] = {
            "glb": f"./r/3d/minis/{slug}.glb",
            "pedestal": fam,
            "height": round(float(sz_vec[1]), 2),
            "bytes": sz,
        }

    # Add special summoned/NPC unit glb mappings
    special_mappings = {
        "kobold-miner": ("poi", "kobold-miner", "neutral"),
        "onyxia-warder": ("poi", "onyxia-warder", "blackrock"),
        "onyxia-egg": ("poi", "onyxia-egg", "blackrock"),
        "onyxia-whelp": ("poi", "onyxia-whelp", "blackrock"),
        "player-whelp": ("poi", "onyxia-whelp", "blackrock"),
        "spirit-wolf": ("poi", "spirit-wolf", "horde"),
        "skeleton-minion": ("poi", "skeleton-minion", "undead"),
        "onyxia": ("poi", "onyxia-boss", "blackrock"),
    }
    for slug, (_, poi_key, ped) in special_mappings.items():
        if poi_key in poi_manifest:
            info = poi_manifest[poi_key]
            minis_out[slug] = {
                "glb": info["glb"],
                "pedestal": ped,
                "height": info["bbox"]["size"][1],
                "bytes": info["bytes"],
                "noPedestal": poi_key in ("onyxia-boss", "onyxia-egg"),
            }

    manifest_out = {
        "env": {
            "onyxiaLair": "./r/3d/env/onyxia-lair.glb",
        },
        "poi": poi_manifest,
        "pedestals": pedestals_out,
        "minis": minis_out,
    }
    manifest_file = OUT_DATA_DIR / "models-manifest.json"
    manifest_file.write_text(json.dumps(manifest_out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"  {len(raw_manifest.get('minis', []))} minis compressed: {mini_bytes/(1024*1024):.2f} MB -> {manifest_file}")


def extract_combathud_sprites():
    print("\n=== 1E. Extracting Official CombatHUD & UnitIndicators Sprites ===")
    OUT_HUD_DIR.mkdir(parents=True, exist_ok=True)
    exported: Dict[str, Any] = {}

    bundles = [
        ("ext", "sprite_atlas_combathud_atl_ui.bundle"),
        ("ext", "sprite_atlas_combathud_unitindicators_atlas.bundle"),
    ]
    for kind, bname in bundles:
        bp = EXTRACTED_BUNDLES_DIR / bname
        if not bp.exists():
            continue
        env = UnityPy.load(str(bp))
        for obj in env.objects:
            if obj.type.name == "Sprite":
                sp = obj.read()
                name = sp.m_Name
                if not name:
                    continue
                img = sp.image.convert("RGBA")
                dst = OUT_HUD_DIR / f"{name}.webp"
                img.save(dst, "WEBP", lossless=True, exact=True, method=4)
                exported[name] = {
                    "file": f"./r/hud/{name}.webp",
                    "width": img.width,
                    "height": img.height,
                }

    (OUT_HUD_DIR / "manifest.json").write_text(
        json.dumps(exported, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    total_kb = sum((OUT_HUD_DIR / f"{k}.webp").stat().st_size for k in exported) / 1024.0
    print(f"  Exported {len(exported)} CombatHUD/UnitIndicator sprites ({total_kb:.1f} KB)")


def main():
    if not TACT_DIR.exists():
        raise FileNotFoundError(f"TACT bundle directory not found: {TACT_DIR}")
    if "--env-only" in sys.argv:
        extract_onyxia_environment_glb()
        print("\nRe-extracted Onyxia baked 3D environment cleanly!")
        return
    extract_mission_data()
    extract_onyxia_environment_glb()
    poi_manifest = extract_poi_and_special_glbs()
    repack_minis_and_pedestals(poi_manifest)
    extract_combathud_sprites()
    print("\nAll V2 3D assets, mission data, and CombatHUD sprites extracted cleanly!")


if __name__ == "__main__":
    main()
