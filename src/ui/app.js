import { PRESET_DECKS, getDifficultyById } from '../data/presets.js';
import { decodeRumblo, encodeRumblo } from '../services/rumblo.js';
import { loadSaveData, recordBattleOutcome, writeSaveData } from '../services/storage.js';
import { MINI_BY_SLUG } from '../engine/unit-stats.js';
import { sfx } from '../audio/sfx.js';
import { renderLobbyView } from './lobby-view.js';
import { BattleController } from './battle-hud.js';

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
    deck = decodeRumblo(PRESET_DECKS[0].code);
    save.activeCode = PRESET_DECKS[0].code;
    save.selectedPresetId = PRESET_DECKS[0].id;
    writeSaveData(save);
  }

  const appState = {
    mode: 'lobby',
    save,
    deck,
    picker: { slot: null, search: '', family: 'all' },
  };

  let battleCtrl = null;

  const persistDeck = (customPresetId = null) => {
    appState.save.activeCode = encodeRumblo(appState.deck);
    if (customPresetId !== undefined) {
      appState.save.selectedPresetId = customPresetId;
    }
    writeSaveData(appState.save);
  };

  const render = () => {
    if (appState.mode === 'lobby') {
      if (battleCtrl) {
        battleCtrl.destroy();
        battleCtrl = null;
      }
      renderLobbyView(root, modalRoot, appState, {
        onToggleMute: () => {
          appState.save.muted = !appState.save.muted;
          sfx.setMuted(appState.save.muted);
          writeSaveData(appState.save);
          render();
        },
        onSelectPreset: (presetId) => {
          const preset = PRESET_DECKS.find((p) => p.id === presetId);
          if (!preset) return;
          appState.deck = decodeRumblo(preset.code);
          appState.save.selectedPresetId = preset.id;
          appState.save.activeCode = preset.code;
          writeSaveData(appState.save);
          showToast(`已切换阵容：${preset.nameZh}`);
          render();
        },
        onSelectDifficulty: (diffId) => {
          appState.save.difficultyId = diffId;
          writeSaveData(appState.save);
          render();
        },
        onShiftTroop: (slotIdx, delta) => {
          const targetIdx = slotIdx + delta;
          if (targetIdx < 0 || targetIdx >= appState.deck.troops.length) return;
          const arr = appState.deck.troops;
          [arr[slotIdx], arr[targetIdx]] = [arr[targetIdx], arr[slotIdx]];
          persistDeck(null);
          render();
        },
        onCopyCode: async (code) => {
          try {
            await navigator.clipboard?.writeText(code);
            showToast('已复制 rumblo: 分享码到剪贴板');
          } catch {
            showToast('分享码已就绪，请从输入框手动复制');
          }
        },
        onImportCode: (rawCode) => {
          try {
            appState.deck = decodeRumblo(rawCode);
            persistDeck(null);
            showToast('成功导入 rumblo: 卡组！');
            render();
          } catch (err) {
            showToast(err.message || '分享码格式错误');
          }
        },
        onOpenPicker: (slot) => {
          appState.picker = { slot, search: '', family: 'all' };
          render();
        },
        onClosePicker: () => {
          appState.picker.slot = null;
          render();
        },
        onPickerSearch: (val) => {
          appState.picker.search = val;
          appState.picker.refocusSearch = true;
          render();
          appState.picker.refocusSearch = false;
        },
        onPickerFamily: (fam) => {
          appState.picker.family = fam;
          render();
        },
        onPickUnit: (slug) => {
          const mini = MINI_BY_SLUG.get(slug);
          if (!mini) return;
          const defaultTalent = mini.talents?.[0]?.codeIndex ?? 0;
          if (appState.picker.slot === 'leader') {
            appState.deck.leader = { slug, talentIndex: defaultTalent };
          } else {
            const idx = Number(appState.picker.slot);
            appState.deck.troops[idx] = { slug, talentIndex: defaultTalent };
          }
          persistDeck(null);
          render();
        },
        onPickTalent: (talentCodeIdx) => {
          if (appState.picker.slot === 'leader') {
            appState.deck.leader.talentIndex = talentCodeIdx;
          } else {
            const idx = Number(appState.picker.slot);
            appState.deck.troops[idx].talentIndex = talentCodeIdx;
          }
          persistDeck(null);
          render();
        },
        onStartBattle: () => {
          appState.mode = 'battle';
          appState.picker.slot = null;
          const difficulty = getDifficultyById(appState.save.difficultyId);
          const preset = PRESET_DECKS.find((p) => p.id === appState.save.selectedPresetId);
          battleCtrl = new BattleController(root, modalRoot, {
            deck: structuredClone(appState.deck),
            difficulty,
            deckName: preset?.nameZh || '自定义阵容',
            onToast: showToast,
            onBattleFinish: (snap) => {
              appState.save = recordBattleOutcome({
                victory: snap.victory,
                bossHpPct: snap.bossHpPct,
                remainingTimeSec: snap.remainingSec,
                deckName: preset?.nameZh || '自定义阵容',
              });
            },
            onExitLobby: () => {
              appState.mode = 'lobby';
              render();
            },
          });
          battleCtrl.mount();
        },
      });
    }
  };

  render();
}
