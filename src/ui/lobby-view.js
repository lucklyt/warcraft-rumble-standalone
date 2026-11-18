import { MINIS } from '../data/minis.js';
import { ONYXIA_METHOD_GUIDE } from '../data/onyxia-guide.js';
import { DIFFICULTY_LEVELS, PRESET_DECKS } from '../data/presets.js';
import { FAMILIES, FAMILY_ORDER } from '../data/translations.js';
import { decodeRumblo, encodeRumblo } from '../services/rumblo.js';
import { getEquippedTalent, MINI_BY_SLUG, resolveMiniSprite } from '../engine/unit-stats.js';
import { normalizeAssetPath } from '../render/asset-loader.js';
import { MiniTurntable3D } from '../render/mini-turntable-3d.js';

let activeTurntable = null;

export function destroyLobbyTurntable() {
  if (activeTurntable) {
    activeTurntable.destroy();
    activeTurntable = null;
  }
}

function esc(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function formatDuration(sec) {
  if (sec == null) return '--';
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export function renderLobbyView(root, modalRoot, appState, callbacks) {
  destroyLobbyTurntable();

  const { save, deck, picker } = appState;
  const leaderMini = MINI_BY_SLUG.get(deck.leader.slug);
  const leaderTalent = getEquippedTalent(leaderMini, deck.leader.talentIndex);
  const troopEntries = deck.troops.map((t, idx) => {
    const mini = MINI_BY_SLUG.get(t.slug);
    const talent = getEquippedTalent(mini, t.talentIndex);
    return { idx, mini, talent, talentIndex: t.talentIndex };
  });

  const inspectedSlug = appState.inspectedSlug || leaderMini?.slug || 'thrall';
  const inspectedMini = MINI_BY_SLUG.get(inspectedSlug) || leaderMini;

  const allCosts = [leaderMini?.cost || 0, ...troopEntries.map((e) => e.mini?.cost || 0)];
  const avgCost = Math.round((allCosts.reduce((a, b) => a + b, 0) / allCosts.length) * 10) / 10;

  let currentCode = '';
  try {
    currentCode = encodeRumblo(deck);
  } catch {
    currentCode = save.activeCode || '';
  }

  const wins = save.records?.wins || 0;
  const attempts = save.records?.attempts || 0;
  const bestRem = save.records?.bestWinRemainingSec;
  const lowestPct = save.records?.lowestBossHpPct ?? 100;

  root.innerHTML = `
    <header class="wr-header">
      <div class="wr-brand">
        <img src="./r/crest.png" alt="魔兽大作战" />
        <div>
          <div class="wr-brand-title">魔兽大作战 · 真3D单机版</div>
          <div class="wr-brand-sub">原版 3D 沙盘与棋子手办 · 56×114 真实路线拓扑 · 零联网依赖</div>
        </div>
      </div>
      <div class="wr-header-right">
        <span class="wr-pill">战绩：${wins}胜 / ${attempts}场 · Boss最低血量 ${lowestPct}%${bestRem != null ? ` · 最快余时 ${formatDuration(bestRem)}` : ''}</span>
        <button type="button" class="wr-btn sm" data-action="toggle-mute">${save.muted ? '已静音' : '音效开'}</button>
      </div>
    </header>

    <main class="wr-lobby-wrap">
      <section class="wr-panel">
        <div class="wr-section-title">
          <span>战队编成工坊（均费 ${avgCost} 金）</span>
          <span class="wr-pill">支持 93 全棋子与 3D 检视</span>
        </div>

        <div class="wr-preset-strip">
          ${PRESET_DECKS.map(
            (p) => `
            <button type="button" class="wr-preset-chip ${save.selectedPresetId === p.id ? 'active' : ''}" data-preset-id="${esc(p.id)}">
              ${esc(p.badge)} · ${esc(p.nameZh.split(' - ')[0].split(' · ')[0])}
            </button>
          `
          ).join('')}
        </div>

        <div class="wr-army-board">
          <div class="wr-slot-card is-leader" role="button" tabindex="0" data-open-picker="leader" data-preview-slug="${esc(leaderMini?.slug)}" title="点击更换主将或天赋">
            <div class="wr-cost-badge">${leaderMini?.cost ?? 0}</div>
            <img class="wr-slot-sprite" src="${esc(normalizeAssetPath(resolveMiniSprite(leaderMini?.slug)))}" alt="${esc(leaderMini?.nameZh)}" />
            <div class="wr-slot-name">${esc(leaderMini?.nameZh || '未选主将')}</div>
            <div class="wr-slot-talent">
              ${leaderTalent?.icon ? `<img src="${esc(normalizeAssetPath(leaderTalent.icon))}" alt="" />` : ''}
              <span>${esc(leaderTalent?.nameZh || '默认天赋')}</span>
            </div>
            <small style="font-size:10px;color:#cbb58c;">点击更换主将/天赋</small>
          </div>

          <div class="wr-troops-grid">
            ${troopEntries
              .map(
                (entry) => `
              <div class="wr-slot-card" role="button" tabindex="0" data-open-picker="${entry.idx}" data-preview-slug="${esc(entry.mini?.slug)}" title="点击更换棋子或天赋">
                <div class="wr-cost-badge">${entry.mini?.cost ?? 0}</div>
                <img class="wr-slot-sprite" src="${esc(normalizeAssetPath(resolveMiniSprite(entry.mini?.slug)))}" alt="${esc(entry.mini?.nameZh)}" />
                <div class="wr-slot-name">${esc(entry.mini?.nameZh || '')}</div>
                <div class="wr-slot-talent">
                  ${entry.talent?.icon ? `<img src="${esc(normalizeAssetPath(entry.talent.icon))}" alt="" />` : ''}
                  <span>${esc(entry.talent?.nameZh || '默认')}</span>
                </div>
                <div class="wr-slot-arrows">
                  <button type="button" class="wr-mini-shift" data-shift-slot="${entry.idx}" data-shift-dir="-1" title="前移槽位">◀</button>
                  <button type="button" class="wr-mini-shift" data-shift-slot="${entry.idx}" data-shift-dir="1" title="后移槽位">▶</button>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="wr-turntable-card">
          <div class="wr-turntable-canvas-box">
            <canvas id="wr-lobby-turntable" width="220" height="200"></canvas>
            <span class="wr-turntable-drag-tip">拖动旋转 3D 模型</span>
          </div>
          <div class="wr-turntable-info">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <strong id="wr-tt-name" style="font-size:15px;color:#ffe7ad;">${esc(inspectedMini?.nameZh || '')}</strong>
              <button type="button" class="wr-btn sm gold" data-preview-slug="onyxia" data-preview-only="1">预览 Boss 奥妮克希亚</button>
            </div>
            <div id="wr-tt-meta" style="font-size:12px;color:#cbb58c;margin:4px 0;">
              费用 ${inspectedMini?.cost ?? 0} 金 · 生命 ${inspectedMini?.health ?? 0} · 伤害 ${inspectedMini?.damage ?? 0}
            </div>
            <div style="font-size:12px;color:#e6dfd5;">
              <strong>主将技 · ${esc(leaderMini?.leaderAbility?.nameZh || leaderMini?.skill?.nameZh || '专属统帅')}：</strong>
              ${esc(leaderMini?.leaderAbility?.descZh || leaderMini?.skill?.descZh || '率领全军出战。')}
            </div>
          </div>
        </div>

        <div class="wr-rumblo-bar">
          <input id="wr-rumblo-input" class="wr-input" type="text" value="${esc(currentCode)}" aria-label="rumblo 分享码" />
          <button type="button" class="wr-btn sm gold" data-action="copy-code">复制分享码</button>
          <button type="button" class="wr-btn sm" data-action="import-code">导入分享码</button>
        </div>
      </section>

      <section class="wr-panel">
        <div class="wr-section-title">
          <span>3D 首领沙盘 · 奥妮克希亚的巢穴</span>
          <span class="wr-pill">56×114 原版地形与路线</span>
        </div>

        <div class="wr-boss-hero">
          <img class="portrait" src="./r/onyxia/Onyxia_Looming.webp" alt="奥妮克希亚" />
          <div>
            <strong style="font-size:16px;color:#fde68a;">黑龙公主 · 奥妮克希亚</strong>
            <p style="margin:4px 0 0;font-size:12px;color:#d6cfc6;">
              正赛 6:00 + 加时 2:00。3D 熔岩巢穴、可操作道岔与部署网格，70% / 40% 全场烈焰扫荡并夺回北侧双塔！
            </p>
          </div>
        </div>

        <div class="wr-diff-grid">
          ${DIFFICULTY_LEVELS.map(
            (d) => `
            <button type="button" class="wr-diff-card ${save.difficultyId === d.id ? 'active' : ''}" data-difficulty="${esc(d.id)}">
              <strong>${esc(d.nameZh)}</strong>
              <small>${esc(d.subtitle)}</small>
            </button>
          `
          ).join('')}
        </div>

        <button type="button" class="wr-btn lg green wr-launch-3d-btn" data-action="start-battle">
          <img src="./r/hud/CombatHUD_Tex_IconPlay.webp" alt="" style="width:18px;height:18px;object-fit:contain;" />
          <span>进入 3D 奥妮克希亚巢穴开战</span>
        </button>

        <img class="wr-map-thumb" src="./r/onyxia/onyxia-map.webp" alt="奥妮克希亚巢穴作战行军地图" data-action="zoom-map" />

        <div class="wr-phase-list">
          ${ONYXIA_METHOD_GUIDE.phases
            .map(
              (ph) => `
            <div class="wr-phase-item">
              <strong>${esc(ph.name)}</strong>
              <span>${esc(ph.points[0])}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </section>
    </main>
  `;

  // Initialize interactive 3D figurine turntable (only while lobby is visible)
  const ttCanvas = root.querySelector('#wr-lobby-turntable');
  if (ttCanvas && !picker.slot) {
    activeTurntable = new MiniTurntable3D(ttCanvas);
    activeTurntable.setMini(inspectedMini?.slug || 'thrall', inspectedMini?.families || ['Horde']);
  }

  // Hover slot previews 3D model on turntable
  root.querySelectorAll('[data-preview-slug]').forEach((el) => {
    const slug = el.dataset.previewSlug;
    const isBossOnly = el.dataset.previewOnly === '1';
    const triggerPreview = () => {
      appState.inspectedSlug = slug;
      if (isBossOnly) {
        activeTurntable?.setMini('onyxia', ['Blackrock']);
        const nm = root.querySelector('#wr-tt-name');
        const mt = root.querySelector('#wr-tt-meta');
        if (nm) nm.textContent = '奥妮克希亚（终局首领）';
        if (mt) mt.textContent = '生命 18,000 · 12码180°半场烈焰吐息 · 三阶段清场';
        return;
      }
      const m = MINI_BY_SLUG.get(slug);
      if (m) {
        activeTurntable?.setMini(m.slug, m.families || ['Neutral']);
        const nm = root.querySelector('#wr-tt-name');
        const mt = root.querySelector('#wr-tt-meta');
        if (nm) nm.textContent = m.nameZh;
        if (mt) mt.textContent = `费用 ${m.cost} 金 · 生命 ${m.health ?? 0} · 伤害 ${m.damage ?? 0}`;
      }
    };
    el.addEventListener(isBossOnly ? 'click' : 'pointerenter', triggerPreview);
  });

  // Standard button bindings
  root.querySelector('[data-action="toggle-mute"]')?.addEventListener('click', callbacks.onToggleMute);
  root.querySelector('[data-action="start-battle"]')?.addEventListener('click', () => {
    destroyLobbyTurntable();
    callbacks.onStartBattle();
  });
  root.querySelector('[data-action="copy-code"]')?.addEventListener('click', () => {
    callbacks.onCopyCode(currentCode);
  });
  root.querySelector('[data-action="import-code"]')?.addEventListener('click', () => {
    const val = root.querySelector('#wr-rumblo-input')?.value || '';
    callbacks.onImportCode(val);
  });
  root.querySelector('[data-action="zoom-map"]')?.addEventListener('click', () => {
    modalRoot.classList.add('open');
    modalRoot.innerHTML = `
      <div class="wr-panel wr-modal-box" style="max-width:560px;text-align:center;">
        <div class="wr-section-title">
          <span>奥妮克希亚巢穴战术地图</span>
          <button type="button" class="wr-btn sm" data-close-modal>关闭</button>
        </div>
        <img src="./r/onyxia/onyxia-map.webp" alt="奥妮克希亚地图" style="width:100%;border-radius:8px;" />
      </div>
    `;
    modalRoot.querySelector('[data-close-modal]')?.addEventListener('click', () => {
      modalRoot.classList.remove('open');
    });
  });

  root.querySelectorAll('[data-preset-id]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onSelectPreset(btn.dataset.presetId));
  });

  root.querySelectorAll('[data-difficulty]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onSelectDifficulty(btn.dataset.difficulty));
  });

  root.querySelectorAll('[data-shift-slot]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      callbacks.onShiftTroop(Number(btn.dataset.shiftSlot), Number(btn.dataset.shiftDir));
    });
  });

  root.querySelectorAll('[data-open-picker]').forEach((el) => {
    el.addEventListener('click', () => callbacks.onOpenPicker(el.dataset.openPicker));
  });

  if (picker.slot != null) {
    renderPickerModal(modalRoot, appState, callbacks);
  } else if (!modalRoot.dataset.keepOpen) {
    modalRoot.classList.remove('open');
  }
}

