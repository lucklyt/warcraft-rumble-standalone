import { MINIS } from '../data/minis.js';
import { DIFFICULTY_LEVELS, PRESET_DECKS } from '../data/presets.js';
import { MISSIONS_CATALOG, ZONES_CATALOG, getMissionById } from '../data/missions-catalog.js';
import { ONYXIA_METHOD_GUIDE } from '../data/onyxia-guide.js';
import { FAMILIES, FAMILY_ORDER } from '../data/translations.js';
import { encodeRumblo } from '../services/rumblo.js';
import {
  MINI_BY_SLUG,
  getEquippedTalent,
  resolveMiniSprite,
  resolvePortraitSprite,
  resolveStatueBase,
} from '../engine/unit-stats.js';
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

function familyIconUrl(family) {
  const f = String(family || 'Alliance').toLowerCase();
  const valid = new Set(['alliance', 'horde', 'blackrock', 'beast', 'undead', 'cenarion']);
  return valid.has(f) ? `./r/f/${f}.png` : './r/f/alliance.png';
}

function leaderStripImg(slug) {
  return `./r/leaders/${slug}.webp`;
}

function renderTopResourceBar(save) {
  return `
    <header class="wr-top-bar">
      <div class="wr-top-crest-box">
        <div class="wr-player-crest">
          <img src="./r/crest.png" alt="Rumble" />
          <span class="wr-crest-rank">III</span>
        </div>
        <div class="wr-player-brand">
          <strong>Rumble</strong>
          <span>奥妮克希亚征程</span>
        </div>
      </div>

      <div class="wr-top-currencies">
        <div class="wr-curr-pill sigil" title="战役印记">
          <img src="./r/authentic/conquest-complete.webp" alt="印记" />
          <span>${Number(save.sigils || 160)}</span>
        </div>
        <div class="wr-curr-pill coin" title="金币">
          <img src="./r/authentic/currency-gold.webp" alt="金币" />
          <span>${Number(save.coins || 0).toLocaleString()}</span>
        </div>
        <div class="wr-curr-pill arc" title="弧光能量">
          <img src="./r/authentic/currency-arclight.webp" alt="弧光" />
          <span>${Number(save.arclight || 0).toLocaleString()}</span>
        </div>
        <button type="button" class="wr-top-mute-btn" data-action="toggle-mute" title="音效开关">
          ${save.muted ? '静音' : '音效'}
        </button>
      </div>
    </header>
  `;
}

function renderBottomDock(activeTab) {
  const tabs = [
    { id: 'shop', label: '商店', icon: './r/ui/dock-shop.webp', activeIcon: './r/ui/dock-shop-selected.webp' },
    { id: 'army', label: '战队', icon: './r/ui/dock-army.webp', activeIcon: './r/ui/dock-army-selected.webp' },
    { id: 'map', label: '地图', icon: './r/ui/dock-map.webp', activeIcon: './r/ui/dock-map-selected.webp' },
    { id: 'raid', label: '副本', icon: './r/ui/dock-banner.webp', activeIcon: './r/ui/dock-banner-selected.webp' },
    { id: 'events', label: '活动', icon: './r/ui/dock-portal.webp', activeIcon: './r/ui/dock-portal-selected.webp' },
  ];

  return `
    <nav class="wr-bottom-dock" aria-label="主功能导航">
      ${tabs
        .map((t) => {
          const isActive = activeTab === t.id;
          return `
          <button type="button" class="wr-dock-btn ${isActive ? 'active' : ''}" data-tab="${t.id}">
            <div class="wr-dock-icon-wrap">
              <img src="${isActive ? t.activeIcon : t.icon}" alt="${esc(t.label)}" />
            </div>
            <span>${esc(t.label)}</span>
          </button>
        `;
        })
        .join('')}
    </nav>
  `;
}

