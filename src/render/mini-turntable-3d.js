import * as THREE from 'three';
import { createMiniFigurineGroup, disposeClonedMaterials } from './model-cache.js';

export class MiniTurntable3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.disposed = false;
    this._rafId = null;
    this._loadToken = 0;
    this._currentGroup = null;
    this._yaw = 0.35;
    this._dragging = false;
    this._lastX = 0;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(34, 1, 0.5, 40);
    this.camera.position.set(0, 3.3, 8.2);
    this.camera.lookAt(0, 1.9, 0);

    const hemi = new THREE.HemisphereLight(0xffe6c7, 0x2a1f2d, 1.15);
    const key = new THREE.DirectionalLight(0xffdfa8, 2.0);
    key.position.set(4, 7, 6);
    const rim = new THREE.DirectionalLight(0x60a5fa, 0.95);
    rim.position.set(-5, 4, -5);
    this.scene.add(hemi, key, rim);

    // Subtle rotating tabletop base disc
    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.7, 1.95, 0.25, 32),
      new THREE.MeshStandardMaterial({ color: 0x26212e, roughness: 0.75, metalness: 0.3 })
    );
    plinth.position.y = -0.14;
    this.scene.add(plinth);
    this._plinth = plinth;

    this._onDown = (e) => {
      this._dragging = true;
      this._lastX = e.clientX;
      canvas.setPointerCapture?.(e.pointerId);
    };
    this._onMove = (e) => {
      if (!this._dragging) return;
      const dx = e.clientX - this._lastX;
      this._lastX = e.clientX;
      this._yaw += dx * 0.015;
    };
    this._onUp = () => {
      this._dragging = false;
    };

    canvas.addEventListener('pointerdown', this._onDown);
    window.addEventListener('pointermove', this._onMove);
    window.addEventListener('pointerup', this._onUp);

    this._lastTime = performance.now();
    this._loop(this._lastTime);
  }

  showMini(slug, families = ['Neutral']) {
    return this.setMini(slug, families);
  }

  async setMini(slug, families = ['Neutral']) {
    const token = ++this._loadToken;
    const grp = await createMiniFigurineGroup({
      slug,
      families,
      team: 'player',
      withTeamRing: false,
      useUniqueMaterials: true,
    });
    if (this.disposed || token !== this._loadToken) {
      disposeClonedMaterials(grp);
      return;
    }

    if (this._currentGroup) {
      this.scene.remove(this._currentGroup);
      disposeClonedMaterials(this._currentGroup);
      this._currentGroup = null;
    }

    // Center tall/boss models inside the preview camera nicely
    const box = new THREE.Box3().setFromObject(grp);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 1);
    const scale = 3.9 / maxDim;
    grp.scale.setScalar(scale);
    grp.rotation.y = this._yaw;

    this.scene.add(grp);
    this._currentGroup = grp;
  }

  _resize() {
    const w = this.canvas.clientWidth || 240;
    const h = this.canvas.clientHeight || 220;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (this.canvas.width !== Math.round(w * dpr) || this.canvas.height !== Math.round(h * dpr)) {
      this.renderer.setPixelRatio(dpr);
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / Math.max(1, h);
      this.camera.updateProjectionMatrix();
    }
  }

  _loop(now) {
    if (this.disposed) return;
    const dt = Math.min(0.05, (now - this._lastTime) / 1000);
    this._lastTime = now;

    this._resize();
    if (!this._dragging) {
      this._yaw += dt * 0.55;
    }
    if (this._currentGroup) {
      this._currentGroup.rotation.y = this._yaw;
    }
    this.renderer.render(this.scene, this.camera);
    this._rafId = requestAnimationFrame((t) => this._loop(t));
  }

  destroy() {
    if (this.disposed) return;
    this.disposed = true;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this.canvas.removeEventListener('pointerdown', this._onDown);
    window.removeEventListener('pointermove', this._onMove);
    window.removeEventListener('pointerup', this._onUp);

    if (this._currentGroup) {
      this.scene.remove(this._currentGroup);
      disposeClonedMaterials(this._currentGroup);
    }
    this._plinth?.geometry?.dispose?.();
    this._plinth?.material?.dispose?.();
    this.renderer.dispose();
  }
}
