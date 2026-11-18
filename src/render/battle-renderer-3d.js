import * as THREE from 'three';
import {
  ARENA_BOUNDS,
  ONYXIA_POS,
  dist2D,
  getPlayerDeployZones,
  getSwitchTargetPoint,
  isValidDeployPosition,
} from '../engine/onyxia-map.js';
import {
  cloneSceneWithUniqueMaterials,
  createMiniFigurineGroup,
  disposeClonedMaterials,
  getModelsManifest,
  loadGlbTemplate,
} from './model-cache.js';

function createFallbackToken(team) {
  const grp = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: team === 'player' ? 0x38bdf8 : 0xef4444,
    roughness: 0.45,
    metalness: 0.25,
  });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.88, 0.35, 18), mat);
  disc.position.y = 0.18;
  disc.castShadow = true;
  const bust = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.9, 6, 12), mat);
  bust.position.y = 1.1;
  bust.castShadow = true;
  grp.add(disc, bust);
  grp.userData.ownedMaterials = [mat];
  return grp;
}

function unitDisplayScale(unit) {
  if (unit.isEgg) return 0.92;
  if (unit.slug === 'onyxia-whelp' || unit.slug === 'player-whelp') return 1.05;
  if (unit.slug === 'onyxia-warder') return 0.82;
  if (unit.slug === 'kobold-miner') return 0.68;
  if (unit.spec?.isLeader) return 0.78;
  if (unit.weight === 'heavy') return 0.74;
  if (unit.weight === 'light') return 0.56;
  return 0.66;
}

