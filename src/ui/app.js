import { PRESET_DECKS, USER_DEFAULT_THRALL_CODE, getDifficultyById } from '../data/presets.js';
import { getMissionById } from '../data/missions-catalog.js';
import { MINIS } from '../data/minis.js';
import { decodeRumblo, encodeRumblo } from '../services/rumblo.js';
import { loadSaveData, recordBattleOutcome, writeSaveData } from '../services/storage.js';
import { MINI_BY_SLUG, resolveMiniSprite } from '../engine/unit-stats.js';
import { sfx } from '../audio/sfx.js';
import { destroyLobbyTurntable, renderLobbyView } from './lobby-view.js';
import { BattleController } from './battle-hud.js';

function buildDefaultCodeForLeader(leaderSlug) {
  if (leaderSlug === 'thrall') return USER_DEFAULT_THRALL_CODE;
  const preset = PRESET_DECKS.find((p) => {
    try {
      return decodeRumblo(p.code).leader.slug === leaderSlug;
    } catch {
      return false;
    }
  });
  if (preset) return preset.code;

  const leader = MINI_BY_SLUG.get(leaderSlug);
  const fam = leader?.families?.[0] || 'Alliance';
  const pool = MINIS.filter((m) => m.type !== 'Leader');
  const sameFam = pool.filter((m) => m.families?.includes(fam));
  const others = pool.filter((m) => !m.families?.includes(fam));
  const coreSlugs = ['quillboar', 'quilboar', 'whelp-eggs', 'harpies', 'gryphon-rider', 'witch-doctor', 's-a-f-e-pilot', 'blizzard', 'execute'];
  const picked = [];
  for (const m of [...sameFam, ...coreSlugs.map((s) => MINI_BY_SLUG.get(s)).filter(Boolean), ...others]) {
    if (picked.length >= 6) break;
    if (!picked.some((x) => x.slug === m.slug)) picked.push(m);
  }
  return encodeRumblo({
    leader: { slug: leaderSlug, talentIndex: leader?.talents?.[0]?.codeIndex ?? 0 },
    troops: picked.slice(0, 6).map((m) => ({
      slug: m.slug,
      talentIndex: m.talents?.[0]?.codeIndex ?? 0,
    })),
  });
}

