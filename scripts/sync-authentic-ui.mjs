import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const UNITY_RESOURCES = resolve(
  process.env.UNITY_SOURCE || resolve(PROJECT_ROOT, '../IdeaProjects/rea/WarcraftRumbleUnity/Assets/Resources')
);

const AUTH_OUT = resolve(PROJECT_ROOT, 'public/r/authentic');
const AUDIO_OUT = resolve(PROJECT_ROOT, 'public/r/audio');

mkdirSync(AUTH_OUT, { recursive: true });
mkdirSync(AUDIO_OUT, { recursive: true });

if (!existsSync(UNITY_RESOURCES)) {
  throw new Error(`Missing Unity Resources source: ${UNITY_RESOURCES}`);
}

const IMAGE_MAP = [
  // Authentic screen / title / loading / tray art
  ['UI/Authentic/Authentic_Victory_Title.png', 'victory-title.webp'],
  ['UI/Authentic/Authentic_Defeat_Title.png', 'defeat-title.webp'],
  ['UI/Authentic/Authentic_Loading_Screen.png', 'loading-screen.webp'],
  ['UI/Victory_Background.png', 'victory-bg.webp'],
  ['UI/CombatHUD_Tray_Wood.png', 'combat-tray-wood.webp'],
  ['UI/Leader_Crown.png', 'leader-crown.webp'],
  ['UI/CombatHUD_Crossed_Swords.png', 'crossed-swords.webp'],
  ['UI/LevelMeter_Frame.png', 'level-meter-frame.webp'],
  ['UI/Shared_Tex_Currency_ArcEnergy.png', 'currency-arclight.webp'],
  ['UI/Shared_Tex_Currency_Core.png', 'currency-core.webp'],
  ['UI/Reward_Gold_Small.png', 'currency-gold.webp'],
  ['UI/Gold_Nugget_Icon.png', 'gold-nugget-icon.webp'],
  ['UI/Quest_Icon.png', 'quest-icon.webp'],
  ['UI/QuestButton.png', 'quest-button-icon.webp'],
  ['UI/PvP_Icon.png', 'pvp-icon.webp'],
  ['UI/SkullAvailable.png', 'skull-available.webp'],
  ['UI/ConquestComplete.png', 'conquest-complete.webp'],
  ['UI/World/ConquestAvailable.png', 'conquest-available.webp'],
  ['UI/World/Map_Tex_Currency_OnyxiaCoin.png', 'onyxia-coin.webp'],
  ['UI/World/Quests_Tex_1xQuest.png', 'quest-tome-1.webp'],
  ['UI/World/Quests_Tex_2xQuest.png', 'quest-tome-2.webp'],
  ['UI/World/Quests_Tex_3xQuest.png', 'quest-tome-3.webp'],
  ['UI/World/DailyReward_Frame.png', 'daily-reward-frame.webp'],
  ['UI/World/DailyReward_EarnedPip.png', 'daily-reward-pip.webp'],
  ['UI/World/WoodBG_NoRewards.png', 'wood-bg.webp'],
  ['UI/World/ZoneConquered.png', 'zone-conquered.webp'],
  ['UI/Campaign/MissionList_BossFrame.png', 'mission-boss-frame.webp'],
  ['UI/Campaign/MissionList_Button.png', 'mission-list-btn.webp'],
  ['UI/Campaign/MissionList_Connector.png', 'mission-connector.webp'],
  ['UI/Campaign/Global_Tex_LevelFrame.png', 'mission-level-frame.webp'],
  ['UI/Campaign/MisisonList_Tex_HeroicLevelFrame.png', 'mission-heroic-frame.webp'],
  ['UI/Campaign/MissionInfo_ContentPanel.png', 'mission-info-panel.webp'],

  // Army & Inventory UI
  ['UI/inventory/CurrentArmyBG.png', 'current-army-bg.webp'],
  ['UI/inventory/CurrentArmyBG_TopCoils.png', 'current-army-coils.webp'],
  ['UI/inventory/CurrentArmy_BuffSlot_01.png', 'buff-slot-01.webp'],
  ['UI/inventory/CurrentArmy_BuffSlot_02.png', 'buff-slot-02.webp'],
  ['UI/inventory/CurrentArmy_BuffSlot_03.png', 'buff-slot-03.webp'],
  ['UI/inventory/CurrentArmy_BuffSlot_Active_Bg.png', 'buff-slot-active.webp'],
  ['UI/inventory/Button_Circle_MetalFrame.png', 'circle-metal-frame.webp'],
  ['UI/inventory/Button_Circle_Blue.png', 'circle-blue.webp'],
  ['UI/inventory/Button_Circle_Glowing.png', 'circle-glowing.webp'],
  ['UI/inventory/Button_Valor_Upgrade.png', 'valor-upgrade-btn.webp'],
  ['UI/inventory/Global_Tex_InventoryLevelFrame_Alliance.png', 'level-frame-alliance.webp'],
  ['UI/inventory/Global_Tex_InventoryLevelFrame_Horde.png', 'level-frame-horde.webp'],
  ['UI/inventory/Global_Tex_InventoryLevelFrame_Blackrock.png', 'level-frame-blackrock.webp'],
  ['UI/inventory/Global_Tex_InventoryLevelFrame_Beast.png', 'level-frame-beast.webp'],
  ['UI/inventory/Global_Tex_InventoryLevelFrame_Undead.png', 'level-frame-undead.webp'],

  // Statue Bases (Pedestals)
  ['Textures/Statue_Base_Alliance_Pose.png', 'statue-base-alliance.webp'],
  ['Textures/Statue_Base_Horde_Pose.png', 'statue-base-horde.webp'],
  ['Textures/Statue_Base_Blackrock_Pose.png', 'statue-base-blackrock.webp'],
  ['Textures/Statue_Base_Beast_Pose.png', 'statue-base-beast.webp'],
  ['Textures/Statue_Base_Undead_Pose.png', 'statue-base-undead.webp'],
  ['Textures/Statue_Base_Cenarion_Pose.png', 'statue-base-cenarion.webp'],
  ['Textures/Statue_Base_Neutral_Pose.png', 'statue-base-neutral.webp'],
  ['Textures/Statue_Base_Split_Horde_Blackrock_Pose.png', 'statue-base-split-horde-blackrock.webp'],
  ['Textures/Statue_Base_Split_Blackrock_Horde_Pose.png', 'statue-base-split-blackrock-horde.webp'],
  ['Textures/Statue_Base_Split_Alliance_Undead_Pose.png', 'statue-base-split-alliance-undead.webp'],
  ['Textures/Statue_Base_Split_Alliance_Cenarion_Pose.png', 'statue-base-split-alliance-cenarion.webp'],
  ['Textures/Statue_Base_Split_Beast_Blackrock_Pose.png', 'statue-base-split-beast-blackrock.webp'],
  ['Textures/Statue_Base_Split_Undead_Beast_Pose.png', 'statue-base-split-undead-beast.webp'],
  ['Textures/Statue_Base_Split_Undead_Horde_Pose.png', 'statue-base-split-undead-horde.webp'],
];