function renderPickerModal(modalRoot, appState, callbacks) {
  const { deck, picker } = appState;
  const isLeader = picker.slot === 'leader';
  const currentSlot = isLeader ? deck.leader : deck.troops[Number(picker.slot)];
  const currentMini = MINI_BY_SLUG.get(currentSlot.slug);
  const usedTroops = new Set(
    deck.troops.filter((_, idx) => idx !== Number(picker.slot)).map((t) => t.slug)
  );

  const query = (picker.search || '').trim().toLowerCase();
  const famFilter = picker.family || 'all';
  const candidates = MINIS.filter((m) => {
    if (isLeader ? m.type !== 'Leader' : m.type === 'Leader') return false;
    if (famFilter !== 'all' && !m.families?.includes(famFilter)) return false;
    if (query && !`${m.name} ${m.nameZh}`.toLowerCase().includes(query)) return false;
    return true;
  });

  modalRoot.classList.add('open');
  modalRoot.innerHTML = `
    <div class="wr-panel wr-modal-box">
      <div class="wr-section-title">
        <span>${isLeader ? '选择主将与天赋' : `编辑第 ${Number(picker.slot) + 1} 槽位棋子与天赋`}</span>
        <button type="button" class="wr-btn sm green" data-close-picker>完成</button>
      </div>

      ${
        currentMini
          ? `
        <div class="wr-panel-inset">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <strong>${esc(currentMini.nameZh)} (${currentMini.cost} 金) · 选择装备天赋</strong>
            <small style="color:#c6bdb3;">${esc((currentMini.traits || []).join(' / '))}</small>
          </div>
          <div class="wr-talent-row">
            ${(currentMini.talents || [])
              .map(
                (t) => `
              <button type="button" class="wr-talent-btn ${currentSlot.talentIndex === t.codeIndex ? 'active' : ''}" data-pick-talent="${t.codeIndex}">
                <img src="${esc(normalizeAssetPath(t.icon))}" alt="" />
                <div>
                  <div style="font-weight:600;color:#ffe7ad;">${esc(t.nameZh)}</div>
                  <div style="font-size:11px;color:#c6bdb3;">${esc(t.descZh)}</div>
                </div>
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      `
          : ''
      }

      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;align-items:center;">
        <input id="wr-picker-search" class="wr-input" type="search" placeholder="搜索棋子中文或英文名..." value="${esc(picker.search || '')}" />
        <button type="button" class="wr-preset-chip ${famFilter === 'all' ? 'active' : ''}" data-pick-fam="all">全部</button>
        ${FAMILY_ORDER.map(
          (fid) => `
          <button type="button" class="wr-preset-chip ${famFilter === fid ? 'active' : ''}" data-pick-fam="${fid}">
            ${esc(FAMILIES[fid].nameZh)}
          </button>
        `
        ).join('')}
      </div>

      <div class="wr-picker-grid">
        ${candidates
          .map((m) => {
            const selected = currentSlot.slug === m.slug;
            const duplicate = !isLeader && usedTroops.has(m.slug);
            return `
            <button type="button" class="wr-picker-item ${selected ? 'selected' : ''}" ${duplicate ? 'disabled' : ''} data-pick-unit="${esc(m.slug)}">
              <div class="wr-cost-badge">${m.cost}</div>
              <img class="spr" src="${esc(normalizeAssetPath(resolveMiniSprite(m.slug)))}" alt="${esc(m.nameZh)}" />
              <span style="font-size:11px;font-weight:600;text-align:center;">${esc(m.nameZh)}</span>
            </button>
          `;
          })
          .join('')}
      </div>
    </div>
  `;

  modalRoot.querySelector('[data-close-picker]')?.addEventListener('click', callbacks.onClosePicker);
  const searchInput = modalRoot.querySelector('#wr-picker-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      callbacks.onPickerSearch(e.target.value);
    });
    if (picker.refocusSearch) {
      searchInput.focus();
      const len = searchInput.value.length;
      searchInput.setSelectionRange(len, len);
    }
  }
  modalRoot.querySelectorAll('[data-pick-fam]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onPickerFamily(btn.dataset.pickFam));
  });
  modalRoot.querySelectorAll('[data-pick-unit]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onPickUnit(btn.dataset.pickUnit));
  });
  modalRoot.querySelectorAll('[data-pick-talent]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onPickTalent(Number(btn.dataset.pickTalent)));
  });
}

export function validateShareCode(raw) {
  return decodeRumblo(raw);
}