export class BattleRenderer3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.manifest = getModelsManifest();
    this.disposed = false;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x12090c);
    this.scene.fog = new THREE.FogExp2(0x140a0d, 0.0052);

    this.camera = new THREE.PerspectiveCamera(38, 9 / 16, 1.0, 280);
    this.focusZ = 4;
    this.targetFocusZ = 4;
    this._loadedBossGlb = null;

    this._raycaster = new THREE.Raycaster();
    this._groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this._rayHit = new THREE.Vector3();

    this._time = 0;
    this._lastNow = performance.now();

    // Scene hierarchy groups
    this.envGroup = new THREE.Group();
    this.structuresGroup = new THREE.Group();
    this.minesGroup = new THREE.Group();
    this.chestsGroup = new THREE.Group();
    this.switchesGroup = new THREE.Group();
    this.deployGridGroup = new THREE.Group();
    this.unitsGroup = new THREE.Group();
    this.totemsGroup = new THREE.Group();
    this.projectilesGroup = new THREE.Group();
    this.fxGroup = new THREE.Group();
    this.bossGroup = new THREE.Group();

    this.scene.add(
      this.envGroup,
      this.deployGridGroup,
      this.switchesGroup,
      this.minesGroup,
      this.chestsGroup,
      this.structuresGroup,
      this.bossGroup,
      this.totemsGroup,
      this.unitsGroup,
      this.projectilesGroup,
      this.fxGroup
    );

    // Instance tracking maps
    this._structureMeshes = new Map();
    this._mineMeshes = new Map();
    this._chestMeshes = new Map();
    this._switchMeshes = new Map();
    this._unitNodes = new Map();
    this._unitLoading = new Set();
    this._bossNode = null;
    this._reticleGroup = null;

    this._setupLighting();
    this._setupLavaAndEmbers();
    this._setupDeployReticle();
    this._loadStaticEnvironment();
    this._loadBossModel('./r/3d/poi/onyxia-boss.glb', 1.0);
  }

  _setupLighting() {
    const hemi = new THREE.HemisphereLight(0xffdcb8, 0x3b1815, 0.95);
    this.scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffe0b2, 1.9);
    keyLight.position.set(18, 46, 26);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 5;
    keyLight.shadow.camera.far = 140;
    keyLight.shadow.camera.left = -36;
    keyLight.shadow.camera.right = 36;
    keyLight.shadow.camera.top = 90;
    keyLight.shadow.camera.bottom = -20;
    keyLight.shadow.bias = -0.0008;
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.72);
    rimLight.position.set(-24, 30, -85);
    this.scene.add(rimLight);

    const lavaPoints = [
      [9.6, 2.2, -16.0],
      [-10.1, 2.2, -22.4],
      [1.8, 2.2, -38.2],
      [-2.6, 2.2, -56.4],
      [0.0, 7.5, -75.0],
    ];
    this._lavaLights = [];
    for (const [lx, ly, lz] of lavaPoints) {
      const pl = new THREE.PointLight(0xff5a1f, 18, 34, 1.5);
      pl.position.set(lx, ly, lz);
      this.scene.add(pl);
      this._lavaLights.push(pl);
    }
  }

  _setupLavaAndEmbers() {
    const lavaGeo = new THREE.PlaneGeometry(130, 175, 1, 1);
    lavaGeo.rotateX(-Math.PI / 2);

    this._lavaUniforms = {
      uTime: { value: 0 },
    };

    const lavaMat = new THREE.ShaderMaterial({
      uniforms: this._lavaUniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }
        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p *= 2.04;
            a *= 0.5;
          }
          return v;
        }
        void main() {
          vec2 uv = vUv * vec2(10.0, 14.0);
          float q = fbm(uv + vec2(uTime * 0.06, -uTime * 0.04));
          float n = fbm(uv + 2.2 * q + vec2(-uTime * 0.05, uTime * 0.07));
          vec3 crust = vec3(0.24, 0.03, 0.01);
          vec3 magma = vec3(1.15, 0.30, 0.02);
          vec3 hot = vec3(1.55, 0.78, 0.14);
          vec3 col = mix(crust, magma, smoothstep(0.32, 0.62, n));
          col = mix(col, hot, smoothstep(0.64, 0.85, n));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    const lavaMesh = new THREE.Mesh(lavaGeo, lavaMat);
    lavaMesh.position.set(0, -1.35, -39);
    this.envGroup.add(lavaMesh);

    // Rising glowing ember particles
    const emberCount = 160;
    const pos = new Float32Array(emberCount * 3);
    this._emberSeeds = new Float32Array(emberCount * 2);
    for (let i = 0; i < emberCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = Math.random() * 14;
      pos[i * 3 + 2] = -Math.random() * 96 + 10;
      this._emberSeeds[i * 2 + 0] = 0.6 + Math.random() * 1.6;
      this._emberSeeds[i * 2 + 1] = Math.random() * Math.PI * 2;
    }
    const emberGeo = new THREE.BufferGeometry();
    emberGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0xffa040,
      size: 0.42,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this._embers = new THREE.Points(emberGeo, emberMat);
    this.envGroup.add(this._embers);
  }

  _setupDeployReticle() {
    const grp = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(0.95, 1.25, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.14;

    const aoeGeo = new THREE.RingGeometry(0.92, 1.0, 40);
    aoeGeo.rotateX(-Math.PI / 2);
    const aoeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const aoeRing = new THREE.Mesh(aoeGeo, aoeMat);
    aoeRing.position.y = 0.13;

    grp.add(ring, aoeRing);
    grp.visible = false;
    grp.userData.ringMat = ringMat;
    grp.userData.aoeRing = aoeRing;
    grp.userData.aoeMat = aoeMat;
    this.deployGridGroup.add(grp);
    this._reticleGroup = grp;
  }

  async _loadStaticEnvironment() {
    try {
      const envUrl = this.manifest.env?.onyxiaLair || './r/3d/env/onyxia-lair.glb';
      const tpl = await loadGlbTemplate(envUrl);
      if (this.disposed) return;
      const envClone = tpl.clone(true);
      this.envGroup.add(envClone);
    } catch (err) {
      console.warn('Failed to load Onyxia 3D environment:', err);
    }
  }

  async _loadBossModel(url = './r/3d/poi/onyxia-boss.glb', bossScale = 1.0) {
    if (this._loadedBossGlb === url) return;
    this._loadedBossGlb = url;
    try {
      const tpl = await loadGlbTemplate(url);
      if (this.disposed) return;
      if (this._bossNode) {
        this.bossGroup.remove(this._bossNode);
        disposeClonedMaterials(this._bossNode);
        this._bossNode = null;
      }
      const boss = cloneSceneWithUniqueMaterials(tpl);
      boss.position.set(ONYXIA_POS.x, 0.0, -ONYXIA_POS.z);
      boss.userData.baseScale = bossScale;
      if (bossScale !== 1.0) {
        boss.scale.setScalar(bossScale);
      }

      const auraGeo = new THREE.RingGeometry(7.2, 8.6, 48);
      auraGeo.rotateX(-Math.PI / 2);
      const auraMat = new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.42,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      aura.position.y = 0.14;
      aura.scale.setScalar(1 / Math.max(0.5, bossScale));
      boss.add(aura);
      boss.userData.auraMat = auraMat;
      boss.userData.ownedMaterials.push(auraMat);

      this.bossGroup.add(boss);
      this._bossNode = boss;
    } catch (err) {
      console.warn('Failed to load boss model:', url, err);
    }
  }

  getFocusZ() {
    return this.focusZ;
  }

  setFocusZ(z) {
    this.targetFocusZ = Math.max(2, Math.min(76, z));
  }

  panByDeltaZ(dz) {
    this.setFocusZ(this.targetFocusZ + dz);
  }

  ensureSize() {
    const w = this.canvas.clientWidth || 480;
    const h = this.canvas.clientHeight || 820;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const needW = Math.round(w * dpr);
    const needH = Math.round(h * dpr);
    if (this.canvas.width !== needW || this.canvas.height !== needH) {
      this.renderer.setPixelRatio(dpr);
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / Math.max(1, h);
      this.camera.updateProjectionMatrix();
    }
    return { w, h };
  }

  screenToWorld(sx, sy) {
    const { w, h } = this.ensureSize();
    const ndcX = (sx / Math.max(1, w)) * 2 - 1;
    const ndcY = -(sy / Math.max(1, h)) * 2 + 1;
    this._raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
    const ok = this._raycaster.ray.intersectPlane(this._groundPlane, this._rayHit);
    if (!ok) {
      return { x: 0, z: this.focusZ };
    }
    return {
      x: Math.max(ARENA_BOUNDS.xMin - 2, Math.min(ARENA_BOUNDS.xMax + 2, this._rayHit.x)),
      z: Math.max(ARENA_BOUNDS.zMin - 2, Math.min(ARENA_BOUNDS.zMax + 2, -this._rayHit.z)),
    };
  }

  projectWorldToScreen(x, y, z) {
    const { w, h } = this.ensureSize();
    const v = new THREE.Vector3(x, y, -z);
    v.project(this.camera);
    const visible = v.z >= -1 && v.z <= 1 && v.x >= -1.15 && v.x <= 1.15 && v.y >= -1.15 && v.y <= 1.15;
    return {
      x: (v.x * 0.5 + 0.5) * w,
      y: (-v.y * 0.5 + 0.5) * h,
      visible,
    };
  }

  findSwitchAtWorld(sim, x, z) {
    for (const sw of Object.values(sim.switches || {})) {
      if (dist2D(x, z, sw.x, sw.z) <= 3.5) {
        return sw.id;
      }
    }
    return null;
  }

  render(sim, uiState = {}) {
    if (this.disposed) return;
    const now = performance.now();
    const dt = Math.min(0.08, Math.max(0.001, (now - this._lastNow) / 1000));
    this._lastNow = now;
    this._time += dt;

    this.ensureSize();

    // Update molten magma shader & volcanic embers
    if (this._lavaUniforms) this._lavaUniforms.uTime.value = this._time;
    this._tickEmbers(dt);

    // Smooth camera pan + trauma shake
    this.focusZ += (this.targetFocusZ - this.focusZ) * Math.min(1, dt * 11);
    const shakeAmt = sim.shakeTimer > 0 ? sim.shakeIntensity * (sim.shakeTimer / 1.1) : 0;
    const shakeX = shakeAmt > 0 ? Math.sin(this._time * 47) * shakeAmt : 0;
    const shakeY = shakeAmt > 0 ? Math.cos(this._time * 39) * shakeAmt * 0.6 : 0;

    this.camera.position.set(shakeX, 46 + shakeY, -this.focusZ + 18.5);
    this.camera.lookAt(shakeX * 0.35, 0, -this.focusZ - 2.5);

    if (sim.mission?.bossGlb && sim.mission.bossGlb !== this._loadedBossGlb) {
      this._loadBossModel(sim.mission.bossGlb, sim.mission.bossScale || 2.35);
    }

    this._syncStructures(sim);
    this._syncMines(sim);
    this._syncChests(sim);
    this._syncSwitches(sim);
    this._syncBoss(sim);
    this._syncUnits(sim);
    this._syncTotems(sim);
    this._syncProjectiles(sim);
    this._syncFx(sim);
    this._syncDeployHighlights(sim, uiState);

    this.renderer.render(this.scene, this.camera);
  }

  _tickEmbers(dt) {
    if (!this._embers) return;
    const attr = this._embers.geometry.getAttribute('position');
    const arr = attr.array;
    const count = arr.length / 3;
    for (let i = 0; i < count; i++) {
      const spd = this._emberSeeds[i * 2 + 0];
      const ph = this._emberSeeds[i * 2 + 1];
      arr[i * 3 + 1] += spd * dt * 2.2;
      arr[i * 3 + 0] += Math.sin(this._time * 1.5 + ph) * 0.35 * dt;
      if (arr[i * 3 + 1] > 15) {
        arr[i * 3 + 1] = -0.8;
        arr[i * 3 + 0] = (Math.random() - 0.5) * 58;
        arr[i * 3 + 2] = -Math.random() * 94 + 10;
      }
    }
    attr.needsUpdate = true;
  }

  _syncStructures(sim) {
    for (const s of sim.structures || []) {
      const desiredKey = `${s.kind}:${s.team}`;
      let rec = this._structureMeshes.get(s.id);

      if (!rec || (rec.key !== desiredKey && !rec.loading)) {
        if (rec) {
          this.structuresGroup.remove(rec.group);
          disposeClonedMaterials(rec.group);
          this._structureMeshes.delete(s.id);
        }
        const grp = new THREE.Group();
        grp.position.set(s.x, 0, -s.z);
        // Reconstruction ring
        const ringGeo = new THREE.RingGeometry(2.6, 3.1, 32);
        ringGeo.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
          color: s.team === 'player' ? 0x38bdf8 : 0xef4444,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const teamRing = new THREE.Mesh(ringGeo, ringMat);
        teamRing.position.y = 0.08;
        grp.add(teamRing);

        this.structuresGroup.add(grp);
        rec = { key: desiredKey, group: grp, loading: true, model: null, ragDome: null, ragModel: null, ringMat };
        this._structureMeshes.set(s.id, rec);

        const poiKey = s.kind === 'base' ? 'player-keep' : s.team === 'player' ? 'tower-player' : 'tower-enemy';
        const glbUrl = this.manifest.poi?.[poiKey]?.glb;
        if (glbUrl) {
          loadGlbTemplate(glbUrl)
            .then((tpl) => {
              const cur = this._structureMeshes.get(s.id);
              if (this.disposed || !cur || cur.group !== grp) return;
              const model = cloneSceneWithUniqueMaterials(tpl);
              if (s.team === 'enemy') model.rotation.y = Math.PI;
              grp.add(model);
              cur.model = model;
              cur.loading = false;
            })
            .catch(() => {
              rec.loading = false;
            });
        }
      }

      // Sink slightly during 2.5s rebuild and flash on hit
      const sinkY = s.rebuilding ? -2.4 * (s.rebuildTimer / 2.5) : 0;
      rec.group.position.set(s.x, sinkY, -s.z);
      rec.group.visible = s.hp > 0 || s.rebuilding;
      rec.ringMat.color.setHex(s.team === 'player' ? 0x38bdf8 : 0xef4444);
      rec.ringMat.opacity = s.rebuilding ? 0.35 + 0.3 * Math.sin(this._time * 10) : 0.65;

      if (rec.model) {
        const flash = s.hitFlashTimer > 0;
        for (const mat of rec.model.userData?.ownedMaterials || []) {
          if (mat.emissive) mat.emissive.setHex(flash ? 0xffffff : 0x000000);
          if (mat.emissiveIntensity !== undefined) mat.emissiveIntensity = flash ? 0.55 : 0.0;
        }
      }

      // Ragnaros fiery shield & perched avatar on protected structure
      const hasRag = s.ragnarosShield > 0 && !s.rebuilding;
      if (hasRag && !rec.ragDome) {
        const domeMat = new THREE.MeshBasicMaterial({
          color: 0xf97316,
          transparent: true,
          opacity: 0.24,
          wireframe: true,
        });
        const dome = new THREE.Mesh(new THREE.SphereGeometry(s.radius + 1.1, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
        rec.group.add(dome);
        rec.ragDome = dome;
        const ragUrl = this.manifest.minis?.ragnaros?.glb;
        if (ragUrl) {
          loadGlbTemplate(ragUrl).then((tpl) => {
            if (this.disposed) return;
            const rm = tpl.clone(true);
            rm.scale.setScalar(0.8);
            rm.position.set(0, s.kind === 'base' ? 4.4 : 3.9, 0);
            rm.rotation.y = Math.PI;
            rec.group.add(rm);
            rec.ragModel = rm;
          });
        }
      }
      if (rec.ragDome) rec.ragDome.visible = hasRag;
      if (rec.ragModel) rec.ragModel.visible = hasRag;
    }
  }

  _syncMines(sim) {
    for (const m of sim.mines || []) {
      let rec = this._mineMeshes.get(m.id);
      if (!rec) {
        const grp = new THREE.Group();
        grp.position.set(m.x, 0, -m.z);
        this.minesGroup.add(grp);

        // 3 golden crystal nuggets indicating remaining gold stacks (0..3)
        const crystals = [];
        const cryGeo = new THREE.OctahedronGeometry(0.42, 0);
        const cryMat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          emissive: 0xd97706,
          emissiveIntensity: 0.85,
          metalness: 0.65,
          roughness: 0.25,
        });
        const offsets = [
          [-1.1, 0.5, 1.1],
          [1.0, 0.45, 1.2],
          [0.0, 0.55, 1.65],
        ];
        for (const [ox, oy, oz] of offsets) {
          const mesh = new THREE.Mesh(cryGeo, cryMat);
          mesh.position.set(ox, oy, oz);
          grp.add(mesh);
          crystals.push(mesh);
        }

        rec = { group: grp, crystals };
        this._mineMeshes.set(m.id, rec);

        const url = this.manifest.poi?.['gold-mine']?.glb;
        if (url) {
          loadGlbTemplate(url).then((tpl) => {
            if (this.disposed) return;
            const model = tpl.clone(true);
            model.rotation.y = m.x < 0 ? 0.5 : -0.5;
            grp.add(model);
          });
        }
      }

      rec.crystals.forEach((c, idx) => {
        c.visible = idx < m.gold;
        if (c.visible) {
          c.rotation.y = this._time * 1.4 + idx;
          c.position.y = 0.5 + Math.sin(this._time * 2.5 + idx) * 0.1;
        }
      });
    }
  }

  _syncChests(sim) {
    for (const c of sim.chests || []) {
      let grp = this._chestMeshes.get(c.id);
      if (!grp) {
        grp = new THREE.Group();
        grp.position.set(c.x, 0, -c.z);
        this.chestsGroup.add(grp);
        this._chestMeshes.set(c.id, grp);

        const url = this.manifest.poi?.['treasure-chest']?.glb;
        if (url) {
          loadGlbTemplate(url).then((tpl) => {
            if (this.disposed) return;
            const model = tpl.clone(true);
            grp.add(model);
          });
        }
      }
      grp.visible = Boolean(c.alive);
      if (c.alive) {
        grp.rotation.y = Math.sin(this._time * 1.1) * 0.08;
      }
    }
  }

  _syncSwitches(sim) {
    for (const sw of Object.values(sim.switches || {})) {
      let rec = this._switchMeshes.get(sw.id);
      if (!rec) {
        const grp = new THREE.Group();
        grp.position.set(sw.x, 0.06, -sw.z);
        this.switchesGroup.add(grp);

        const ringGeo = new THREE.RingGeometry(1.75, 2.05, 28);
        ringGeo.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xfacc15,
          transparent: true,
          opacity: 0.72,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.y = 0.04;
        grp.add(ring);

        const arrowHolder = new THREE.Group();
        arrowHolder.position.y = 0.36;
        grp.add(arrowHolder);

        rec = { group: grp, arrowHolder, curYaw: 0 };
        this._switchMeshes.set(sw.id, rec);

        const baseUrl = this.manifest.poi?.['lane-switch']?.glb;
        const arrowUrl = this.manifest.poi?.['lane-switch-arrow']?.glb;
        if (baseUrl) {
          loadGlbTemplate(baseUrl).then((tpl) => {
            if (!this.disposed) grp.add(tpl.clone(true));
          });
        }
        if (arrowUrl) {
          loadGlbTemplate(arrowUrl).then((tpl) => {
            if (!this.disposed) arrowHolder.add(tpl.clone(true));
          });
        }
      }

      const targetPt = getSwitchTargetPoint(sw, 'player');
      if (targetPt) {
        // Pointy tip of lane-switch-arrow.glb is along +X -> rotateY(atan2(dz, dx)) aims at target
        const desiredYaw = Math.atan2(targetPt.z - sw.z, targetPt.x - sw.x);
        rec.arrowHolder.rotation.y = desiredYaw;
      }
    }
  }

  _syncBoss(sim) {
    const boss = sim.boss;
    if (!boss || !this._bossNode) return;
    this._bossNode.visible = boss.alive;
    if (!boss.alive) return;

    // Breathing & breath lunge animation
    const baseScale = this._bossNode.userData?.baseScale || 1.0;
    const breathPulse = Math.sin(this._time * 2.2) * 0.025;
    const lungeProgress = boss.attackAnimTimer > 0 ? Math.sin((boss.attackAnimTimer / 0.65) * Math.PI) : 0;
    this._bossNode.position.set(boss.x, 0, -boss.z + lungeProgress * 1.4);
    this._bossNode.scale.set(
      baseScale * (1 + breathPulse * 0.5),
      baseScale * (1 + breathPulse),
      baseScale * (1 + breathPulse * 0.5)
    );

    const aimOffset = THREE.MathUtils.clamp((boss.yaw || Math.PI) - Math.PI, -0.45, 0.45);
    this._bossNode.rotation.y = -aimOffset;

    const flash = boss.hitFlashTimer > 0;
    for (const mat of this._bossNode.userData?.ownedMaterials || []) {
      if (mat === this._bossNode.userData.auraMat) continue;
      if (mat.emissive) {
        mat.emissive.setHex(flash ? 0xffffff : boss.phase === 3 ? 0x3b0764 : boss.phase === 2 ? 0x7c2d12 : 0x000000);
      }
      if (mat.emissiveIntensity !== undefined) {
        mat.emissiveIntensity = flash ? 0.55 : boss.phase >= 2 ? 0.22 : 0.0;
      }
    }
    if (this._bossNode.userData.auraMat) {
      this._bossNode.userData.auraMat.color.setHex(
        boss.phase === 3 ? 0xa855f7 : boss.phase === 2 ? 0x38bdf8 : 0xf97316
      );
    }
  }

  _syncUnits(sim) {
    const activeIds = new Set();

    for (const u of sim.units || []) {
      if (!u.alive || u.attachedStructureId) continue;
      activeIds.add(u.id);

      let node = this._unitNodes.get(u.id);
      if (!node) {
        node = createFallbackToken(u.team);
        node.scale.setScalar(unitDisplayScale(u));
        this.unitsGroup.add(node);
        this._unitNodes.set(u.id, node);

        if (!this._unitLoading.has(u.id)) {
          this._unitLoading.add(u.id);
          createMiniFigurineGroup({
            slug: u.slug,
            families: u.spec?.families || ['Neutral'],
            team: u.team,
            withTeamRing: !u.isEgg,
            useUniqueMaterials: true,
          })
            .then((figGroup) => {
              this._unitLoading.delete(u.id);
              const existing = this._unitNodes.get(u.id);
              if (this.disposed || !existing) {
                disposeClonedMaterials(figGroup);
                return;
              }
              this.unitsGroup.remove(existing);
              disposeClonedMaterials(existing);

              figGroup.scale.setScalar(unitDisplayScale(u));
              this.unitsGroup.add(figGroup);
              this._unitNodes.set(u.id, figGroup);
            })
            .catch(() => {
              this._unitLoading.delete(u.id);
            });
        }
      }

      // Compute procedural tabletop animations (sky-drop, hop-walk, flyer hover, attack lunge)
      const numId = typeof u.id === 'string' ? Number(u.id.replace(/\D/g, '')) || 0 : 0;
      const dropProgress = u.spawnDropTimer > 0 ? u.spawnDropTimer / 0.28 : 0;
      const dropY = dropProgress * dropProgress * 13.0;
      const flyY = u.isFlying ? 3.1 + Math.sin(this._time * 3.8 + numId) * 0.32 : 0;
      const hopY = !u.isFlying && !u.stationary && dropProgress === 0 ? Math.abs(Math.sin(u.walkPhase || 0)) * 0.36 : 0;
      const wobbleZ = !u.isFlying && !u.stationary && dropProgress === 0 ? Math.sin(u.walkPhase || 0) * 0.08 : 0;

      const atkSin = u.attackAnimTimer > 0 ? Math.sin((u.attackAnimTimer / 0.38) * Math.PI) : 0;
      const lungeDist = atkSin * 0.55;
      const lx = Math.sin(u.yaw || 0) * lungeDist;
      const lz = Math.cos(u.yaw || 0) * lungeDist;

      node.position.set(u.x + lx, dropY + flyY + hopY, -(u.z + lz));

      // All minis face +Z locally; yaw=0 (North) -> Three rotation.y = Math.PI (-Z_three)
      if (u.polymorphTimer > 0) {
        node.rotation.y = this._time * 5.0;
        node.scale.setScalar(unitDisplayScale(u) * 0.55);
      } else {
        node.rotation.y = Math.PI - (u.yaw || 0);
        node.rotation.z = wobbleZ;
        node.rotation.x = atkSin * 0.22;
        node.scale.setScalar(unitDisplayScale(u));
      }

      // Keep shadow disc pinned on ground if attached
      if (node.userData?.shadowDisc) {
        const sd = node.userData.shadowDisc;
        if (!sd.parent) node.add(sd);
        sd.position.y = Math.max(-dropY - flyY - hopY + 0.06, -(dropY + flyY + hopY) + 0.06);
      }

      // Status material feedback (hit-flash, frost, poison, stealth, polymorph)
      const mats = node.userData?.ownedMaterials || [];
      for (const mat of mats) {
        if (mat.isMeshBasicMaterial) continue;
        if (u.hitFlashTimer > 0 && mat.emissive) {
          mat.emissive.setHex(0xffffff);
          if (mat.emissiveIntensity !== undefined) mat.emissiveIntensity = 0.65;
        } else if (u.frostTimer > 0 && mat.emissive) {
          mat.emissive.setHex(0x38bdf8);
          if (mat.emissiveIntensity !== undefined) mat.emissiveIntensity = 0.4;
        } else if (u.poisonStacks > 0 && mat.emissive) {
          mat.emissive.setHex(0x84cc16);
          if (mat.emissiveIntensity !== undefined) mat.emissiveIntensity = 0.35;
        } else if (u.polymorphTimer > 0 && mat.emissive) {
          mat.emissive.setHex(0xf472b6);
          if (mat.emissiveIntensity !== undefined) mat.emissiveIntensity = 0.45;
        } else if (mat.emissive) {
          mat.emissive.setHex(0x000000);
          if (mat.emissiveIntensity !== undefined) mat.emissiveIntensity = 0;
        }

        if (u.stealthActive) {
          mat.transparent = true;
          mat.opacity = 0.45;
        } else if (mat.opacity !== 1.0 && !mat.alphaMap) {
          mat.transparent = false;
          mat.opacity = 1.0;
        }
      }
    }

    // Cleanup despawned/dead units cleanly
    for (const [id, node] of this._unitNodes.entries()) {
      if (!activeIds.has(id)) {
        this.unitsGroup.remove(node);
        disposeClonedMaterials(node);
        this._unitNodes.delete(id);
      }
    }
  }

  _syncTotems(sim) {
    while (this.totemsGroup.children.length > 0) {
      const ch = this.totemsGroup.children.pop();
      ch.geometry?.dispose?.();
      ch.material?.dispose?.();
    }
    const colors = { windfury: 0x38bdf8, healing: 0x4ade80, searing: 0xf97316, earthbind: 0xa16207 };
    for (const t of sim.totems || []) {
      const col = colors[t.kind] || 0xfacc15;
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.45, 2.2, 8),
        new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.45 })
      );
      pillar.position.set(t.x, 1.1, -t.z);
      const aura = new THREE.Mesh(
        new THREE.RingGeometry(5.5, 5.8, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false })
      );
      aura.position.set(t.x, 0.08, -t.z);
      this.totemsGroup.add(pillar, aura);
    }
  }

  _syncProjectiles(sim) {
    while (this.projectilesGroup.children.length > 0) {
      const ch = this.projectilesGroup.children.pop();
      ch.material?.dispose?.();
    }
    if (!this._sharedOrbGeo) {
      this._sharedOrbGeo = new THREE.SphereGeometry(0.34, 10, 10);
    }
    for (const p of sim.projectiles || []) {
      const remainingDist = dist2D(p.x, p.z, p.target?.x ?? p.x, p.target?.z ?? p.z);
      const progress = p.totalDist > 0.1 ? 1 - Math.min(1, remainingDist / p.totalDist) : 0.5;
      const arcY = (p.yHeight || 1.5) * (1 - progress * 0.4) + Math.sin(progress * Math.PI) * 2.2;

      const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(p.color || '#fbbf24') });
      const mesh = new THREE.Mesh(this._sharedOrbGeo, mat);
      mesh.position.set(p.x, arcY, -p.z);
      if (p.splashRadius > 0) mesh.scale.setScalar(1.35);
      this.projectilesGroup.add(mesh);
    }
  }

  _syncFx(sim) {
    while (this.fxGroup.children.length > 0) {
      const ch = this.fxGroup.children.pop();
      ch.geometry?.dispose?.();
      ch.material?.dispose?.();
    }

    for (const fx of sim.fx || []) {
      const t = Math.min(1, fx.age / Math.max(0.05, fx.duration));
      const alpha = 1 - t;
      const col = new THREE.Color(fx.color || '#f97316');

      if (fx.kind === 'phase-sweep') {
        const r = Math.max(4, fx.radius * t);
        const wall = new THREE.Mesh(
          new THREE.RingGeometry(Math.max(1, r - 3.2), r, 48).rotateX(-Math.PI / 2),
          new THREE.MeshBasicMaterial({
            color: 0xff4500,
            transparent: true,
            opacity: 0.78 * alpha,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );
        wall.position.set(fx.x, 0.6, -fx.z);
        this.fxGroup.add(wall);
      } else if (fx.kind === 'explosion') {
        const r = Math.max(0.5, (fx.radius || 3.5) * (0.3 + 0.7 * t));
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(r, 16, 12),
          new THREE.MeshBasicMaterial({
            color: col,
            transparent: true,
            opacity: 0.48 * alpha,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );
        sphere.position.set(fx.x, 0.9, -fx.z);
        this.fxGroup.add(sphere);
      } else if (fx.kind === 'ring') {
        const r = Math.max(0.5, (fx.radius || 3.0) * (0.4 + 0.6 * t));
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(r * 0.82, r, 32).rotateX(-Math.PI / 2),
          new THREE.MeshBasicMaterial({
            color: col,
            transparent: true,
            opacity: 0.75 * alpha,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        );
        ring.position.set(fx.x, 0.16, -fx.z);
        this.fxGroup.add(ring);
      } else if (fx.kind === 'blizzard') {
        const r = fx.radius || 6.5;
        const zone = new THREE.Mesh(
          new THREE.CircleGeometry(r, 32).rotateX(-Math.PI / 2),
          new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.25 * alpha + 0.12,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        );
        zone.position.set(fx.x, 0.15, -fx.z);
        this.fxGroup.add(zone);
      } else if (fx.kind === 'cone-breath') {
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(fx.radius * 0.85, fx.radius * 1.1, 18, 1, true),
          new THREE.MeshBasicMaterial({
            color: 0xff6a00,
            transparent: true,
            opacity: 0.45 * alpha,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );
        // Aim flame cone South (+Z_three) along ground from Onyxia
        cone.rotation.x = -Math.PI / 2;
        cone.position.set(fx.x, 2.0, -(fx.z - fx.radius * 0.55));
        this.fxGroup.add(cone);
      } else if (fx.kind === 'breath-lane') {
        const len = fx.length || 18;
        const beam = new THREE.Mesh(
          new THREE.BoxGeometry(4.4, 1.4, len),
          new THREE.MeshBasicMaterial({
            color: 0xff5a1f,
            transparent: true,
            opacity: 0.55 * alpha,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );
        beam.position.set(fx.x, 1.2, -(fx.z + fx.dir * len * 0.5));
        this.fxGroup.add(beam);
      } else if (fx.kind === 'beam') {
        const p1 = new THREE.Vector3(fx.x1, 1.8, -fx.z1);
        const p2 = new THREE.Vector3(fx.x2, 1.8, -fx.z2);
        const len = p1.distanceTo(p2);
        if (len > 0.1) {
          const cyl = new THREE.Mesh(
            new THREE.CylinderGeometry(0.14, 0.14, len, 6),
            new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: alpha, blending: THREE.AdditiveBlending })
          );
          cyl.position.copy(p1).lerp(p2, 0.5);
          cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
          this.fxGroup.add(cyl);
        }
      }
    }
  }

  _syncDeployHighlights(sim, uiState) {
    const { selectedSlot, hoverWorld } = uiState;
    const spec = selectedSlot != null ? sim.getHandCardSpec(selectedSlot) : null;

    if (selectedSlot == null || !spec) {
      if (this._lastDeployKey !== '') {
        this._clearDeployZoneMeshes();
        this._lastDeployKey = '';
      }
      if (this._reticleGroup) this._reticleGroup.visible = false;
      return;
    }

    const pulse = 0.22 + 0.1 * Math.sin(this._time * 6);
    const zones = !spec.isSpell && !spec.isUnbound && spec.slug !== 'ragnaros' ? getPlayerDeployZones(sim) : [];
    const friendlyKey = (sim.structures || [])
      .filter((s) => s.team === 'player' && s.hp > 0 && !s.rebuilding)
      .map((s) => s.id)
      .join(',');
    const deployKey = `${spec.slug}:${spec.isSpell}:${spec.isUnbound}:${friendlyKey}`;

    if (deployKey !== this._lastDeployKey) {
      this._lastDeployKey = deployKey;
      this._clearDeployZoneMeshes();
      if (zones.length > 0) {
        for (const da of zones) {
          const planeGeo = new THREE.PlaneGeometry(da.width, da.depth);
          planeGeo.rotateX(-Math.PI / 2);
          const planeMat = new THREE.MeshBasicMaterial({
            color: 0x22d3ee,
            transparent: true,
            opacity: pulse,
            side: THREE.DoubleSide,
            depthWrite: false,
          });
          const mesh = new THREE.Mesh(planeGeo, planeMat);
          mesh.position.set(da.x, 0.1, -da.z);
          mesh.userData.isDeployFill = true;
          this.deployGridGroup.add(mesh);

          const edges = new THREE.EdgesGeometry(planeGeo);
          const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.85 })
          );
          line.position.copy(mesh.position);
          this.deployGridGroup.add(line);
        }
      } else if (spec.slug === 'ragnaros') {
        for (const s of sim.structures || []) {
          if (s.team === 'player' && s.hp > 0 && !s.rebuilding) {
            const rMesh = new THREE.Mesh(
              new THREE.RingGeometry(s.radius + 1.8, s.radius + 2.4, 32).rotateX(-Math.PI / 2),
              new THREE.MeshBasicMaterial({ color: 0xfb923c, transparent: true, opacity: 0.75, side: THREE.DoubleSide, depthWrite: false })
            );
            rMesh.position.set(s.x, 0.12, -s.z);
            this.deployGridGroup.add(rMesh);
          }
        }
      }
    } else {
      for (const ch of this.deployGridGroup.children) {
        if (ch.userData?.isDeployFill && ch.material) ch.material.opacity = pulse;
      }
    }

    if (hoverWorld && this._reticleGroup) {
      const check = isValidDeployPosition(hoverWorld.x, hoverWorld.z, spec, sim);
      this._reticleGroup.visible = true;
      this._reticleGroup.position.set(hoverWorld.x, 0, -hoverWorld.z);
      this._reticleGroup.userData.ringMat.color.setHex(check.valid ? 0x4ade80 : 0xef4444);
      const aoeR = spec.isSpell ? 5.2 : spec.slug === 's-a-f-e-pilot' ? 4.4 : 0;
      this._reticleGroup.userData.aoeRing.visible = aoeR > 0;
      if (aoeR > 0) {
        this._reticleGroup.userData.aoeRing.scale.setScalar(aoeR);
        this._reticleGroup.userData.aoeMat.color.setHex(check.valid ? 0x38bdf8 : 0xef4444);
      }
    } else if (this._reticleGroup) {
      this._reticleGroup.visible = false;
    }
  }

  _clearDeployZoneMeshes() {
    for (let i = this.deployGridGroup.children.length - 1; i >= 0; i--) {
      const ch = this.deployGridGroup.children[i];
      if (ch === this._reticleGroup) continue;
      this.deployGridGroup.remove(ch);
      ch.geometry?.dispose?.();
      ch.material?.dispose?.();
    }
  }

  destroy() {
    this.disposed = true;
    for (const node of this._unitNodes.values()) {
      disposeClonedMaterials(node);
    }
    for (const rec of this._structureMeshes.values()) {
      disposeClonedMaterials(rec.group);
    }
    if (this._bossNode) disposeClonedMaterials(this._bossNode);

    this.scene.traverse((obj) => {
      if (obj.geometry && !obj.geometry.userData?.cachedTemplate) {
        obj.geometry.dispose?.();
      }
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of mats) {
          if (m && typeof m.dispose === 'function') m.dispose();
        }
      }
    });
    this.renderer.dispose();
  }
}