const AUDIO_MAP = [
  ['Sounds/UI_Gameplay_0.wav', 'ui-click.mp3'],
  ['Sounds/UI_Gameplay_1.wav', 'ui-start.mp3'],
  ['Sounds/UI_Gameplay_2.wav', 'ui-deploy.mp3'],
  ['Sounds/UI_Gameplay_3.wav', 'ui-select.mp3'],
  ['Sounds/UI_Gameplay_4.wav', 'ui-victory.mp3'],
  ['Sounds/Alerts_Gold_0.wav', 'gold-coin.mp3'],
];

let copiedImg = 0;
for (const [srcRel, dstName] of IMAGE_MAP) {
  const src = resolve(UNITY_RESOURCES, srcRel);
  const dst = resolve(AUTH_OUT, dstName);
  if (!existsSync(src)) {
    console.warn(`[sync-authentic-ui] Missing image: ${src}`);
    continue;
  }
  execFileSync('cwebp', ['-q', '84', '-quiet', src, '-o', dst]);
  copiedImg++;
}

let copiedAudio = 0;
for (const [srcRel, dstName] of AUDIO_MAP) {
  const src = resolve(UNITY_RESOURCES, srcRel);
  const dst = resolve(AUDIO_OUT, dstName);
  if (!existsSync(src)) {
    console.warn(`[sync-authentic-ui] Missing audio: ${src}`);
    continue;
  }
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-b:a', '96k', dst]);
  copiedAudio++;
}

console.log(`[sync-authentic-ui] Converted ${copiedImg} authentic UI textures -> public/r/authentic/ and ${copiedAudio} SFX -> public/r/audio/.`);
