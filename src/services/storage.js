import { PRESET_DECKS } from '../data/presets.js';

const STORAGE_KEY = 'warcraft_rumble_standalone_save_v1';

const DEFAULT_SAVE = {
  selectedPresetId: PRESET_DECKS[0].id,
  activeCode: PRESET_DECKS[0].code,
  difficultyId: 'standard',
  muted: false,
  customDecks: [],
  records: {
    attempts: 0,
    wins: 0,
    bestWinRemainingSec: null,
    lowestBossHpPct: 100,
    bestWinDeckName: '',
  },
};

function getStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // ignore storage restricted environments
  }
  return null;
}

export function loadSaveData() {
  const storage = getStorage();
  if (!storage) return structuredClone(DEFAULT_SAVE);
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_SAVE);
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SAVE,
      ...parsed,
      records: {
        ...DEFAULT_SAVE.records,
        ...(parsed.records || {}),
      },
      customDecks: Array.isArray(parsed.customDecks) ? parsed.customDecks : [],
    };
  } catch {
    return structuredClone(DEFAULT_SAVE);
  }
}

export function writeSaveData(data) {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function recordBattleOutcome(outcome) {
  const save = loadSaveData();
  save.records.attempts = (save.records.attempts || 0) + 1;

  if (typeof outcome.bossHpPct === 'number') {
    const prevLowest = save.records.lowestBossHpPct ?? 100;
    if (outcome.bossHpPct < prevLowest) {
      save.records.lowestBossHpPct = Math.max(0, Math.round(outcome.bossHpPct * 10) / 10);
    }
  }

  if (outcome.victory) {
    save.records.wins = (save.records.wins || 0) + 1;
    save.records.lowestBossHpPct = 0;
    const rem = Math.round(outcome.remainingTimeSec || 0);
    if (save.records.bestWinRemainingSec == null || rem > save.records.bestWinRemainingSec) {
      save.records.bestWinRemainingSec = rem;
      save.records.bestWinDeckName = outcome.deckName || '';
    }
  }

  writeSaveData(save);
  return save;
}
