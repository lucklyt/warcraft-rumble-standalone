import { CACHED_MINI_ART } from './mini-art-cache.js';
import { WIKI_MINI_ART } from './mini-art-wiki.js';
// Original game-rendered 2D model and leader portrait images.
// Exact sources and coverage: docs/design/mini-art-assets.json.
// Missing entries are intentionally absent, never substituted with an unrelated miniature.
const APK_MINI_ART = {
  "angry-chickens": {
    "model": "./r/models/angry-chickens.webp"
  },
  "anub-arak": {
    "model": "./r/models/anub-arak.webp",
    "portrait": "./r/leaders/anub-arak.webp"
  },
  "arthas": {
    "model": "./r/models/arthas.webp",
    "portrait": "./r/leaders/arthas.webp"
  },
  "baron-rivendare": {
    "model": "./r/models/baron-rivendare.webp",
    "portrait": "./r/leaders/baron-rivendare.webp"
  },
  "blizzard": {
    "model": "./r/models/blizzard.webp"
  },
  "bloodmage-thalnos": {
    "portrait": "./r/leaders/bloodmage-thalnos.webp"
  },
  "cairne-bloodhoof": {
    "model": "./r/models/cairne-bloodhoof.webp",
    "portrait": "./r/leaders/cairne-bloodhoof.webp"
  },
  "chain-lightning": {
    "model": "./r/models/chain-lightning.webp"
  },
  "charlga-razorflank": {
    "model": "./r/models/charlga-razorflank.webp",
    "portrait": "./r/leaders/charlga-razorflank.webp"
  },
  "darkspear-troll": {
    "model": "./r/models/darkspear-troll.webp"
  },
  "deep-breath": {
    "model": "./r/models/deep-breath.webp"
  },
  "earth-elemental": {
    "model": "./r/models/earth-elemental.webp"
  },
  "emperor-thaurissan": {
    "model": "./r/models/emperor-thaurissan.webp",
    "portrait": "./r/leaders/emperor-thaurissan.webp"
  },
  "footmen": {
    "model": "./r/models/footmen.webp"
  },
  "general-drakkisath": {
    "model": "./r/models/general-drakkisath.webp",
    "portrait": "./r/leaders/general-drakkisath.webp"
  },
  "gnoll-brute": {
    "model": "./r/models/gnoll-brute.webp"
  },
  "grommash-hellscream": {
    "model": "./r/models/grommash-hellscream.webp",
    "portrait": "./r/leaders/grommash-hellscream.webp"
  },
  "gryphon-rider": {
    "model": "./r/models/gryphon-rider.webp"
  },
  "hogger": {
    "model": "./r/models/hogger.webp",
    "portrait": "./r/leaders/hogger.webp"
  },
  "jaina-proudmoore": {
    "model": "./r/models/jaina-proudmoore.webp",
    "portrait": "./r/leaders/jaina-proudmoore.webp"
  },
  "maiev-shadowsong": {
    "model": "./r/models/maiev-shadowsong.webp",
    "portrait": "./r/leaders/maiev-shadowsong.webp"
  },
  "malfurion": {
    "model": "./r/models/malfurion.webp",
    "portrait": "./r/leaders/malfurion.webp"
  },
  "molten-giant": {
    "model": "./r/models/molten-giant.webp"
  },
  "old-murk-eye": {
    "model": "./r/models/old-murk-eye.webp",
    "portrait": "./r/leaders/old-murk-eye.webp"
  },
  "orgrim-doomhammer": {
    "model": "./r/models/orgrim-doomhammer.webp",
    "portrait": "./r/leaders/orgrim-doomhammer.webp"
  },
  "polymorph": {
    "model": "./r/models/polymorph.webp"
  },
  "priestess": {
    "model": "./r/models/priestess.webp"
  },
  "prowler": {
    "model": "./r/models/prowler.webp"
  },
  "rend-blackhand": {
    "model": "./r/models/rend-blackhand.webp",
    "portrait": "./r/leaders/rend-blackhand.webp"
  },
  "s-a-f-e-pilot": {
    "model": "./r/models/s-a-f-e-pilot.webp"
  },
  "sneed": {
    "model": "./r/models/sneed.webp",
    "portrait": "./r/leaders/sneed.webp"
  },
  "sylvanas-windrunner": {
    "model": "./r/models/sylvanas-windrunner.webp",
    "portrait": "./r/leaders/sylvanas-windrunner.webp"
  },
  "thrall": {
    "model": "./r/models/thrall.webp",
    "portrait": "./r/leaders/thrall.webp"
  },
  "tirion-fordring": {
    "model": "./r/models/tirion-fordring.webp",
    "portrait": "./r/leaders/tirion-fordring.webp"
  }
};

// Merge each mini's fields so an APK portrait cannot hide its cached full-body model.
const external = WIKI_MINI_ART;
export const MINI_ART = Object.fromEntries([...new Set([...Object.keys(external), ...Object.keys(CACHED_MINI_ART), ...Object.keys(APK_MINI_ART)])].map(slug => [slug, {...external[slug], ...CACHED_MINI_ART[slug], ...APK_MINI_ART[slug]}]));
