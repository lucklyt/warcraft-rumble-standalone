import { PRESET_DECKS, USER_DEFAULT_THRALL_CODE } from '../data/presets.js';

const STORAGE_KEY = 'warcraft_rumble_standalone_save_v2';

const DEFAULT_SAVE = {
  selectedPresetId: PRESET_DECKS[0].id,
  activeCode: USER_DEFAULT_THRALL_CODE,
  difficultyId: 'standard',
  activeTab: 'map',
  continent: 'kalimdor',
  selectedZoneId: 'onyxia_zone',
  selectedMissionId: 'onyxia_lair',
  muted: false,
  coins: 12312,
  sigils: 160,
  arclight: 505810,
  tickets: 1400,
  claimedShopFree: false,
  purchasedShopIds: [],
  darkmoonProgress: { matches: 0, wins: 0, cards: 0 },
  darkmoonClaimed: {},
  leaderPresets: {
    thrall: {
      activeSlot: 0,
      slots: [
        USER_DEFAULT_THRALL_CODE,
        'rumblo:CF8QABoECBwQABoECEYQABoECF4QAhoECFkQAhoECCcQABoECDEQAg==',
        'rumblo:CF8QABoECCwQARoECFEQABoECBMQABoECBwQABoECFMQABoECBkQAg==',
      ],
    },
  },
  customDecks: [],
  records: {
    attempts: 0,
    wins: 0,
    bestWinRemainingSec: null,
    lowestBossHpPct: 100,
    bestWinDeckName: '',
    clearedMissions: [],
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
      leaderPresets: {
        ...DEFAULT_SAVE.leaderPresets,
        ...(parsed.leaderPresets || {}),
      },
      darkmoonProgress: {
        ...DEFAULT_SAVE.darkmoonProgress,
        ...(parsed.darkmoonProgress || {}),
      },
      darkmoonClaimed: {
        ...DEFAULT_SAVE.darkmoonClaimed,
        ...(parsed.darkmoonClaimed || {}),
      },
      records: {
        ...DEFAULT_SAVE.records,
        ...(parsed.records || {}),
        clearedMissions: Array.isArray(parsed.records?.clearedMissions)
          ? parsed.records.clearedMissions
          : [],
      },
      purchasedShopIds: Array.isArray(parsed.purchasedShopIds) ? parsed.purchasedShopIds : [],
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
  save.darkmoonProgress.matches = (save.darkmoonProgress.matches || 0) + 1;
  if (typeof outcome.cardsPlayed === 'number') {
    save.darkmoonProgress.cards = (save.darkmoonProgress.cards || 0) + outcome.cardsPlayed;
  }

  if (typeof outcome.bossHpPct === 'number') {
    const prevLowest = save.records.lowestBossHpPct ?? 100;
    if (outcome.bossHpPct < prevLowest) {
      save.records.lowestBossHpPct = Math.max(0, Math.round(outcome.bossHpPct * 10) / 10);
    }
  }

  if (outcome.victory) {
    save.records.wins = (save.records.wins || 0) + 1;
    save.darkmoonProgress.wins = (save.darkmoonProgress.wins || 0) + 1;
    save.coins = (save.coins || 0) + (outcome.rewardGold || 150);
    save.arclight = (save.arclight || 0) + 250;
    if (outcome.missionId && !save.records.clearedMissions.includes(outcome.missionId)) {
      save.records.clearedMissions.push(outcome.missionId);
    }
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