function renderMapTab(save) {
  const continent = save.continent === 'eastern' ? 'eastern' : 'kalimdor';
  const continentZones = ZONES_CATALOG.filter((z) => z.continent === continent);
  const currentMission = getMissionById(save.selectedMissionId);
  const clearedSet = new Set(save.records?.clearedMissions || []);

  const mapPinsHtml = continentZones
    .map((z) => {
      const firstMission = getMissionById(z.missions[0]);
      const clearedCount = z.missions.filter((id) => clearedSet.has(id)).length;
      return `
      <button
        type="button"
        class="wr-map-monument ${z.id === save.selectedZoneId ? 'active' : ''}"
        style="left:${z.pos.x}%; top:${z.pos.y}%;"
        data-open-zone="${esc(z.id)}"
      >
        <div class="wr-monument-pedestal">
          <img class="wr-monument-portrait" src="${esc(normalizeAssetPath(firstMission.bossPortrait))}" alt="${esc(z.nameZh)}" />
          <img class="wr-monument-crown" src="${z.missions.length === 1 ? './r/authentic/conquest-available.webp' : './r/authentic/mission-boss-frame.webp'}" alt="" />
        </div>
        <div class="wr-monument-plate">
          <strong>${esc(z.nameZh)}</strong>
          <span>${z.sigilsText}${clearedCount > 0 ? ` · 已通${clearedCount}` : ''}</span>
        </div>
      </button>
    `;
    })
    .join('');

  return `
    <section class="wr-screen-map">
      <!-- Continent Switcher + Quick Selected Boss Banner -->
      <div class="wr-map-top-bar">
        <div class="wr-continent-switch">
          <button type="button" class="wr-cont-btn ${continent === 'kalimdor' ? 'active' : ''}" data-continent="kalimdor">卡利姆多</button>
          <button type="button" class="wr-cont-btn ${continent === 'eastern' ? 'active' : ''}" data-continent="eastern">东部王国</button>
        </div>
        <button type="button" class="wr-map-quick-brief" data-open-briefing="${esc(currentMission.id)}">
          <img src="${esc(normalizeAssetPath(currentMission.bossPortrait))}" alt="${esc(currentMission.nameZh)}" />
          <div>
            <strong>${esc(currentMission.nameZh)}</strong>
            <span>Lv.${currentMission.level} · 点击战前部署</span>
          </div>
        </button>
      </div>

      <!-- Authentic Painted Continent Viewport -->
      <div class="wr-map-stage">
        <img class="wr-map-bg" src="./r/world/${continent}.webp" alt="${continent === 'kalimdor' ? '卡利姆多' : '东部王国'}" />

        ${
          continent === 'kalimdor'
            ? `
          <button type="button" class="wr-map-event-beacon darkmoon" style="left:26%; top:34%;" data-tab="events" title="暗月马戏团">
            <img src="./r/events/island-darkmoon.webp" alt="暗月" />
            <span>暗月马戏团</span>
          </button>
        `
            : ''
        }

        ${mapPinsHtml}
      </div>

      <!-- Bottom Floating Wooden Action Hub (1:1 map-entrance.png) -->
      <div class="wr-map-action-hub">
        <div class="wr-quest-token-row">
          <div class="wr-token-box"><img src="./r/authentic/quest-tome-1.webp" alt="" /></div>
          <div class="wr-token-box"><img src="./r/authentic/quest-tome-2.webp" alt="" /></div>
          <div class="wr-token-box"><img src="./r/authentic/quest-tome-3.webp" alt="" /></div>
          <div class="wr-pip-status">
            <img src="./r/authentic/daily-reward-pip.webp" alt="" />
            <span>今日宝典 ${Math.min(3, (save.records?.wins || 0))}/3</span>
          </div>
        </div>

        <div class="wr-hub-buttons-row">
          <button type="button" class="wr-big-action-btn quest" data-launch-mission="arclight_quest">
            <img src="./r/authentic/quest-button-icon.webp" alt="任务" />
            <span>任务!</span>
          </button>

          <button type="button" class="wr-big-action-btn primary-fight" data-launch-mission="${esc(currentMission.id)}">
            <img src="./r/authentic/crossed-swords.webp" alt="出战" />
            <div>
              <strong>开始战斗</strong>
              <small>${esc(currentMission.nameZh)}</small>
            </div>
          </button>

          <button type="button" class="wr-big-action-btn pvp" data-launch-mission="pvp_arena">
            <img src="./r/authentic/pvp-icon.webp" alt="竞技" />
            <span>竞技</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderArmyTab(appState) {
  const { save, deck, collectionFilter, swapSlot } = appState;
  const leaders = MINIS.filter((m) => m.type === 'Leader');
  const leaderMini = MINI_BY_SLUG.get(deck.leader.slug);
  const leaderTalent = getEquippedTalent(leaderMini, deck.leader.talentIndex);

  const troopEntries = deck.troops.map((t, idx) => {
    const mini = MINI_BY_SLUG.get(t.slug);
    const talent = getEquippedTalent(mini, t.talentIndex);
    return { idx, mini, talent, talentIndex: t.talentIndex };
  });

  const allCosts = [leaderMini?.cost || 0, ...troopEntries.map((e) => e.mini?.cost || 0)];
  const avgCost = (allCosts.reduce((a, b) => a + b, 0) / Math.max(1, allCosts.length)).toFixed(1);
  const diff = DIFFICULTY_LEVELS.find((d) => d.id === save.difficultyId) || DIFFICULTY_LEVELS[0];
  const avgLv = (30.3 + diff.playerLevelDelta).toFixed(1);

  const lp = save.leaderPresets?.[deck.leader.slug] || { activeSlot: 0 };
  const activePresetSlot = lp.activeSlot || 0;

  const equippedSlugs = new Set([deck.leader.slug, ...deck.troops.map((t) => t.slug)]);

  const collectionMinis = MINIS.filter((m) => {
    if (m.type === 'Leader') return false;
    if (collectionFilter === 'all') return true;
    if (collectionFilter === 'Spell') return m.type === 'Spell';
    return (m.families || []).includes(collectionFilter);
  });

  return `
    <section class="wr-screen-army">
      <!-- 1. Top Circular Scrollable Leader Strip (matches army.png top row) -->
      <div class="wr-leader-strip" aria-label="领袖切换条">
        ${leaders
          .map((ldr) => {
            const isActive = ldr.slug === deck.leader.slug;
            return `
            <button type="button" class="wr-leader-circ ${isActive ? 'active' : ''}" data-select-leader="${esc(ldr.slug)}" title="${esc(ldr.nameZh)}">
              <div class="wr-leader-circ-ring">
                <img class="wr-leader-circ-avatar" src="${esc(leaderStripImg(ldr.slug))}" alt="${esc(ldr.nameZh)}" />
                <img class="wr-leader-circ-frame" src="./r/authentic/circle-metal-frame.webp" alt="" />
              </div>
              <img class="wr-leader-circ-fam" src="${familyIconUrl(ldr.families?.[0])}" alt="" />
              <span class="wr-leader-circ-lv">${30 + diff.playerLevelDelta}</span>
            </button>
          `;
          })
          .join('')}
      </div>

      <!-- 2. Center Stone Army Board (1:1 CurrentArmyBG) -->
      <div class="wr-stone-army-board">
        <div class="wr-army-board-header">
          <div class="wr-army-avg-lv">
            <span>平均等级</span>
            <strong>${avgLv}</strong>
          </div>
          <button type="button" class="wr-army-upgrade-btn" data-open-share>
            <img src="./r/authentic/valor-upgrade-btn.webp" alt="" />
            <span>阵容/分享码</span>
          </button>
          <div class="wr-army-avg-cost">
            <img src="./r/authentic/gold-nugget-icon.webp" alt="金" />
            <strong>${avgCost}</strong>
          </div>
        </div>

        ${
          swapSlot !== null
            ? `<div class="wr-swap-banner">正在为【第 ${Number(swapSlot) + 1} 号位】挑选士兵 — 请点击下方棋子替换 <button type="button" data-cancel-swap>取消</button></div>`
            : ''
        }

        <div class="wr-army-slots-layout">
          <!-- Left Tall Leader Slot -->
          <button type="button" class="wr-leader-pedestal-card" data-inspect-slot="leader" data-inspect-slug="${esc(leaderMini?.slug)}">
            <div class="wr-slot-cyan-head leader">
              <img src="./r/authentic/leader-crown.webp" alt="主将" />
            </div>
            <img class="wr-card-fam-flag" src="${familyIconUrl(leaderMini?.families?.[0])}" alt="" />
            <div class="wr-card-fig-stage">
              <img class="wr-card-pedestal-base" src="${resolveStatueBase(leaderMini?.families)}" alt="" />
              <img class="wr-card-fig-img leader" src="${esc(normalizeAssetPath(resolvePortraitSprite(leaderMini?.slug)))}" alt="${esc(leaderMini?.nameZh)}" />
            </div>
            <div class="wr-card-cost-nugget">
              <img src="./r/ui/gold-cost.webp" alt="" />
              <span>${leaderMini?.cost ?? 0}</span>
            </div>
            <div class="wr-card-level-foot">
              <span class="lv">${31 + diff.playerLevelDelta}</span>
              <span class="max">最大</span>
              ${leaderTalent?.icon ? `<img class="tal" src="${esc(normalizeAssetPath(leaderTalent.icon))}" alt="${esc(leaderTalent.nameZh)}" />` : ''}
            </div>
          </button>

          <!-- Right 3x2 Troop Slots -->
          <div class="wr-troops-3x2">
            ${troopEntries
              .map((entry, idx) => {
                const buffImg = `./r/authentic/buff-slot-0${(idx % 3) + 1}.webp`;
                const isSwapTarget = swapSlot === idx;
                return `
                <button
                  type="button"
                  class="wr-troop-pedestal-card ${isSwapTarget ? 'swap-target' : ''}"
                  data-inspect-slot="${idx}"
                  data-inspect-slug="${esc(entry.mini?.slug)}"
                >
                  <div class="wr-slot-cyan-head">
                    <img src="${buffImg}" alt="" />
                  </div>
                  <img class="wr-card-fam-flag" src="${familyIconUrl(entry.mini?.families?.[0])}" alt="" />
                  <div class="wr-card-fig-stage">
                    <img class="wr-card-pedestal-base" src="${resolveStatueBase(entry.mini?.families)}" alt="" />
                    <img class="wr-card-fig-img" src="${esc(normalizeAssetPath(resolveMiniSprite(entry.mini?.slug)))}" alt="${esc(entry.mini?.nameZh)}" />
                  </div>
                  <div class="wr-card-cost-nugget">
                    <img src="./r/ui/gold-cost.webp" alt="" />
                    <span>${entry.mini?.cost ?? 0}</span>
                  </div>
                  <div class="wr-card-level-foot">
                    <span class="lv">${31 + diff.playerLevelDelta}</span>
                    <span class="max">最大</span>
                    ${entry.talent?.icon ? `<img class="tal" src="${esc(normalizeAssetPath(entry.talent.icon))}" alt="${esc(entry.talent.nameZh)}" />` : ''}
                  </div>
                </button>
              `;
              })
              .join('')}
          </div>
        </div>

        <!-- Preset Bar (1 / 2 / 3 / ...) -->
        <div class="wr-army-preset-row">
          ${[0, 1, 2]
            .map(
              (idx) => `
            <button type="button" class="wr-preset-num-btn ${activePresetSlot === idx ? 'active' : ''}" data-leader-preset="${idx}">
              ${idx + 1}
            </button>
          `
            )
            .join('')}
          <button type="button" class="wr-preset-num-btn more" data-open-share title="复制/导入 rumblo: 分享码与官方预设">...</button>
        </div>
      </div>

      <!-- 3. Bottom Scrollable Collection Grid (士兵 已收集: 93/93) -->
      <div class="wr-collection-shelf">
        <div class="wr-collection-bar">
          <div class="wr-collection-title">
            <strong>士兵</strong>
            <span>已收集：${MINIS.length}/${MINIS.length}</span>
          </div>
          <div class="wr-collection-filters">
            <button type="button" class="wr-col-flt ${collectionFilter === 'all' ? 'active' : ''}" data-col-filter="all">全部</button>
            ${FAMILY_ORDER.map(
              (f) => `
              <button type="button" class="wr-col-flt ${collectionFilter === f ? 'active' : ''}" data-col-filter="${f}" title="${esc(FAMILIES[f]?.zh || f)}">
                <img src="${familyIconUrl(f)}" alt="${esc(FAMILIES[f]?.zh || f)}" />
              </button>
            `
            ).join('')}
            <button type="button" class="wr-col-flt ${collectionFilter === 'Spell' ? 'active' : ''}" data-col-filter="Spell">法术</button>
          </div>
        </div>

        <div class="wr-collection-grid">
          ${collectionMinis
            .map((m) => {
              const inDeck = equippedSlugs.has(m.slug);
              const tal = m.talents?.[0];
              return `
              <button
                type="button"
                class="wr-collection-card ${inDeck ? 'in-deck' : ''}"
                data-collection-slug="${esc(m.slug)}"
              >
                <img class="wr-card-fam-flag" src="${familyIconUrl(m.families?.[0])}" alt="" />
                <div class="wr-card-fig-stage">
                  <img class="wr-card-pedestal-base" src="${resolveStatueBase(m.families)}" alt="" />
                  <img class="wr-card-fig-img" src="${esc(normalizeAssetPath(resolveMiniSprite(m.slug)))}" alt="${esc(m.nameZh)}" />
                </div>
                <div class="wr-card-cost-nugget">
                  <img src="./r/ui/gold-cost.webp" alt="" />
                  <span>${m.cost}</span>
                </div>
                <div class="wr-card-level-foot">
                  <span class="lv">${30 + diff.playerLevelDelta}</span>
                  <span class="max">${m.nameZh.slice(0, 4)}</span>
                  ${tal?.icon ? `<img class="tal" src="${esc(normalizeAssetPath(tal.icon))}" alt="" />` : ''}
                </div>
              </button>
            `;
            })
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function renderShopTab(save) {
  const purchased = new Set(save.purchasedShopIds || []);
  const offers = [
    { id: 'offer-thrall', slug: 'thrall', label: '萨尔 · 狼群经验加成', price: 120 },
    { id: 'offer-drake', slug: 'whelp-eggs', label: '雏龙蛋 · 星辉强化包', price: 90 },
    { id: 'offer-pyro', slug: 'pyromancer', label: '炎术师 · 烈焰爆发天赋', price: 90 },
    { id: 'offer-quil', slug: 'quilboar', label: '野猪人 · 棘背大师包', price: 90 },
    { id: 'offer-witch', slug: 'witch-doctor', label: '巫医 · 灵魂护盾强化', price: 90 },
    { id: 'offer-pilot', slug: 's-a-f-e-pilot', label: '潜行空投 · 精锐包', price: 90 },
  ];

  return `
    <section class="wr-screen-scroll">
      <div class="wr-wood-card">
        <div class="wr-wood-card-head">
          <strong>每日精选免费补给</strong>
          <span>每日零点刷新</span>
        </div>
        <div class="wr-shop-free-row">
          <img src="./r/authentic/currency-gold.webp" alt="金币箱" />
          <div>
            <strong>奥妮克希亚军备金币箱</strong>
            <span>内含 500 枚单机金币，用于强化兵种</span>
          </div>
          <button type="button" class="wr-gbtn ${save.claimedShopFree ? 'disabled' : 'green'}" data-claim-shop-free ${save.claimedShopFree ? 'disabled' : ''}>
            ${save.claimedShopFree ? '已领取' : '免费领取'}
          </button>
        </div>
      </div>

      <div class="wr-wood-card">
        <div class="wr-wood-card-head">
          <strong>G.R.I.D. 十字军备商店</strong>
          <span>弧光能量强化</span>
        </div>
        <div class="wr-shop-grid">
          ${offers
            .map((o) => {
              const mini = MINI_BY_SLUG.get(o.slug);
              const bought = purchased.has(o.id);
              return `
              <button type="button" class="wr-shop-tile ${bought ? 'bought' : ''}" data-buy-offer="${esc(o.id)}" data-buy-slug="${esc(o.slug)}" data-buy-price="${o.price}" ${bought ? 'disabled' : ''}>
                <img class="spr" src="${esc(normalizeAssetPath(resolveMiniSprite(o.slug)))}" alt="${esc(mini?.nameZh)}" />
                <strong>${esc(mini?.nameZh || o.slug)}</strong>
                <span class="price">${bought ? '已售罄' : `${o.price} 金币`}</span>
              </button>
            `;
            })
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function renderRaidTab(save) {
  const onyxia = getMissionById('onyxia_lair');
  const mcMissions = MISSIONS_CATALOG.filter((m) => m.zoneId === 'molten_core_zone');
  const clearedSet = new Set(save.records?.clearedMissions || []);

  return `
    <section class="wr-screen-scroll">
      <div class="wr-raid-banner onyxia">
        <img class="bg" src="./r/onyxia/onyxia-map.webp" alt="奥妮克希亚的巢穴" />
        <div class="overlay">
          <span class="tag">终局单人团本 · 原生56×114 3D场景</span>
          <h2>奥妮克希亚的巢穴</h2>
          <p>${esc(onyxia.descriptionZh)}</p>
          <div class="actions">
            <button type="button" class="wr-gbtn gold" data-launch-mission="onyxia_lair">挑战奥妮克希亚 (3D实机)</button>
            <button type="button" class="wr-gbtn blue" data-open-guide>阶段机制手册</button>
          </div>
        </div>
      </div>

      <div class="wr-wood-card">
        <div class="wr-wood-card-head">
          <strong>熔火之心团队副本 (Lv.28–30)</strong>
          <span>5大烈焰首领</span>
        </div>
        <div class="wr-raid-mc-hero">
          <img src="./r/scene/mc-map.webp" alt="熔火之心" />
        </div>
        <div class="wr-boss-list">
          ${mcMissions
            .map((m) => {
              const cleared = clearedSet.has(m.id);
              return `
              <button type="button" class="wr-boss-row-btn" data-open-briefing="${esc(m.id)}">
                <img class="boss-pic" src="${esc(normalizeAssetPath(m.bossPortrait))}" alt="${esc(m.nameZh)}" />
                <div class="boss-info">
                  <strong>${esc(m.nameZh)}</strong>
                  <span>Lv.${m.level} · ${esc(m.titleZh)}</span>
                </div>
                <span class="boss-go ${cleared ? 'done' : ''}">${cleared ? '已击败' : '挑战'}</span>
              </button>
            `;
            })
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function renderEventsTab(save) {
  const prog = save.darkmoonProgress || { matches: 0, wins: 0, cards: 0 };
  const claimed = save.darkmoonClaimed || {};

  const quests = [
    { id: 'dm-match', title: '参与 1 场首领或团本对战', cur: prog.matches, max: 1, tickets: 400, gold: 150 },
    { id: 'dm-cards', title: '在实战中累计部署 12 张棋子', cur: prog.cards, max: 12, tickets: 600, gold: 250 },
    { id: 'dm-win', title: '成功击败任意 1 名关卡首领', cur: prog.wins, max: 1, tickets: 1200, gold: 500 },
  ];

  return `
    <section class="wr-screen-scroll darkmoon-theme">
      <div class="wr-dm-banner">
        <img class="dm-island" src="./r/events/island-darkmoon.webp" alt="暗月马戏团" />
        <div>
          <h2>暗月马戏团</h2>
          <p>当前暗月奖券：<strong>${Number(save.tickets || 0).toLocaleString()}</strong></p>
        </div>
      </div>

      <div class="wr-dm-board">
        <h3>每日马戏团挑战（实时战斗追踪）</h3>
        ${quests
          .map((q) => {
            const pct = Math.min(100, Math.round((q.cur / q.max) * 100));
            const ready = q.cur >= q.max && !claimed[q.id];
            const isDone = Boolean(claimed[q.id]);
            return `
            <div class="wr-dm-row">
              <div class="dm-row-top">
                <strong>${esc(q.title)}</strong>
                <span>${Math.min(q.cur, q.max)} / ${q.max}</span>
              </div>
              <div class="dm-bar"><div style="width:${pct}%;"></div></div>
              <div class="dm-row-foot">
                <span>奖励：${q.tickets} 奖券 + ${q.gold} 金币</span>
                ${
                  isDone
                    ? `<span class="dm-claimed">已领取</span>`
                    : ready
                    ? `<button type="button" class="wr-gbtn green sm" data-claim-dm="${q.id}" data-dm-tickets="${q.tickets}" data-dm-gold="${q.gold}">领取奖励</button>`
                    : `<button type="button" class="wr-gbtn blue sm" data-launch-mission="${esc(save.selectedMissionId)}">去战斗</button>`
                }
              </div>
            </div>
          `;
          })
          .join('')}
      </div>
    </section>
  `;
}

function renderZoneModal(zoneId, save) {
  const zone = ZONES_CATALOG.find((z) => z.id === zoneId);
  if (!zone) return '';
  const clearedSet = new Set(save.records?.clearedMissions || []);

  return `
    <div class="wr-popup-card zone-board">
      <div class="wr-popup-head">
        <div>
          <strong>${esc(zone.nameZh)}</strong>
          <span>${esc(zone.subZh)}</span>
        </div>
        <button type="button" class="wr-popup-close" data-close-zone>返回</button>
      </div>
      <div class="wr-boss-list">
        ${zone.missions
          .map((mid) => {
            const m = getMissionById(mid);
            const cleared = clearedSet.has(m.id);
            return `
            <button type="button" class="wr-boss-row-btn" data-open-briefing="${esc(m.id)}">
              <img class="boss-pic" src="${esc(normalizeAssetPath(m.bossPortrait))}" alt="${esc(m.nameZh)}" />
              <div class="boss-info">
                <strong>${esc(m.nameZh)}</strong>
                <span>Lv.${m.level} · ${esc(m.titleZh)}</span>
              </div>
              <span class="boss-go ${cleared ? 'done' : ''}">${cleared ? '已击败' : '出战'}</span>
            </button>
          `;
          })
          .join('')}
      </div>
    </div>
  `;
}

function renderBriefingModal(missionId, appState) {
  const m = getMissionById(missionId);
  const { save, deck } = appState;
  const leaderMini = MINI_BY_SLUG.get(deck.leader.slug);
  const party = [leaderMini, ...deck.troops.map((t) => MINI_BY_SLUG.get(t.slug))].filter(Boolean);

  return `
    <div class="wr-popup-card briefing-card">
      <div class="wr-popup-head">
        <div>
          <strong>${esc(m.zoneZh)} · ${esc(m.nameZh)}</strong>
          <span>Lv.${m.level} · 胜场奖励 ${m.rewardGold} 金币</span>
        </div>
        <button type="button" class="wr-popup-close" data-close-briefing>关闭</button>
      </div>

      <div class="wr-brief-hero">
        <img src="${esc(normalizeAssetPath(m.bossPortrait))}" alt="${esc(m.nameZh)}" />
        <div>
          <strong>${esc(m.titleZh)}</strong>
          <p>${esc(m.descriptionZh)}</p>
        </div>
      </div>

      <div class="wr-brief-diff-row">
        ${DIFFICULTY_LEVELS.map(
          (d) => `
          <button type="button" class="wr-diff-chip ${save.difficultyId === d.id ? 'active' : ''}" data-difficulty="${d.id}">
            ${esc(d.nameZh)}
          </button>
        `
        ).join('')}
      </div>

      <div class="wr-brief-party">
        <div class="head">
          <span>当前出战战队（${esc(leaderMini?.nameZh || '')}）</span>
          <button type="button" class="edit-deck-link" data-tab="army" data-close-briefing>去【战队】调整</button>
        </div>
        <div class="icons">
          ${party
            .map(
              (u) => `
            <div class="mini-pip">
              <img src="${esc(normalizeAssetPath(resolveMiniSprite(u.slug)))}" alt="${esc(u.nameZh)}" />
              <span>${u.cost}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <button type="button" class="wr-gbtn blue lg" data-launch-mission="${esc(m.id)}">开始任务</button>
    </div>
  `;
}

function renderShareCodeModal(appState) {
  const { save, deck } = appState;
  let code = '';
  try {
    code = encodeRumblo(deck);
  } catch {
    code = save.activeCode || '';
  }

  return `
    <div class="wr-popup-card">
      <div class="wr-popup-head">
        <strong>战队预设与 rumblo: 分享码</strong>
        <button type="button" class="wr-popup-close" data-close-share>关闭</button>
      </div>

      <div class="wr-preset-list">
        ${PRESET_DECKS.map(
          (p) => `
          <button type="button" class="wr-preset-pick ${save.selectedPresetId === p.id ? 'active' : ''}" data-preset-id="${esc(p.id)}">
            <strong>${esc(p.badge)} · ${esc(p.nameZh)}</strong>
            <span>${esc(p.summary)}</span>
          </button>
        `
        ).join('')}
      </div>

      <label class="wr-share-label">当前分享码（可直接复制或粘贴官方 rumblo: 代码）：</label>
      <textarea id="wr-rumblo-input" class="wr-rumblo-box" rows="2">${esc(code)}</textarea>
      <div class="wr-share-actions">
        <button type="button" class="wr-gbtn gold" data-copy-code>复制代码</button>
        <button type="button" class="wr-gbtn blue" data-import-code>导入生效</button>
      </div>
    </div>
  `;
}

function renderInspectModal(appState) {
  const { slot, slug } = appState.inspectSlot;
  const mini = MINI_BY_SLUG.get(slug);
  if (!mini) return '';

  const isCollection = slot === 'collection';
  const equippedEntry =
    slot === 'leader' ? appState.deck.leader : typeof slot === 'number' ? appState.deck.troops[slot] : null;
  const activeTalentIdx = equippedEntry?.talentIndex ?? mini.talents?.[0]?.codeIndex ?? 0;

  return `
    <div class="wr-popup-card inspect-card">
      <div class="wr-popup-head">
        <div>
          <strong>${esc(mini.nameZh)}（${mini.cost} 费）</strong>
          <span>HP ${mini.health || '--'} · 伤害 ${mini.damage || '--'} · ${esc((mini.traits || []).slice(0, 4).join(' / '))}</span>
        </div>
        <button type="button" class="wr-popup-close" data-close-inspect>关闭</button>
      </div>

      <div class="wr-inspect-turntable-wrap">
        <canvas id="wr-inspect-canvas" width="220" height="170"></canvas>
      </div>

      <div class="wr-inspect-talents">
        ${(mini.talents || [])
          .map((t) => {
            const cIdx = t.codeIndex ?? 0;
            const active = cIdx === activeTalentIdx;
            return `
            <button type="button" class="wr-tal-pick ${active ? 'active' : ''}" data-pick-talent="${cIdx}" data-tal-slot="${esc(slot)}" data-tal-slug="${esc(mini.slug)}">
              <img src="${esc(normalizeAssetPath(t.icon))}" alt="" />
              <div>
                <strong>${esc(t.nameZh)}</strong>
                <span>${esc(t.descZh)}</span>
              </div>
            </button>
          `;
          })
          .join('')}
      </div>

      <div class="wr-inspect-actions">
        ${
          typeof slot === 'number'
            ? `<button type="button" class="wr-gbtn gold" data-start-swap="${slot}">替换该位置士兵</button>`
            : isCollection && mini.type !== 'Leader'
            ? `<button type="button" class="wr-gbtn green" data-equip-slot0="${esc(mini.slug)}">编入战队 (第1格)</button>`
            : ''
        }
        <button type="button" class="wr-gbtn blue" data-close-inspect>完成</button>
      </div>
    </div>
  `;
}

export function renderLobbyView(root, modalRoot, appState, callbacks) {
  destroyLobbyTurntable();

  if (appState.loadingMission) {
    root.innerHTML = `
      <div class="wr-phone-backdrop">
        <div class="wr-phone-shell loading-state">
          <img class="wr-loading-bg" src="./r/authentic/loading-screen.webp" alt="加载中" />
          <div class="wr-loading-card">
            <strong>正在进入：${esc(appState.loadingMission.zoneZh)}</strong>
            <span>${esc(appState.loadingMission.nameZh)} (Lv.${appState.loadingMission.level}) · 加载 3D 战场模型...</span>
          </div>
        </div>
      </div>
    `;
    modalRoot.classList.remove('open');
    return;
  }

  const { save } = appState;
  const activeTab = save.activeTab || 'map';

  let bodyHtml = '';
  if (activeTab === 'shop') bodyHtml = renderShopTab(save);
  else if (activeTab === 'army') bodyHtml = renderArmyTab(appState);
  else if (activeTab === 'raid') bodyHtml = renderRaidTab(save);
  else if (activeTab === 'events') bodyHtml = renderEventsTab(save);
  else bodyHtml = renderMapTab(save);

  root.innerHTML = `
    <div class="wr-phone-backdrop">
      <div class="wr-phone-shell">
        ${renderTopResourceBar(save)}
        <main class="wr-phone-main">${bodyHtml}</main>
        ${renderBottomDock(activeTab)}
      </div>
    </div>
  `;

  // Modals (Zone 5-Boss Board, Briefing Card, Share Code, Mini Inspector)
  let modalHtml = '';
  if (appState.zoneModalId) modalHtml = renderZoneModal(appState.zoneModalId, save);
  else if (appState.briefingMissionId) modalHtml = renderBriefingModal(appState.briefingMissionId, appState);
  else if (appState.shareModalOpen) modalHtml = renderShareCodeModal(appState);
  else if (appState.inspectSlot) modalHtml = renderInspectModal(appState);

  if (modalHtml) {
    modalRoot.innerHTML = modalHtml;
    modalRoot.classList.add('open');
  } else {
    modalRoot.classList.remove('open');
    modalRoot.innerHTML = '';
  }

  // Mount 3D turntable inside Inspect Modal if open
  if (appState.inspectSlot) {
    const cvs = modalRoot.querySelector('#wr-inspect-canvas');
    const mini = MINI_BY_SLUG.get(appState.inspectSlot.slug);
    if (cvs && mini) {
      try {
        activeTurntable = new MiniTurntable3D(cvs);
        activeTurntable.setMini(mini.slug, mini.families);
      } catch (err) {
        console.warn('MiniTurntable3D unavailable:', err);
      }
    }
  }

  // Wire global events inside root + modalRoot
  root.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onSwitchTab(btn.dataset.tab));
  });
  root.querySelector('[data-action="toggle-mute"]')?.addEventListener('click', callbacks.onToggleMute);
  root.querySelectorAll('[data-continent]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onSwitchContinent(btn.dataset.continent));
  });
  root.querySelectorAll('[data-open-zone]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onOpenZoneModal(btn.dataset.openZone));
  });
  root.querySelectorAll('[data-open-briefing]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onOpenBriefing(btn.dataset.openBriefing));
  });
  root.querySelectorAll('[data-launch-mission]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onLaunchMission(btn.dataset.launchMission));
  });
  root.querySelectorAll('[data-select-leader]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onSelectLeader(btn.dataset.selectLeader));
  });
  root.querySelectorAll('[data-leader-preset]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onSwitchLeaderPreset(Number(btn.dataset.leaderPreset)));
  });
  root.querySelectorAll('[data-open-share]').forEach((btn) => {
    btn.addEventListener('click', callbacks.onOpenShareModal);
  });
  root.querySelectorAll('[data-inspect-slot]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const s = btn.dataset.inspectSlot === 'leader' ? 'leader' : Number(btn.dataset.inspectSlot);
      callbacks.onInspectSlot(s, btn.dataset.inspectSlug);
    });
  });
  root.querySelector('[data-cancel-swap]')?.addEventListener('click', callbacks.onCancelSwap);
  root.querySelectorAll('[data-col-filter]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onFilterCollection(btn.dataset.colFilter));
  });
  root.querySelectorAll('[data-collection-slug]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onEquipCollectionMini(btn.dataset.collectionSlug));
  });
  root.querySelector('[data-claim-shop-free]')?.addEventListener('click', callbacks.onClaimShopFree);
  root.querySelectorAll('[data-buy-offer]').forEach((btn) => {
    btn.addEventListener('click', () =>
      callbacks.onBuyShopOffer(btn.dataset.buyOffer, btn.dataset.buySlug, Number(btn.dataset.buyPrice))
    );
  });
  root.querySelectorAll('[data-claim-dm]').forEach((btn) => {
    btn.addEventListener('click', () =>
      callbacks.onClaimDarkmoon(
        btn.dataset.claimDm,
        Number(btn.dataset.dmTickets),
        Number(btn.dataset.dmGold)
      )
    );
  });
  root.querySelector('[data-open-guide]')?.addEventListener('click', () => {
    const tips = (ONYXIA_METHOD_GUIDE.phases || []).map((p) => `${p.phase} (${p.hpRange}): ${p.keyMechanic}`).join('\n');
    modalRoot.innerHTML = `
      <div class="wr-popup-card">
        <div class="wr-popup-head">
          <strong>奥妮克希亚阶段机制详解</strong>
          <button type="button" class="wr-popup-close" id="wr-guide-close">关闭</button>
        </div>
        <div class="wr-guide-text">${esc(tips).replaceAll('\n', '<br/><br/>')}</div>
      </div>
    `;
    modalRoot.classList.add('open');
    modalRoot.querySelector('#wr-guide-close')?.addEventListener('click', () => {
      modalRoot.classList.remove('open');
      modalRoot.innerHTML = '';
    });
  });

  // Modal controls
  modalRoot.querySelector('[data-close-zone]')?.addEventListener('click', callbacks.onCloseZoneModal);
  modalRoot.querySelector('[data-close-briefing]')?.addEventListener('click', callbacks.onCloseBriefing);
  modalRoot.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.briefingMissionId = null;
      callbacks.onSwitchTab(btn.dataset.tab);
    });
  });
  modalRoot.querySelectorAll('[data-open-briefing]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onOpenBriefing(btn.dataset.openBriefing));
  });
  modalRoot.querySelectorAll('[data-launch-mission]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onLaunchMission(btn.dataset.launchMission));
  });
  modalRoot.querySelectorAll('[data-difficulty]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onSelectDifficulty(btn.dataset.difficulty));
  });
  modalRoot.querySelector('[data-close-share]')?.addEventListener('click', callbacks.onCloseShareModal);
  modalRoot.querySelectorAll('[data-preset-id]').forEach((btn) => {
    btn.addEventListener('click', () => callbacks.onSelectPreset(btn.dataset.presetId));
  });
  modalRoot.querySelector('[data-copy-code]')?.addEventListener('click', () => {
    const val = modalRoot.querySelector('#wr-rumblo-input')?.value || '';
    callbacks.onCopyCode(val);
  });
  modalRoot.querySelector('[data-import-code]')?.addEventListener('click', () => {
    const val = modalRoot.querySelector('#wr-rumblo-input')?.value || '';
    callbacks.onImportCode(val);
  });
  modalRoot.querySelectorAll('[data-close-inspect]').forEach((btn) => {
    btn.addEventListener('click', callbacks.onCloseInspect);
  });
  modalRoot.querySelectorAll('[data-pick-talent]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const s =
        btn.dataset.talSlot === 'leader'
          ? 'leader'
          : btn.dataset.talSlot === 'collection'
          ? 'collection'
          : Number(btn.dataset.talSlot);
      callbacks.onPickTalent(s, Number(btn.dataset.pickTalent), btn.dataset.talSlug);
    });
  });
  modalRoot.querySelector('[data-start-swap]')?.addEventListener('click', (e) => {
    callbacks.onStartSwapSlot(Number(e.currentTarget.dataset.startSwap));
  });
  modalRoot.querySelector('[data-equip-slot0]')?.addEventListener('click', (e) => {
    appState.swapSlot = 0;
    appState.inspectSlot = null;
    callbacks.onEquipCollectionMini(e.currentTarget.dataset.equipSlot0);
  });
}