export function startApp() {
  const root = document.getElementById('app');
  const modalRoot = document.getElementById('wr-modal-root');
  const toastEl = document.getElementById('wr-toast');

  let toastTimer = null;
  const showToast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  };

  let save = loadSaveData();
  sfx.setMuted(save.muted);

  let deck;
  try {
    deck = decodeRumblo(save.activeCode);
  } catch {
    deck = decodeRumblo(USER_DEFAULT_THRALL_CODE);
    save.activeCode = USER_DEFAULT_THRALL_CODE;
    save.selectedPresetId = PRESET_DECKS[0].id;
    writeSaveData(save);
  }

  const appState = {
    mode: 'lobby',
    save,
    deck,
    collectionFilter: 'all',
    swapSlot: null, // null | 'leader' | 0..5
    zoneModalId: null,
    briefingMissionId: null,
    shareModalOpen: false,
    inspectSlot: null, // { slot: 'leader'|0..5, slug }
    loadingMission: null,
  };

  let battleCtrl = null;

  const ensureLeaderPresets = (leaderSlug) => {
    if (!appState.save.leaderPresets) appState.save.leaderPresets = {};
    if (!appState.save.leaderPresets[leaderSlug]) {
      const baseCode = buildDefaultCodeForLeader(leaderSlug);
      appState.save.leaderPresets[leaderSlug] = {
        activeSlot: 0,
        slots: [baseCode, baseCode, baseCode],
      };
    }
    return appState.save.leaderPresets[leaderSlug];
  };

  const persistDeck = (customPresetId = undefined) => {
    const code = encodeRumblo(appState.deck);
    appState.save.activeCode = code;
    if (customPresetId !== undefined) {
      appState.save.selectedPresetId = customPresetId;
    }
    const lp = ensureLeaderPresets(appState.deck.leader.slug);
    lp.slots[lp.activeSlot || 0] = code;
    writeSaveData(appState.save);
  };

  const launchMission = (missionId) => {
    const mission = getMissionById(missionId || appState.save.selectedMissionId);
    appState.save.selectedMissionId = mission.id;
    writeSaveData(appState.save);

    sfx.play('start');
    destroyLobbyTurntable();
    appState.zoneModalId = null;
    appState.briefingMissionId = null;
    appState.shareModalOpen = false;
    appState.inspectSlot = null;
    appState.loadingMission = mission;
    render();

    setTimeout(() => {
      appState.loadingMission = null;
      appState.mode = 'battle';
      const difficulty = getDifficultyById(appState.save.difficultyId);
      const preset = PRESET_DECKS.find((p) => p.id === appState.save.selectedPresetId);

      battleCtrl = new BattleController(root, modalRoot, {
        deck: structuredClone(appState.deck),
        mission,
        difficulty,
        deckName: preset?.nameZh || MINI_BY_SLUG.get(appState.deck.leader.slug)?.nameZh || '自定义战队',
        onToast: showToast,
        onBattleFinish: (snap) => {
          appState.save = recordBattleOutcome({
            victory: snap.victory,
            missionId: mission.id,
            rewardGold: mission.rewardGold,
            cardsPlayed: snap.cardsPlayed,
            bossHpPct: snap.bossHpPct,
            remainingTimeSec: snap.remainingSec,
            deckName: preset?.nameZh || '自定义战队',
          });
        },
        onExitLobby: () => {
          appState.mode = 'lobby';
          render();
        },
      });
      battleCtrl.mount();
      window.__wrApp = { appState, battleCtrl, launchMission };
    }, 320);
  };

  const render = () => {
    if (appState.mode === 'lobby') {
      if (battleCtrl) {
        battleCtrl.destroy();
        battleCtrl = null;
      }
      renderLobbyView(root, modalRoot, appState, {
        onSwitchTab: (tab) => {
          sfx.play('click');
          appState.save.activeTab = tab;
          appState.swapSlot = null;
          writeSaveData(appState.save);
          render();
        },
        onSwitchContinent: (continent) => {
          sfx.play('click');
          appState.save.continent = continent;
          writeSaveData(appState.save);
          render();
        },
        onOpenZoneModal: (zoneId) => {
          sfx.play('click');
          appState.save.selectedZoneId = zoneId;
          appState.zoneModalId = zoneId;
          writeSaveData(appState.save);
          render();
        },
        onCloseZoneModal: () => {
          sfx.play('click');
          appState.zoneModalId = null;
          render();
        },
        onOpenBriefing: (missionId) => {
          sfx.play('click');
          appState.zoneModalId = null;
          appState.briefingMissionId = missionId;
          appState.save.selectedMissionId = missionId;
          writeSaveData(appState.save);
          render();
        },
        onCloseBriefing: () => {
          sfx.play('click');
          appState.briefingMissionId = null;
          render();
        },
        onLaunchMission: (missionId) => {
          launchMission(missionId);
        },
        onToggleMute: () => {
          appState.save.muted = !appState.save.muted;
          sfx.setMuted(appState.save.muted);
          writeSaveData(appState.save);
          render();
        },
        onSelectLeader: (leaderSlug) => {
          sfx.play('select');
          const lp = ensureLeaderPresets(leaderSlug);
          const code = lp.slots[lp.activeSlot || 0] || buildDefaultCodeForLeader(leaderSlug);
          try {
            appState.deck = decodeRumblo(code);
          } catch {
            appState.deck = decodeRumblo(buildDefaultCodeForLeader(leaderSlug));
          }
          appState.save.activeCode = encodeRumblo(appState.deck);
          appState.save.selectedPresetId = leaderSlug === 'thrall' && lp.activeSlot === 0 ? PRESET_DECKS[0].id : null;
          appState.swapSlot = null;
          writeSaveData(appState.save);
          render();
        },
        onSwitchLeaderPreset: (slotIdx) => {
          sfx.play('click');
          const lp = ensureLeaderPresets(appState.deck.leader.slug);
          lp.activeSlot = slotIdx;
          const code = lp.slots[slotIdx] || buildDefaultCodeForLeader(appState.deck.leader.slug);
          try {
            appState.deck = decodeRumblo(code);
          } catch {
            appState.deck = decodeRumblo(buildDefaultCodeForLeader(appState.deck.leader.slug));
          }
          appState.save.activeCode = encodeRumblo(appState.deck);
          writeSaveData(appState.save);
          showToast(`已切换至方案 ${slotIdx + 1}`);
          render();
        },
        onSelectPreset: (presetId) => {
          sfx.play('select');
          const preset = PRESET_DECKS.find((p) => p.id === presetId);
          if (!preset) return;
          appState.deck = decodeRumblo(preset.code);
          appState.save.selectedPresetId = preset.id;
          appState.save.activeCode = preset.code;
          const lp = ensureLeaderPresets(appState.deck.leader.slug);
          lp.slots[lp.activeSlot || 0] = preset.code;
          appState.shareModalOpen = false;
          writeSaveData(appState.save);
          showToast(`已切换阵容：${preset.nameZh}`);
          render();
        },
        onOpenShareModal: () => {
          sfx.play('click');
          appState.shareModalOpen = true;
          render();
        },
        onCloseShareModal: () => {
          sfx.play('click');
          appState.shareModalOpen = false;
          render();
        },
        onCopyCode: async (code) => {
          try {
            await navigator.clipboard?.writeText(code);
            showToast('已复制 rumblo: 分享码！');
          } catch {
            showToast('请从输入框长按/复制分享码');
          }
        },
        onImportCode: (rawCode) => {
          try {
            appState.deck = decodeRumblo(rawCode);
            persistDeck(null);
            appState.shareModalOpen = false;
            showToast('成功导入 rumblo: 战队配置！');
            render();
          } catch (err) {
            showToast(err.message || '分享码格式错误');
          }
        },
        onSelectDifficulty: (diffId) => {
          sfx.play('click');
          appState.save.difficultyId = diffId;
          writeSaveData(appState.save);
          render();
        },
        onInspectSlot: (slot, slug) => {
          sfx.play('click');
          appState.inspectSlot = { slot, slug };
          render();
        },
        onCloseInspect: () => {
          sfx.play('click');
          appState.inspectSlot = null;
          render();
        },
        onStartSwapSlot: (slot) => {
          sfx.play('select');
          appState.inspectSlot = null;
          appState.swapSlot = slot;
          showToast('请从下方【已收集士兵】中点选要替换上阵的棋子');
          render();
        },
        onCancelSwap: () => {
          appState.swapSlot = null;
          render();
        },
        onEquipCollectionMini: (slug) => {
          const mini = MINI_BY_SLUG.get(slug);
          if (!mini) return;
          if (mini.type === 'Leader') {
            sfx.play('select');
            const lp = ensureLeaderPresets(slug);
            const code = lp.slots[lp.activeSlot || 0] || buildDefaultCodeForLeader(slug);
            appState.deck = decodeRumblo(code);
            persistDeck(null);
            showToast(`已切换主将：${mini.nameZh}`);
            render();
            return;
          }
          let targetSlot = typeof appState.swapSlot === 'number' ? appState.swapSlot : null;
          const alreadyIdx = appState.deck.troops.findIndex((t) => t.slug === slug);
          if (targetSlot == null) {
            // Open quick inspect modal for collection mini
            appState.inspectSlot = { slot: alreadyIdx >= 0 ? alreadyIdx : 'collection', slug };
            render();
            return;
          }
          sfx.play('deploy');
          const defaultTalent = mini.talents?.[0]?.codeIndex ?? 0;
          if (alreadyIdx >= 0 && alreadyIdx !== targetSlot) {
            const tmp = appState.deck.troops[targetSlot];
            appState.deck.troops[targetSlot] = appState.deck.troops[alreadyIdx];
            appState.deck.troops[alreadyIdx] = tmp;
          } else {
            appState.deck.troops[targetSlot] = { slug, talentIndex: defaultTalent };
          }
          appState.swapSlot = null;
          persistDeck(null);
          showToast(`已上阵【${mini.nameZh}】`);
          render();
        },
        onPickTalent: (slot, talentCodeIdx, slugFromInspect = null) => {
          sfx.play('select');
          if (slot === 'leader') {
            appState.deck.leader.talentIndex = talentCodeIdx;
          } else if (typeof slot === 'number' && appState.deck.troops[slot]) {
            appState.deck.troops[slot].talentIndex = talentCodeIdx;
          } else if (slugFromInspect) {
            // Equip into slot 0 if inspecting from collection & clicking equip
            appState.deck.troops[0] = { slug: slugFromInspect, talentIndex: talentCodeIdx };
          }
          persistDeck(null);
          render();
        },
        onFilterCollection: (fam) => {
          sfx.play('click');
          appState.collectionFilter = fam;
          render();
        },
        onClaimShopFree: () => {
          if (appState.save.claimedShopFree) return;
          sfx.play('gold');
          appState.save.claimedShopFree = true;
          appState.save.coins = (appState.save.coins || 0) + 500;
          writeSaveData(appState.save);
          showToast('领取每日免费补给：+500 金币！');
          render();
        },
        onBuyShopOffer: (offerId, slug, price) => {
          if ((appState.save.purchasedShopIds || []).includes(offerId)) return;
          if ((appState.save.coins || 0) < price) {
            showToast('金币不足！完成战役、任务或暗月挑战即可赚取金币');
            return;
          }
          sfx.play('gold');
          appState.save.coins -= price;
          appState.save.arclight = (appState.save.arclight || 0) + 600;
          appState.save.purchasedShopIds = [...(appState.save.purchasedShopIds || []), offerId];
          writeSaveData(appState.save);
          const mini = MINI_BY_SLUG.get(slug);
          showToast(`购买成功：【${mini?.nameZh || slug}】星级经验与弧光能量已提升！`);
          render();
        },
        onClaimDarkmoon: (challengeId, tickets, gold) => {
          if (appState.save.darkmoonClaimed?.[challengeId]) return;
          sfx.play('gold');
          if (!appState.save.darkmoonClaimed) appState.save.darkmoonClaimed = {};
          appState.save.darkmoonClaimed[challengeId] = true;
          appState.save.tickets = (appState.save.tickets || 0) + tickets;
          appState.save.coins = (appState.save.coins || 0) + gold;
          writeSaveData(appState.save);
          showToast(`已领取暗月奖券 +${tickets} · 金币 +${gold}！`);
          render();
        },
      });
      window.__wrApp = { appState, launchMission };
    }
  };

  render();
}
