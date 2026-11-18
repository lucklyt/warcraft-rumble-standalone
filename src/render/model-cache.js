import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import modelsManifest from '../data/models-manifest.json' with { type: 'json' };
import { normalizeAssetPath } from './asset-loader.js';

const loader = new GLTFLoader();
const sceneCache = new Map();

const sharedRingGeo = new THREE.RingGeometry(1.18, 1.48, 28);
sharedRingGeo.rotateX(-Math.PI / 2);
sharedRingGeo.userData.cachedTemplate = true;

const sharedShadowGeo = new THREE.CircleGeometry(1.15, 24);
sharedShadowGeo.rotateX(-Math.PI / 2);
sharedShadowGeo.userData.cachedTemplate = true;

export function getModelsManifest() {
  return modelsManifest;
}

export function loadGlbTemplate(url) {
  const path = normalizeAssetPath(url);
  if (!sceneCache.has(path)) {
    const promise = new Promise((resolve, reject) => {
      loader.load(
        path,
        (gltf) => {
          const root = gltf.scene;
          root.traverse((obj) => {
            if (obj.isMesh) {
              obj.castShadow = true;
              obj.receiveShadow = true;
              if (obj.geometry) {
                obj.geometry.userData = obj.geometry.userData || {};
                obj.geometry.userData.cachedTemplate = true;
              }
            }
          });
          resolve(root);
        },
        undefined,
        (err) => reject(err)
      );
    });
    sceneCache.set(path, promise);
  }
  return sceneCache.get(path);
}

export function cloneSceneWithUniqueMaterials(templateRoot) {
  const clone = templateRoot.clone(true);
  const ownedMaterials = [];
  clone.traverse((obj) => {
    if (obj.isMesh && obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material = obj.material.map((m) => {
          const cm = m.clone();
          ownedMaterials.push(cm);
          return cm;
        });
      } else {
        const cm = obj.material.clone();
        obj.material = cm;
        ownedMaterials.push(cm);
      }
    }
  });
  clone.userData.ownedMaterials = ownedMaterials;
  return clone;
}

export function disposeClonedMaterials(root) {
  if (!root) return;
  const list = root.userData?.ownedMaterials;
  if (Array.isArray(list)) {
    for (const mat of list) {
      mat.dispose();
    }
    root.userData.ownedMaterials = [];
  }
}

export function resolveMiniModelEntry(slug) {
  if (modelsManifest.minis?.[slug]) {
    return modelsManifest.minis[slug];
  }
  return null;
}

export function resolvePedestalUrl(families, explicitPedestal = null) {
  if (explicitPedestal && modelsManifest.pedestals?.[explicitPedestal]) {
    return modelsManifest.pedestals[explicitPedestal];
  }
  const fam = (families?.[0] || 'Neutral').toLowerCase();
  return modelsManifest.pedestals?.[fam] || modelsManifest.pedestals?.neutral || './r/3d/pedestals/neutral.glb';
}

export async function createMiniFigurineGroup(options) {
  const {
    slug,
    families = ['Neutral'],
    team = 'player',
    withTeamRing = true,
    pedestalOverride = null,
    useUniqueMaterials = true,
  } = options;

  const entry = resolveMiniModelEntry(slug);
  const group = new THREE.Group();
  const ownedMaterials = [];

  const noPedestal = Boolean(entry?.noPedestal);
  if (!noPedestal) {
    const pedUrl = resolvePedestalUrl(families, pedestalOverride || entry?.pedestal);
    try {
      const pedTpl = await loadGlbTemplate(pedUrl);
      const ped = useUniqueMaterials ? cloneSceneWithUniqueMaterials(pedTpl) : pedTpl.clone(true);
      if (ped.userData?.ownedMaterials) ownedMaterials.push(...ped.userData.ownedMaterials);
      ped.position.y = 0.04;
      group.add(ped);
    } catch {
      // Fallback if pedestal unavailable
    }
  }

  if (withTeamRing) {
    const ringMat = new THREE.MeshBasicMaterial({
      color: team === 'player' ? 0x38bdf8 : 0xef4444,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    ownedMaterials.push(ringMat);
    const ringMesh = new THREE.Mesh(sharedRingGeo, ringMat);
    ringMesh.position.y = 0.08;
    group.add(ringMesh);
  }

  // Contact shadow disc directly on ground plane (stays on Y=0 even when flyer hovers)
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x050307,
    transparent: true,
    opacity: 0.44,
    depthWrite: false,
  });
  ownedMaterials.push(shadowMat);
  const shadowDisc = new THREE.Mesh(sharedShadowGeo, shadowMat);
  shadowDisc.position.y = 0.05;
  group.userData.shadowDisc = shadowDisc;

  if (entry?.glb) {
    try {
      const miniTpl = await loadGlbTemplate(entry.glb);
      const mini = useUniqueMaterials ? cloneSceneWithUniqueMaterials(miniTpl) : miniTpl.clone(true);
      if (mini.userData?.ownedMaterials) ownedMaterials.push(...mini.userData.ownedMaterials);
      // Center figure on top of 3D pedestal (pedestal top surface is at y=0.344)
      mini.position.y = noPedestal ? 0.02 : 0.34;
      group.add(mini);
      group.userData.figurineMesh = mini;
    } catch {
      // Fallback box if individual model fails
    }
  }

  group.userData.ownedMaterials = ownedMaterials;
  return group;
}

export function preloadDeckModels(slugs = []) {
  const urls = new Set([
    modelsManifest.env?.onyxiaLair,
    modelsManifest.poi?.['onyxia-boss']?.glb,
    modelsManifest.poi?.['player-keep']?.glb,
    modelsManifest.poi?.['tower-player']?.glb,
    modelsManifest.poi?.['tower-enemy']?.glb,
    modelsManifest.poi?.['gold-mine']?.glb,
    modelsManifest.poi?.['treasure-chest']?.glb,
    modelsManifest.poi?.['lane-switch']?.glb,
    modelsManifest.poi?.['lane-switch-arrow']?.glb,
    modelsManifest.poi?.['onyxia-warder']?.glb,
    modelsManifest.poi?.['kobold-miner']?.glb,
    modelsManifest.poi?.['onyxia-egg']?.glb,
    modelsManifest.poi?.['onyxia-whelp']?.glb,
    modelsManifest.pedestals?.neutral,
  ]);
  for (const s of slugs) {
    const e = resolveMiniModelEntry(s);
    if (e?.glb) urls.add(e.glb);
    if (e?.pedestal && modelsManifest.pedestals?.[e.pedestal]) {
      urls.add(modelsManifest.pedestals[e.pedestal]);
    }
  }
  const tasks = [];
  for (const u of urls) {
    if (u) tasks.push(loadGlbTemplate(u).catch(() => null));
  }
  return Promise.all(tasks);
}
