// Synced Warcraft Rumble minis, talents, leader abilities & live tier rankings
export const PVP_ROTATION = [
  {
    "key": "Tower Guard Towers",
    "titleZh": "防御塔：箭塔",
    "descZh": "单目标防御塔，拥有狂怒！",
    "icon": "./r/p/1.jpg"
  },
  {
    "key": "Modifier Clean Fight",
    "titleZh": "机制：公平较量",
    "descZh": "没有武器，没有诡计，只有单纯的硬碰硬。",
    "icon": "./r/p/2.jpg"
  },
  {
    "key": "Enchant Adrenaline Rush",
    "titleZh": "附魔：强心激素",
    "descZh": "随着你的基地生命值降低，你的收入将有所提高。",
    "icon": "./r/p/0.jpg"
  }
];

export const PVP_MAPS = [
  {
    "name": "Alterac Valley",
    "nameZh": "奥特兰克山谷"
  },
  {
    "name": "Arathi Basin",
    "nameZh": "阿拉希盆地"
  },
  {
    "name": "Gadgetzan",
    "nameZh": "加基森"
  },
  {
    "name": "Hillsbrad Foothills",
    "nameZh": "希尔斯布莱德丘陵"
  },
  {
    "name": "Timbermaw Hold",
    "nameZh": "木喉要塞"
  }
];

export const MINIS = [
  {
    "slug": "abomination",
    "shortId": 14,
    "name": "Abomination",
    "nameZh": "憎恶",
    "type": "Troop",
    "families": [
      "Undead"
    ],
    "cost": 6,
    "health": 3400,
    "damage": 170,
    "dps": 68,
    "speed": "Slow",
    "traits": [
      "Hook",
      "Tank",
      "Slow",
      "Melee",
      "AoE"
    ],
    "img": "./r/m/14.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "down",
      "pve": "B",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Fresh Meat",
        "nameZh": "新鲜的肉",
        "desc": "After hooking a target, deal double damage on the next attack.",
        "descZh": "钩到目标后，下一次攻击会造成双倍伤害。",
        "icon": "./r/t/14-0.png",
        "pvpRec": "silver",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Noxious Presence",
        "nameZh": "有害污染",
        "desc": "Poison nearby enemies every 3 seconds.",
        "descZh": "每3秒使附近的敌人中毒一次。",
        "icon": "./r/t/14-1.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Cannonball",
        "nameZh": "炮弹来袭",
        "desc": "On deploy and at 50% health, stun nearby enemies for 5 seconds.",
        "descZh": "部署时或生命值到50%时，会使附近的敌人昏迷5秒。",
        "icon": "./r/t/14-2.png",
        "pvpRec": "silver",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "肉钩射程",
        "value": "8.0码"
      },
      {
        "label": "肉钩冷却",
        "value": "10秒"
      },
      {
        "label": "挥砍范围",
        "value": "扇形顺劈AOE"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "优先选【鲜肉】：PvP（尤其淘金热词缀）可直接勾杀女猎手、巫医等致命后排；【炮弹】在塔下防守推进时表现优异；【剧毒新星】把单体坦克变成泛用范围清场单位，开荒稳妥。",
    "officialQuote": "由无数残肢缝合而成的憎恶巨怪，嗜血的铁钩是他捕获猎物的不二法宝。",
    "skill": {
      "nameZh": "屠夫肉钩",
      "descZh": "每隔 10 秒向 8 码范围内最远的敌方远程或高价值棋子掷出钢铁肉钩，强行将其拖拽至身前并击晕，随后施展近战顺劈范围挥砍。"
    }
  },
  {
    "slug": "ancient-of-war",
    "shortId": 15,
    "name": "Ancient of War",
    "nameZh": "战争古树",
    "type": "Troop",
    "families": [
      "Cenarion"
    ],
    "cost": 0,
    "health": 850,
    "damage": 60,
    "dps": 0,
    "speed": "Slow",
    "traits": [
      "Surge",
      "Tank",
      "Armored",
      "Slow",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/15.png",
    "tiers": {
      "pvp": "A",
      "pvpChange": "down",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Sapling",
        "nameZh": "树苗",
        "desc": "If played for 4 Gold or less, gain 100% Attack Speed.",
        "descZh": "如果以4或更低费用部署，获得+100%攻击速度。",
        "icon": "./r/t/15-0.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Behemoth",
        "nameZh": "巨树",
        "desc": "Gain Siege damage.",
        "descZh": "获得攻城伤害。",
        "icon": "./r/t/15-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Lightning Rod",
        "nameZh": "引雷针",
        "desc": "If played for 5 Gold or more, redirect enemy Spell and Unbound deploys to Ancient of War's current location.",
        "descZh": "如果以5或更高费用部署，将敌方的法术和空投部署转移到战争古树的当前位置。",
        "icon": "./r/t/15-2.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 2,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "动态费用",
        "value": "消耗全部黄金(1-10费)"
      },
      {
        "label": "体型增幅",
        "value": "随费用成倍变大"
      },
      {
        "label": "攻击间隔",
        "value": "2.2秒"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "【避雷针】是 PvP 第一也是唯一核心天赋：吸收全图法术与空投单位保护大部队，淘金热词缀必带，PvE 也能废掉活体炸弹与空降切后。另两个天赋泛用性极低。",
    "officialQuote": "沉睡千万年的古老战争古树，汇聚的黄金越是充沛，拔地而起的战力便越是惊天动地。",
    "skill": {
      "nameZh": "拔树聚力",
      "descZh": "消耗当前所有的可用黄金进行部署（最低 1 费，最高 10 费）。每多消耗 1 点黄金，其最大生命值、攻击伤害与体型便大幅成倍增加。"
    }
  },
  {
    "slug": "angry-chickens",
    "shortId": 1,
    "name": "Angry Chickens",
    "nameZh": "愤怒的小鸡",
    "type": "Troop",
    "families": [
      "Beast"
    ],
    "cost": 2,
    "health": 25,
    "damage": 50,
    "dps": 50,
    "speed": "Med-Fast",
    "traits": [
      "Cycle",
      "Fast",
      "Melee",
      "Squad"
    ],
    "img": "./r/m/1.png",
    "tiers": {
      "pvp": "D",
      "pvpChange": "down",
      "pve": "B",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Snackrifice",
        "nameZh": "点心献祭",
        "desc": "Nearby Beast allies can consume a Chicken to heal themselves.",
        "descZh": "附近的野兽盟友可以吞食一只小鸡来治疗自身。",
        "icon": "./r/t/1-0.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Walking Crate",
        "nameZh": "自走箱",
        "desc": "Deploy in a protective crate. When destroyed, Chickens emerge.",
        "descZh": "部署在防护箱中。，箱子被毁后，鸡群就会出现。",
        "icon": "./r/t/1-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Furious Fowl",
        "nameZh": "狂怒家禽",
        "desc": "Gain Fury.",
        "descZh": "获得“狂暴”特性。",
        "icon": "./r/t/1-2.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "编组数量",
        "value": "5只小鸡"
      },
      {
        "label": "攻击间隔",
        "value": "0.8秒"
      },
      {
        "label": "弱点特性",
        "value": "极度脆弱惧怕范围伤害"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "首推【狂暴家禽】显著拔高小鸡秒伤；【会走的箱子】仅用于硬吃一发法术抢部署；【零食祭献】触发条件苛刻极少上场。",
    "officialQuote": "别被它们滑稽的外表欺骗，当这群被激怒的母鸡蜂拥而上时，就算是钢铁也要被啄成碎屑！",
    "skill": {
      "nameZh": "狂怒鸡群撕咬",
      "descZh": "一次性出动 5 只狂暴小鸡构成的冲锋队。近战攻击极快，虽然生命脆弱惧怕 AOE，但集火啃噬单个大型前排时具有惊人的秒伤爆发。"
    }
  },
  {
    "slug": "anub-arak",
    "shortId": 16,
    "name": "Anub'arak",
    "nameZh": "阿努巴拉克",
    "type": "Leader",
    "families": [
      "Beast",
      "Undead"
    ],
    "cost": 6,
    "health": 1440,
    "damage": 100,
    "dps": 50,
    "speed": "Slow",
    "traits": [
      "Tank",
      "Armored",
      "Charge",
      "Slow",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/16.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "down",
      "pve": "S",
      "pveChange": "",
      "overall": "S",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Regenerate",
        "nameZh": "掘地再生",
        "desc": "Regenerate 50% health when emerging from a burrow.",
        "descZh": "从潜地状态破土而出时恢复50%生命值。",
        "icon": "./r/t/16-0.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Explosive Shells",
        "nameZh": "爆裂甲壳",
        "desc": "Scarab Beetles erupt on death, dealing damage to nearby enemies.",
        "descZh": "圣甲虫死亡时发生爆炸，对附近敌人造成伤害。",
        "icon": "./r/t/16-1.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Trap Door",
        "nameZh": "陷阱之门",
        "desc": "At 50% health, summon 12 Scarab Beetles, and temporarily submerge, avoiding attacks.",
        "descZh": "生命值降至50%时召唤12只圣甲虫，并短暂潜地规避攻击。",
        "icon": "./r/t/16-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Carrion Feast",
      "nameZh": "腐肉盛宴",
      "descZh": "在场时，每当友方亡灵或野兽棋子部署或阵亡，都会召唤 1 只圣甲虫（场上最多同时存在 12 只）。"
    },
    "statsExtra": [
      {
        "label": "范围伤害",
        "value": "100"
      },
      {
        "label": "攻击间隔",
        "value": "2.0秒"
      },
      {
        "label": "圣甲虫上限",
        "value": "12只"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "即便【爆炸甲壳】移除了爆炸附带剧毒并调高直伤，依然是全模式最稳首发天赋；PvE 生存压力小更凸显爆炸收益，另外两个坦度天赋次选即可。",
    "officialQuote": "地穴领主破土而出，用蛛网与腐肉大军淹没任何敢于踏入阿兹欧-奈幽的侵略者。",
    "skill": {
      "nameZh": "腐肉盛宴",
      "descZh": "在场时，每当友方亡灵或野兽棋子部署或阵亡，都会召唤 1 只圣甲虫（场上最多同时存在 12 只）。"
    }
  },
  {
    "slug": "arcane-blast",
    "shortId": 2,
    "name": "Arcane Blast",
    "nameZh": "奥术冲击",
    "type": "Spell",
    "families": [
      "Alliance"
    ],
    "cost": 1,
    "health": 0,
    "damage": 75,
    "dps": 0,
    "speed": "",
    "traits": [
      "Cycle",
      "Elemental",
      "Spell",
      "AoE"
    ],
    "img": "./r/m/2.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "down",
      "pve": "B",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Amplification",
        "nameZh": "增效",
        "desc": "Sequential taps increase Radius by 1.",
        "descZh": "连续点击会使半径扩大1。",
        "icon": "./r/t/2-0.png",
        "pvpRec": "silver",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Torrent",
        "nameZh": "洪流",
        "desc": "Gain a level after casting Rank 3.",
        "descZh": "施放3级法术后会提升1级。",
        "icon": "./r/t/2-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Arcane Power",
        "nameZh": "奥术强化",
        "desc": "Spell sequence starts at rank 3 and ends at rank 4.",
        "descZh": "法术顺序从3级开始4级结束。",
        "icon": "./r/t/2-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "初始费用",
        "value": "1费"
      },
      {
        "label": "最高升阶",
        "value": "4阶"
      },
      {
        "label": "伤害属性",
        "value": "范围元素伤害"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "奥术冲击首次 1 费，连放伤害翻倍且费用逐次+1（4 连总计 10 费很少打满）。主将血法师萨尔诺斯带它只为多刷法术次数，因此不选【弧光能量】，优先选【奥术增幅】最实用。",
    "officialQuote": "纯净的奥术能量在指尖汇聚，连续施放越发狂暴，倾泻出摧枯拉朽的元素爆发。",
    "skill": {
      "nameZh": "升阶奥术冲击",
      "descZh": "释放奥术冲击对范围内敌人造成范围元素伤害。每次施放后法术费用与伤害自动提升 1 阶（最高 4 阶，递增造成极高额范围打击）。"
    }
  },
  {
    "slug": "arthas",
    "shortId": 94,
    "name": "Arthas",
    "nameZh": "阿尔萨斯",
    "type": "Leader",
    "families": [
      "Alliance",
      "Undead"
    ],
    "cost": 5,
    "health": 1100,
    "damage": 185,
    "dps": 0,
    "speed": "Medium",
    "traits": [
      "Remorseless Winter",
      "Lichborne",
      "Army of the Dead",
      "Armored",
      "Frost",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/94.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "up",
      "pve": "S",
      "pveChange": "",
      "overall": "S",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Death Grip",
        "nameZh": "死亡之握",
        "desc": "Periodically pull Ranged enemies into melee range, stunning them for 2 seconds (8 second cooldown). Death Grip has a minimum range of 3 and a maximum range of 8.",
        "descZh": "周期性将远程敌人拉至近战范围并击晕2秒（冷却8秒，射程3~8）。",
        "icon": "./r/t/94-0.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Necrotic Plague",
        "nameZh": "死疽瘟疫",
        "desc": "Soulshatter also applies to Poisoned enemies.",
        "descZh": "灵魂碎裂效果同样适用于中毒敌人。",
        "icon": "./r/t/94-1.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Purgatory",
        "nameZh": "炼狱",
        "desc": "On death, become invulnerable for 3 seconds. If the target dies, return to life with 25% health. The target that needs to die, is the first enemy that Arthas attacks after resurrecting and becoming invulnerable.",
        "descZh": "死亡时进入3秒无敌；若复活后攻击的首个目标在此期间死亡，则以25%生命值重返战场。",
        "icon": "./r/t/94-2.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": true
      }
    ],
    "leaderAbility": {
      "name": "Soulshatter",
      "nameZh": "灵魂破碎",
      "descZh": "在场时，受到冰霜减速的敌人若生命值低于 20%，受到任意伤害会立即被斩杀；周围常驻霜冻减速光环。"
    },
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "首推 PvP 神技【死亡之握】：8 秒 CD 把 3-8 码远程（巫医/女祭司/无射程天赋的希尔瓦娜斯）拉进近战并晕 2 秒，PvE 同样极强；次选【炼狱】3 秒无敌续命最大化光环与召兵；【死灵瘟疫】仅 PvE 配合毒队凑数。",
    "officialQuote": "洛丹伦的堕落王子挥舞霜之哀伤，所到之处唯有刺骨严寒与死亡沉沦。",
    "skill": {
      "nameZh": "灵魂破碎",
      "descZh": "在场时，受到冰霜减速的敌人若生命值低于 20%，受到任意伤害会立即被斩杀；周围常驻霜冻减速光环。"
    },
    "statsExtra": [
      {
        "label": "攻击间隔",
        "value": "2.0秒"
      },
      {
        "label": "攻击范围",
        "value": "近战顺劈"
      },
      {
        "label": "冰霜光环",
        "value": "5码持续减速"
      }
    ]
  },
  {
    "slug": "banshee",
    "shortId": 17,
    "name": "Banshee",
    "nameZh": "女妖",
    "type": "Troop",
    "families": [
      "Undead"
    ],
    "cost": 4,
    "health": 230,
    "damage": 0,
    "dps": 0,
    "speed": "Med-Fast",
    "traits": [
      "Possession",
      "Ranged",
      "One-Target"
    ],
    "img": "./r/m/17.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "down",
      "pve": "S",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Will of the Necropolis",
        "nameZh": "浮空城意志",
        "desc": "Fully Heal the possessed target.",
        "descZh": "被占据的目标恢复满生命值。",
        "icon": "./r/t/17-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Soul Eruption",
        "nameZh": "灵魂爆发",
        "desc": "Possessed targets detonate on death, damaging nearby enemies.",
        "descZh": "被附身的目标死亡时发生爆炸，对附近敌人造成伤害。",
        "icon": "./r/t/17-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Unholy Frenzy",
        "nameZh": "精神狂乱",
        "desc": "Possessed targets gain Bloodlust for 10 seconds.",
        "descZh": "被占据的目标获得嗜血，持续10秒。",
        "icon": "./r/t/17-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": false
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "首推【亡灵天灾的意志】：把女妖适用面成倍放大，面对残血推塔主将（如雷德）或高血量怪（石像鬼/熔核犬/山岭巨人）时都能满血反控；另两个天赋在高端 PvP 较难打满收益。",
    "officialQuote": "在阴风中尖啸穿行的怨灵，为了复仇，她甘愿舍弃自己的躯壳去夺取敌人的核心巨兽。",
    "skill": {
      "nameZh": "附身夺魂",
      "descZh": "飞行穿梭接近敌方一名高价值地面非首领单位（如熔火犬、憎恶、牛头人等），牺牲自身彻底占据该棋子，将其收为己用并瞬间回满生命值！"
    },
    "statsExtra": [
      {
        "label": "攻击类型",
        "value": "单次附身消耗"
      },
      {
        "label": "附身射程",
        "value": "8.0码冲刺"
      },
      {
        "label": "被控回血",
        "value": "接管后直接满血"
      }
    ]
  },
  {
    "slug": "baron-rivendare",
    "shortId": 18,
    "name": "Baron Rivendare",
    "nameZh": "瑞文戴尔男爵",
    "type": "Leader",
    "families": [
      "Undead"
    ],
    "cost": 4,
    "health": 1040,
    "damage": 190,
    "dps": 111.8,
    "speed": "Fast",
    "traits": [
      "Tank",
      "Fast",
      "Elemental",
      "Armored",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/18.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Chill Of The Grave",
        "nameZh": "墓穴寒意",
        "desc": "Summon Skeletal Mages instead of Warriors.",
        "descZh": "将召唤的骷髅战士替换为骷髅法师。",
        "icon": "./r/t/18-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Death Pact",
        "nameZh": "死亡契约",
        "desc": "Periodically sacrifice a nearby Skeleton to be Healed.",
        "descZh": "周期性献祭附近一名骷髅来治疗自身。",
        "icon": "./r/t/18-1.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Skeletal Frenzy",
        "nameZh": "骸骨狂热",
        "desc": "Nearby allied Skeletons gain Bloodlust.",
        "descZh": "附近的友方骷髅获得嗜血效果。",
        "icon": "./r/t/18-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Army of the Dead",
      "nameZh": "亡者大军",
      "descZh": "周期性在己方控制的所有建筑（主基地、防御塔、集合石）旁自动召唤骷髅战士加入行军推进。"
    },
    "statsExtra": [
      {
        "label": "攻击间隔",
        "value": "1.8秒"
      },
      {
        "label": "攻击范围",
        "value": "近战"
      },
      {
        "label": "召唤周期",
        "value": "每13秒/建筑"
      }
    ],
    "talentNoteZh": "【墓穴寒气】是核心必选：把主将技能召唤的骷髅升级为带冰霜减速的骷髅法师，攻防两开花；次选【死亡契约】吃兵回满血强化 PvE 站场；【骷髅狂热】需纯骷髅套路支撑。",
    "officialQuote": "天灾军团的死亡骑士策马巡视斯坦索姆，不断从亡者荒冢中唤起骷髅大军。",
    "skill": {
      "nameZh": "亡者大军",
      "descZh": "周期性在己方控制的所有建筑（主基地、防御塔、集合石）旁自动召唤骷髅战士加入行军推进。"
    }
  },
  {
    "slug": "bat-rider",
    "shortId": 19,
    "name": "Bat Rider",
    "nameZh": "蝙蝠骑士",
    "type": "Troop",
    "families": [
      "Horde"
    ],
    "cost": 2,
    "health": 170,
    "damage": 250,
    "dps": 100,
    "speed": "Medium",
    "traits": [
      "Cycle",
      "Elemental",
      "Bombard",
      "Flying",
      "AoE",
      "Burn"
    ],
    "img": "./r/m/19.png",
    "tiers": {
      "pvp": "A",
      "pvpChange": "up",
      "pve": "A",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Enchanted Vials",
        "nameZh": "魔化药瓶",
        "desc": "Increase the size of the flaming pool by 30%.",
        "descZh": "使烈焰之池的范围扩大30%。",
        "icon": "./r/t/19-0.png",
        "pvpRec": "",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Flaming Pitch",
        "nameZh": "燃烧沥青",
        "desc": "Flaming pool reduces enemy's Speed by 30%.",
        "descZh": "火焰区域使敌人的移动速度降低30%。",
        "icon": "./r/t/19-1.png",
        "pvpRec": "",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Fiery Surplus",
        "nameZh": "燃料过剩",
        "desc": "\"Accidentally\" leave vials on the ground, Burning nearby enemies that touch them.",
        "descZh": "瓶子“不小心”洒在了地上，灼烧附近接触到的敌人。",
        "icon": "./r/t/19-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "攻击射程",
        "value": "7.0码"
      },
      {
        "label": "攻击间隔",
        "value": "2.2秒"
      },
      {
        "label": "焦油火海",
        "value": "地面持续减速与灼烧"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "首推【附魔药水瓶】：爆炸扩大溅射可打到刷新点或塔后远程单位，PvE 部分关卡奇效；【火焰投掷】与【烈焰盈余】相对局限，次选【火焰投掷】。",
    "officialQuote": "盘旋在战线上空的巨蝙蝠骑手，倾倒的恶臭焦油是步兵方阵永远无法逾越的死亡火海。",
    "skill": {
      "nameZh": "焦油烈焰轰炸",
      "descZh": "飞行远程兵种。向地面目标持续投掷易燃焦油瓶，在着弹区域形成持续燃烧的烈火之海，显著减速踏入的地面敌军并造成持续元素灼烧。"
    }
  },
  {
    "slug": "blizzard",
    "shortId": 3,
    "name": "Blizzard",
    "nameZh": "暴风雪",
    "type": "Spell",
    "families": [
      "Alliance"
    ],
    "cost": 4,
    "health": 0,
    "damage": 500,
    "dps": 100,
    "speed": "",
    "traits": [
      "Elemental",
      "Frost",
      "Spell",
      "AoE"
    ],
    "img": "./r/m/3.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "down",
      "pve": "A",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Cold Snap",
        "nameZh": "急速冷却",
        "desc": "Freeze enemy troops in place.",
        "descZh": "将敌方士兵冻结在原地。",
        "icon": "./r/t/3-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Brittle Ice",
        "nameZh": "脆冰",
        "desc": "Enemies within take 50% additional damage from Physical sources.",
        "descZh": "范围内的敌人受到的物理伤害额外提高50%。",
        "icon": "./r/t/3-1.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Icecrown",
        "nameZh": "冰冠堡垒",
        "desc": "Summons an additional Blizzard at your Base.",
        "descZh": "同时在你的主基地处额外召唤一道暴风雪。",
        "icon": "./r/t/3-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "持续时间",
        "value": "6.0秒"
      },
      {
        "label": "作用范围",
        "value": "大面积圆形"
      },
      {
        "label": "附带效果",
        "value": "冰霜减速"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "首推【急速冷却】：把范围定身拉满，攻城时冻结敌方脆皮防守兵与飞行群让己方白嫖拆家，极克制女妖、希尔瓦娜斯、徘徊者；次选【寒冰王冠】分推守家，【脆冰】需配高物理爆发。",
    "officialQuote": "寒冬暴雪呼啸而至，冰枪与冻气将战线彻底封锁，让敌人在迟滞中步入消亡。",
    "skill": {
      "nameZh": "暴风雪骤雨",
      "descZh": "召唤持续 6 秒的狂暴暴风雪覆盖目标区域，对踏入其中的所有敌方单位持续造成冰霜伤害并施加减速迟滞。"
    }
  },
  {
    "slug": "bloodmage-thalnos",
    "shortId": 20,
    "name": "Bloodmage Thalnos",
    "nameZh": "血法师萨尔诺斯",
    "type": "Leader",
    "families": [
      "Undead"
    ],
    "cost": 4,
    "health": 460,
    "damage": 140,
    "dps": 100,
    "speed": "Slow",
    "traits": [
      "Elemental",
      "Slow",
      "Ranged",
      "AoE"
    ],
    "img": "./r/m/20.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "up",
      "pve": "C",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Bane",
        "nameZh": "灾厄",
        "desc": "Playing a Spell increases Attack Speed by 30% for 5 seconds.",
        "descZh": "每施放一次法术，攻击速度提高30%，持续5秒。",
        "icon": "./r/t/20-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Drain Soul",
        "nameZh": "吸取灵魂",
        "desc": "Enemies killed by Thalnos reduce the cost of your next spell by 1 (12s cooldown)",
        "descZh": "萨尔诺斯击杀敌人后，使你的下一张法术牌费用降低1点（冷却12秒）。",
        "icon": "./r/t/20-1.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Dominance",
        "nameZh": "统御",
        "desc": "Spells costing 3 or more grant an additional level.",
        "descZh": "施放3费或更高费用的法术时，额外提升1级。",
        "icon": "./r/t/20-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Dark Ritual",
      "nameZh": "黑暗仪式",
      "descZh": "你每施放 1 次法术，萨尔诺斯便永久提升 1 个等级（直至本局阵亡），无限叠升伤害与生命值。"
    },
    "statsExtra": [
      {
        "label": "范围伤害",
        "value": "180"
      },
      {
        "label": "攻击间隔",
        "value": "2.2秒"
      },
      {
        "label": "法术增幅",
        "value": "+1级/法术"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "萨尔诺斯通常配合奥术冲击、假死等低费法术刷等级，【支配】对低费体系基本无效。首推【灾厄】高攻速化身机关枪爆发输出，配假死毁天灭地；次选【吸取生命】延长站场继续叠层。",
    "officialQuote": "血色十字军的堕落法师沉溺于死灵魔法，法术越是汹涌，他的力量便越发无可估量。",
    "skill": {
      "nameZh": "黑暗仪式",
      "descZh": "你每施放 1 次法术，萨尔诺斯便永久提升 1 个等级（直至本局阵亡），无限叠升伤害与生命值。"
    }
  },
  {
    "slug": "bog-beast",
    "shortId": 21,
    "name": "Bog Beast",
    "nameZh": "沼泽兽",
    "type": "Troop",
    "families": [
      "Cenarion"
    ],
    "cost": 3,
    "health": 1100,
    "damage": 165,
    "dps": 66,
    "speed": "Slow",
    "traits": [
      "Tank",
      "Resistant",
      "Slow",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/21.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "",
      "pve": "B",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Flourish",
        "nameZh": "繁盛",
        "desc": "Heals received are 50% more effective.",
        "descZh": "受到的治疗的效果提高50%。",
        "icon": "./r/t/21-0.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Rampant Growth",
        "nameZh": "快速生长",
        "desc": "At 50% health and on death, Root nearby enemies for 6 seconds.",
        "descZh": "生命值降至50%和阵亡时，会使附近的敌人定身6秒。",
        "icon": "./r/t/21-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Living Wood",
        "nameZh": "鲜活树木",
        "desc": "Gain Armor until 30% health.",
        "descZh": "获得护甲，直到生命值降至30%。",
        "icon": "./r/t/21-2.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "攻击间隔",
        "value": "2.2秒"
      },
      {
        "label": "抗性特性",
        "value": "受到的元素伤害减免50%"
      },
      {
        "label": "攻击范围",
        "value": "近战单体"
      }
    ],
    "talentNoteZh": "3 费带抗性且减伤出色的坦克，但通常优先在塞纳里奥体系配合塞纳留斯吃+20%血与治疗。首推【繁茂】受治疗量+30% 极大提升站场顶元素伤害能力；【活木】补护甲也很肉，【狂野生长】较偏门。",
    "officialQuote": "从阴暗沼泽深处爬出的泥沼巨兽，厚重的植物纤维与淤泥能够抵挡狂暴的元素轰击。",
    "skill": {
      "nameZh": "淤泥重击与元素抗性",
      "descZh": "仅需 3 费的高性价比重装坦克。天生具备“抗性”特性（受到的元素伤害降低 50%），以沉重的泥浆巨拳阻挡敌方突击前排。"
    }
  },
  {
    "slug": "cairne-bloodhoof",
    "shortId": 22,
    "name": "Cairne Bloodhoof",
    "nameZh": "凯恩·血蹄",
    "type": "Leader",
    "families": [
      "Horde"
    ],
    "cost": 5,
    "health": 1700,
    "damage": 176,
    "dps": 70.4,
    "speed": "",
    "traits": [
      "Tank",
      "Attack Stun",
      "Fast",
      "Melee",
      "AoE"
    ],
    "img": "./r/m/22.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "up",
      "pve": "B",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Reincarnation",
        "nameZh": "复生",
        "desc": "After death, Resurrect at 50% Health once.",
        "descZh": "阵亡后以50%生命值复活一次。",
        "icon": "./r/t/22-0.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Plainsrunning",
        "nameZh": "平原奔袭",
        "desc": "Move 50% faster and gain the Fast trait.",
        "descZh": "移动速度提高50%，并获得“快速”特性。",
        "icon": "./r/t/22-1.png",
        "pvpRec": "bronze",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Aftershock",
        "nameZh": "余震",
        "desc": "When Stun expires, affected enemies are Dazed for 5 seconds.",
        "descZh": "昏迷效果结束时，受影响的敌人还会被眩晕/减速（晕眩）5秒。",
        "icon": "./r/t/22-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Earthen Might",
      "nameZh": "大地之力",
      "descZh": "全局被动：使你队伍中所有部落阵营棋子的最大生命值永久提高 20%（无需登场即可生效）；自身阵亡后可复生一次。"
    },
    "statsExtra": [
      {
        "label": "攻击间隔",
        "value": "2.4秒"
      },
      {
        "label": "攻击范围",
        "value": "近战顺劈"
      },
      {
        "label": "复生血量",
        "value": "50%"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "首推【复生】：倒地半血原地复活等于两头牛头人，几乎所有对局都稳定赚费；次选【平原奔袭】加速抢 PvP 中立宝箱；【余震】仅作死后小幅缓速。",
    "officialQuote": "莫高雷的睿智大族长，大地的祝福赋予整个部族坚不可摧的生命厚度。",
    "skill": {
      "nameZh": "大地之力",
      "descZh": "全局被动：使你队伍中所有部落阵营棋子的最大生命值永久提高 20%（无需登场即可生效）；自身阵亡后可复生一次。"
    }
  },
  {
    "slug": "cenarius",
    "shortId": 23,
    "name": "Cenarius",
    "nameZh": "塞纳留斯",
    "type": "Leader",
    "families": [
      "Cenarion"
    ],
    "cost": 5,
    "health": 600,
    "damage": 120,
    "dps": 75,
    "speed": "Medium",
    "traits": [
      "Brambles",
      "Tranquility",
      "Elemental",
      "Resistant",
      "Healer",
      "Ranged",
      "One-Target"
    ],
    "img": "./r/m/23.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "up",
      "pve": "A",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Force of Nature",
        "nameZh": "自然之力",
        "desc": "Summon a Treant when a Rooted enemy dies.",
        "descZh": "被缠绕的敌人死亡时，召唤一名树人。",
        "icon": "./r/t/23-0.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Revitalize",
        "nameZh": "激活",
        "desc": "Allies entering Tranquility trigger an additional heal pulse.",
        "descZh": "进入宁静范围的友军会额外触发一次治疗脉冲。",
        "icon": "./r/t/23-1.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Wild Growth",
        "nameZh": "野性成长",
        "desc": "On deploy, Root all enemies for 5 seconds.",
        "descZh": "部署时缠绕所有附近敌人5秒。",
        "icon": "./r/t/23-2.png",
        "pvpRec": "silver",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Grove Keeper",
      "nameZh": "林地守护者",
      "descZh": "使塞纳里奥友方单位获得 +30% 额外最大生命值上限（进场可被持续治疗填满）；周期性治疗身边友军。"
    },
    "statsExtra": [
      {
        "label": "单次治疗",
        "value": "65"
      },
      {
        "label": "治疗间隔",
        "value": "1.5秒"
      },
      {
        "label": "血量增益",
        "value": "+30%生命上限"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "三大天赋均可用，全模式首推【自然之力】：被缠绕敌人阵亡就召树人继续抗伤打输出，雪球极强；次选【复苏】补强进圈瞬发奶量；【野性成长】PvP 延缓对面推线与抢箱专用。",
    "officialQuote": "月神艾露恩与白鹿玛洛恩之子，大自然的愈合之力将过量生命转化为坚实护盾。",
    "skill": {
      "nameZh": "林地守护者",
      "descZh": "使塞纳里奥友方单位获得 +30% 额外最大生命值上限（进场可被持续治疗填满）；周期性治疗身边友军。"
    }
  },
  {
    "slug": "chain-lightning",
    "shortId": 4,
    "name": "Chain Lightning",
    "nameZh": "闪电链",
    "type": "Spell",
    "families": [
      "Horde"
    ],
    "cost": 2,
    "health": 0,
    "damage": 150,
    "dps": 0,
    "speed": "",
    "traits": [
      "Cycle",
      "Elemental",
      "Spell",
      "AoE"
    ],
    "img": "./r/m/4.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "",
      "pve": "B",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Brilliant Flash",
        "nameZh": "明亮闪光",
        "desc": "On deploy, Stun enemies within for 1 second.",
        "descZh": "部署时会使范围内的敌人昏迷1秒。",
        "icon": "./r/t/4-0.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Reverberation",
        "nameZh": "回响",
        "desc": "Can be cast a second time.",
        "descZh": "可再次施放。",
        "icon": "./r/t/4-1.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Storm's Reach",
        "nameZh": "风暴之触",
        "desc": "Dramatically increase jump distance between targets.",
        "descZh": "显著提高目标之间的跳跃距离。",
        "icon": "./r/t/4-2.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "弹射目标",
        "value": "首目标+2次折射"
      },
      {
        "label": "伤害属性",
        "value": "元素瞬发"
      },
      {
        "label": "适用场景",
        "value": "秒杀杂兵小队"
      }
    ],
    "talentNoteZh": "三者各有体系，首推最稳泛用的【风暴之触】超远距离跨线电击兼防分散站位；【璀璨闪光】1 秒眩晕可重置仇恨护航女妖；【混响】适合 PvP 连清两波蝠群/鹰身人。",
    "officialQuote": "萨满的雷霆在敌群之间跳跃折射，脆皮杂兵在闪电轰击下瞬间灰飞烟灭。",
    "skill": {
      "nameZh": "连锁闪电",
      "descZh": "仅消耗 2 费。瞬间释放一道高压电弧轰击首个目标，并最多向周围 2 个最近的敌方棋子折射弹跳，造成范围元素伤害。"
    }
  },
  {
    "slug": "charlga-razorflank",
    "shortId": 24,
    "name": "Charlga Razorflank",
    "nameZh": "卡尔加·刺肋",
    "type": "Leader",
    "families": [
      "Beast"
    ],
    "cost": 2,
    "health": 416,
    "damage": 6,
    "dps": 24,
    "speed": "Medium",
    "traits": [
      "Cycle",
      "Percent Damage",
      "Attack Root",
      "Ranged",
      "One-Target"
    ],
    "img": "./r/m/24.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "up",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Cavernous Mists",
        "nameZh": "洞穴迷雾",
        "desc": "Deploy cost reduced by 1.",
        "descZh": "部署费用降低1点。",
        "icon": "./r/t/24-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Spirit Passage",
        "nameZh": "灵魂通道",
        "desc": "Minis played for 5 Gold gain a level and deploy in Stealth.",
        "descZh": "以5金币打出的棋子提升1级并潜行部署。",
        "icon": "./r/t/24-1.png",
        "pvpRec": "silver",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Nature's Grasp",
        "nameZh": "自然之握",
        "desc": "Root two additional nearby targets.",
        "descZh": "额外再缠绕两名附近的目标。",
        "icon": "./r/t/24-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Spirit Tangle",
      "nameZh": "精神纠缠",
      "descZh": "你手牌中的所有棋子全部共享同一个费用数值。每当你打出一张牌，费用池依照卡组队列动态轮转。"
    },
    "statsExtra": [
      {
        "label": "攻击间隔",
        "value": "1.8秒"
      },
      {
        "label": "射程",
        "value": "8.0码"
      },
      {
        "label": "缠绕时长",
        "value": "3秒定身"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "【幽暗迷雾】是核心：把查尔加自身降为 1 费并向全卡组注入 1 费过牌循环；次选【灵魂通道】仅在带了 5 费卡的特定隐身体系生效；【自然之握】身板过脆难以发挥。",
    "officialQuote": "剃刀沼泽的野猪人主母，掌控灵魂的诡异连接，扭曲所有手牌的黄金消耗。",
    "skill": {
      "nameZh": "精神纠缠",
      "descZh": "你手牌中的所有棋子全部共享同一个费用数值。每当你打出一张牌，费用池依照卡组队列动态轮转。"
    }
  },
  {
    "slug": "cheat-death",
    "shortId": 5,
    "name": "Cheat Death",
    "nameZh": "在劫难逃",
    "type": "Spell",
    "families": [
      "Undead"
    ],
    "cost": 3,
    "health": 0,
    "damage": 0,
    "dps": 0,
    "speed": "",
    "traits": [
      "Spell",
      "AoE"
    ],
    "img": "./r/m/5.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "",
      "pve": "A",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Vampirism",
        "nameZh": "吸血",
        "desc": "Affected minis are Healed when dealing damage.",
        "descZh": "受影响的棋子在造成伤害时会恢复生命值。",
        "icon": "./r/t/5-0.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Apocalypse",
        "nameZh": "死而复生",
        "desc": "Affected Skeletons Resurrect at your base when they die.",
        "descZh": "当受影响的骷髅死亡时会复活在你的基地周围。",
        "icon": "./r/t/5-1.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Seal Fate",
        "nameZh": "封印命运",
        "desc": "Affected minis gain Bloodlust, but die when the effect ends.",
        "descZh": "受影响的随从获得嗜血，但效果消失时会死亡。",
        "icon": "./r/t/5-2.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "持续时间",
        "value": "8.0秒"
      },
      {
        "label": "免死底限",
        "value": "锁定1血不倒"
      },
      {
        "label": "战术价值",
        "value": "强冲阵地塔与Boss"
      }
    ],
    "talentNoteZh": "通用最优选【吸血】：残血不死之余直接回血续战，甚至逆天改命；【天启】仅限阿努巴拉克骷髅海套路；【封印命运】配哥布林工兵或石像鬼嗜血强拆奇效但副作用大。",
    "officialQuote": "暗影与鲜血编织的秘术，在死亡之神降临的瞬间，强行锁住战士的最后一丝生机。",
    "skill": {
      "nameZh": "在劫难逃不灭结界",
      "descZh": "在指定区域展开持续 8 秒的不死法阵。法阵范围内的所有友方棋子生命值最低锁定为 1 点，期间完全免疫任何致命伤害。"
    }
  },
  {
    "slug": "chimaera",
    "shortId": 25,
    "name": "Chimaera",
    "nameZh": "奇美拉",
    "type": "Troop",
    "families": [
      "Beast"
    ],
    "cost": 5,
    "health": 460,
    "damage": 280,
    "dps": 115,
    "speed": "Med-Fast",
    "traits": [
      "Elemental",
      "Poisonous",
      "Flying",
      "AoE"
    ],
    "img": "./r/m/25.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "up",
      "pve": "S",
      "pveChange": "",
      "overall": "A",
      "overallChange": "up"
    },
    "talents": [
      {
        "name": "Leviathan",
        "nameZh": "巨兽之躯",
        "desc": "Gain 10% additional Health per deploy.",
        "descZh": "每次部署可获得 10% 的额外生命值。",
        "icon": "./r/t/25-0.png",
        "pvpRec": "bronze",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Frost Shock",
        "nameZh": "冰霜震击",
        "desc": "Lightning Ball applies Frost on hit.",
        "descZh": "闪电球命中时会施加冰霜效果。",
        "icon": "./r/t/25-1.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      },
      {
        "name": "Corrosive Breath",
        "nameZh": "腐蚀吐息",
        "desc": "Poison Spit inflicts twice as much Poison.",
        "descZh": "喷毒造成两倍的剧毒伤害。",
        "icon": "./r/t/25-2.png",
        "pvpRec": "bronze",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "左头闪电",
        "value": "对空对地双修"
      },
      {
        "label": "右头强酸",
        "value": "地面大范围毒伤"
      },
      {
        "label": "攻击射程",
        "value": "6.0码"
      }
    ],
    "tierDelta": {
      "pvp": "up",
      "overall": "up"
    },
    "talentNoteZh": "绝大多数对局必选【腐蚀吐息】：单次攻击叠 4 层剧毒疯狂融化高血坦克与 Boss；PvP 怕秒可次选【利维坦】加血量上限（最高 3 层）；【冰霜震击】费用过高不适合当辅助。",
    "officialQuote": "双翼遮天的双头奇美拉，左头雷霆万钧，右头腐蚀剧毒，是所有地面军团的天降灾厄。",
    "skill": {
      "nameZh": "闪电与强酸双重喷吐",
      "descZh": "强大的重型飞行巨兽。左头喷吐闪电打击空中与地面目标，右头喷吐腐蚀性强酸剧毒，在大面积地面区域留下持久腐蚀毒液。"
    }
  },
  {
    "slug": "core-hounds",
    "shortId": 26,
    "name": "Core Hounds",
    "nameZh": "熔火犬",
    "type": "Troop",
    "families": [
      "Blackrock"
    ],
    "cost": 6,
    "health": 1600,
    "damage": 220,
    "dps": 100,
    "speed": "Slow",
    "traits": [
      "Tank",
      "Resistant",
      "Revive",
      "Slow",
      "Melee",
      "Squad"
    ],
    "img": "./r/m/26.png",
    "tiers": {
      "pvp": "D",
      "pvpChange": "",
      "pve": "B",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Eternal Bond",
        "nameZh": "永恒契约",
        "desc": "Resurrection range is unlimited.",
        "descZh": "复生没有范围限制。",
        "icon": "./r/t/26-0.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Guard Dog",
        "nameZh": "看门恶犬",
        "desc": "Deal 50% additional damage near friendly towers and meeting stones.",
        "descZh": "在友方防御塔和集合石附近会额外造成50%的伤害。",
        "icon": "./r/t/26-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Fiery Revival",
        "nameZh": "烈焰重生",
        "desc": "Upon Revival, damage and burn nearby enemies.",
        "descZh": "复活时对附近敌人造成伤害并施加燃烧。",
        "icon": "./r/t/26-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "编制数量",
        "value": "2只恶犬"
      },
      {
        "label": "复生条件",
        "value": "只要任一只存活即无限复活"
      },
      {
        "label": "攻击间隔",
        "value": "1.7秒"
      }
    ],
    "talentNoteZh": "【永恒羁绊】几乎是唯一实战选法：踩在双线分界部署让双头犬分路推进且无限互相复活；【烈焰重生】极个别 PvE 可用，【看门狗】6 费原地罚站性价比极低。",
    "officialQuote": "熔火之心的双生恶犬，只要一具躯体中的地狱火尚未熄灭，另一只便会从灰烬中再度苏醒！",
    "skill": {
      "nameZh": "双生复生",
      "descZh": "部署 2 只具备高额生命值与抗性的熔火恶犬。只要其中一只存活，倒下的另一只熔火犬便会在数秒读条后原地满血复生！"
    }
  },
  {
    "slug": "dark-iron-miner",
    "shortId": 27,
    "name": "Dark Iron Miner",
    "nameZh": "黑铁矿工",
    "type": "Troop",
    "families": [
      "Blackrock"
    ],
    "cost": 2,
    "health": 540,
    "damage": 60,
    "dps": 42.9,
    "speed": "Medium",
    "traits": [
      "Unbound",
      "Miner",
      "Cycle",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/27.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Dwarven Ambition",
        "nameZh": "矮人雄心",
        "desc": "Gain Fury.",
        "descZh": "获得狂怒。",
        "icon": "./r/t/27-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Gold Mine",
        "nameZh": "黄金地雷",
        "desc": "After Mining, drop a proximity mine. Damages nearby enemies when touched.",
        "descZh": "采矿后留下一颗感应地雷，触发时伤害附近的敌人。",
        "icon": "./r/t/27-1.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": false
      },
      {
        "name": "Dark Iron Armaments",
        "nameZh": "黑铁武装",
        "desc": "After Mining, gain Armored.",
        "descZh": "采矿后，获得护甲。",
        "icon": "./r/t/27-2.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "采矿速度",
        "value": "极速抢矿"
      },
      {
        "label": "护甲特性",
        "value": "物理减伤50%"
      },
      {
        "label": "攻击间隔",
        "value": "1.5秒"
      }
    ],
    "talentNoteZh": "首推全模式通用【矮人野心】：狂暴同时大幅提升挖矿与普攻速度；【黄金地雷】在 PvP 埋矿点反制对面抢矿极强；【黑铁武装】几乎不选。",
    "officialQuote": "贪婪的黑铁矮人从不按常理行军，只要嗅到金矿的气息，他便会直接挖穿地底破土而出！",
    "skill": {
      "nameZh": "全图空投采矿",
      "descZh": "具备“空投”特性的采矿工程师。可直接部署在全地图任意金矿旁掠夺经济，自带重甲护身并挥舞矿镐击退接近的杂兵。"
    }
  },
  {
    "slug": "darkspear-troll",
    "shortId": 28,
    "name": "Darkspear Troll",
    "nameZh": "暗矛巨魔",
    "type": "Troop",
    "families": [
      "Horde"
    ],
    "cost": 3,
    "health": 220,
    "damage": 190,
    "dps": 158.3,
    "speed": "Medium",
    "traits": [
      "Ranged",
      "One-Target"
    ],
    "img": "./r/m/28.png",
    "tiers": {
      "pvp": "A",
      "pvpChange": "up",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Big Bad Voodoo",
        "nameZh": "大巫毒",
        "desc": "Regenerate 20% health every second.",
        "descZh": "每秒恢复20%生命值。",
        "icon": "./r/t/28-0.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Headhunting",
        "nameZh": "猎头者",
        "desc": "On kill, increase Attack and Movement speed by 10%. Stacks to 50%.",
        "descZh": "击杀敌人后攻击速度与移动速度提升10%，最多叠加至50%。",
        "icon": "./r/t/28-1.png",
        "pvpRec": "",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Serpent Sting",
        "nameZh": "毒蛇钉刺",
        "desc": "Gain Poison.",
        "descZh": "攻击获得“剧毒”特性。",
        "icon": "./r/t/28-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "射程",
        "value": "8.5码超远距"
      },
      {
        "label": "攻击间隔",
        "value": "1.8秒(叠加狂怒)"
      },
      {
        "label": "被动恢复",
        "value": "持续自愈回血"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "PvP（尤其中火箭塔/巨龙塔赛季）必选【巫毒大仙】：残血高额再生甚至单挑防御塔与主基地；PvE 纯后排安心输出可选【猎头】叠攻速；【毒蛇钉刺】整体最弱。",
    "officialQuote": "暗矛氏族的精英猎手，手中锐利的长矛不仅射程奇远，狂怒之下更是越战越勇。",
    "skill": {
      "nameZh": "快速投矛与再生",
      "descZh": "超远射程单体射手（射程 8.5 码）。拥有巨魔再生被动持续回复自身生命值，且持续攻击同一目标时长矛投掷攻速不断极速叠加。"
    }
  },
  {
    "slug": "deep-breath",
    "shortId": 6,
    "name": "Deep Breath",
    "nameZh": "深呼吸",
    "type": "Spell",
    "families": [
      "Blackrock"
    ],
    "cost": 4,
    "health": 0,
    "damage": 160,
    "dps": 30,
    "speed": "",
    "traits": [
      "Elemental",
      "Burn",
      "Spell",
      "AoE"
    ],
    "img": "./r/m/6.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "down",
      "pve": "A",
      "pveChange": "",
      "overall": "S",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Attunement",
        "nameZh": "调和",
        "desc": "Allies caught in the effect gain Resist.",
        "descZh": "受该效果影响的盟友会获得抗性。",
        "icon": "./r/t/6-0.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Melting Point",
        "nameZh": "熔点",
        "desc": "Damaging Armored enemies removes their Armor.",
        "descZh": "伤害有护甲的敌人时会移除其护甲。",
        "icon": "./r/t/6-1.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Double Dragon",
        "nameZh": "神龙摆尾",
        "desc": "Cast a second wave in the opposite direction.",
        "descZh": "向反方向施放第二道波。费用增加1。",
        "icon": "./r/t/6-2.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "喷吐范围",
        "value": "长矩形贯穿全图"
      },
      {
        "label": "伤害属性",
        "value": "巨额元素穿透"
      },
      {
        "label": "攻城倍率",
        "value": "对建筑减半"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "【双龙】涨至 5 费后，PvP 主流首选【熔点】融化前排护甲或次选【调和】套元素抗性；长射程即使面对战争古树也能蹭出价值。",
    "officialQuote": "黑龙军团的灭世威能划破苍穹，整片战壕都在黑龙吐息的滚滚烈焰中化为焦土。",
    "skill": {
      "nameZh": "巨龙深呼吸",
      "descZh": "召唤黑龙奥妮克希亚飞掠全场，沿途喷射贯穿整个战场的长矩形烈焰，对路径上的所有敌方单位与建筑造成毁灭性直线元素伤害。"
    }
  },
  {
    "slug": "defias-bandits",
    "shortId": 29,
    "name": "Defias Bandits",
    "nameZh": "迪菲亚劫掠者",
    "type": "Troop",
    "families": [
      "Alliance"
    ],
    "cost": 1,
    "health": 120,
    "damage": 30,
    "dps": 16.7,
    "speed": "Med-Fast",
    "traits": [
      "Cycle",
      "Stealth",
      "Cheap Shot",
      "Melee",
      "Squad"
    ],
    "img": "./r/m/29.png",
    "tiers": {
      "pvp": "A",
      "pvpChange": "",
      "pve": "S",
      "pveChange": "",
      "overall": "S",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Pick Lock",
        "nameZh": "翻箱倒柜",
        "desc": "Earn an extra +2 Gold when opening chests.",
        "descZh": "打开宝箱时额外获得2黄金。",
        "icon": "./r/t/29-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Deadly Poison",
        "nameZh": "致命药膏",
        "desc": "Gain Poison.",
        "descZh": "获得“剧毒”特性。",
        "icon": "./r/t/29-1.png",
        "pvpRec": "silver",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Last Resort",
        "nameZh": "最后一搏",
        "desc": "On death, Stun the target for 3 seconds.",
        "descZh": "死亡时会使目标昏迷3秒。",
        "icon": "./r/t/29-2.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "编制数量",
        "value": "2名刺客"
      },
      {
        "label": "破隐效果",
        "value": "双倍伤害+目标击晕"
      },
      {
        "label": "宝箱特技",
        "value": "+额外金币"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "【开锁】全模式必带第一顺位：1 费抢 PvP 宝箱直接净赚 +4 金瞬间拉开经济差；防守向体系也可考虑【致命剧毒】补输出，【孤注一掷】单体长控但优先级低于开锁。",
    "officialQuote": "盘踞在死亡矿井的迪菲亚恶徒，擅长从暗影中飞身暴起，敲晕哨兵并顺手洗劫金库。",
    "skill": {
      "nameZh": "伏击闷棍与顺手牵羊",
      "descZh": "仅需 1 费的 2 人潜行刺客组。从潜行状态破隐一击造成双倍伏击暴击并击晕敌人，开启战场宝箱时可额外掠夺额外金币收益。"
    }
  },
  {
    "slug": "dire-batlings",
    "shortId": 30,
    "name": "Dire Batlings",
    "nameZh": "可怕小蝙蝠",
    "type": "Troop",
    "families": [
      "Undead"
    ],
    "cost": 2,
    "health": 30,
    "damage": 48,
    "dps": 40,
    "speed": "Fast",
    "traits": [
      "Cycle",
      "Fast",
      "Detect",
      "Flying",
      "Squad"
    ],
    "img": "./r/m/30.png",
    "tiers": {
      "pvp": "A",
      "pvpChange": "",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Guano Happens",
        "nameZh": "屎事难料",
        "desc": "Periodically drop happy little accidents that Poison the first enemy to touch them.",
        "descZh": "定期投下小“惊喜”，使第一个接触的敌人中毒。",
        "icon": "./r/t/30-0.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Soundbite",
        "nameZh": "音波之噬",
        "desc": "Batling bites emite a sonic wave that damage a nearby enemy mini.",
        "descZh": "小蝙蝠在撕咬时会发出声波，伤害附近的敌方棋子。",
        "icon": "./r/t/30-1.png",
        "pvpRec": "silver",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Midnight's Call",
        "nameZh": "午夜召唤",
        "desc": "On kill, gain Stealth.",
        "descZh": "消灭时获得潜行。",
        "icon": "./r/t/30-2.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "编制数量",
        "value": "3只蝙蝠"
      },
      {
        "label": "攻击间隔",
        "value": "1.2秒"
      },
      {
        "label": "移速属性",
        "value": "飞行快速"
      }
    ],
    "talentNoteZh": "亡灵主将卡组优质 2 费补位。PvP/PvE 首推【午夜召唤】：击杀即全员隐身逼对方交范围解，或【声波攻击】暴增秒伤；【蝙蝠粪】PvP 持续蹭血垫刀与反矿工同样吃香。",
    "officialQuote": "栖息在幽暗洞穴的可怕小蝙蝠，一旦闻到鲜血便会成群结队从天而降发起凌厉空袭。",
    "skill": {
      "nameZh": "嗜血群袭",
      "descZh": "消耗 3 费召唤 3 只高速飞行的吸血小蝙蝠。针对空中和地面无防空能力的慢速重甲单位进行高速空中绞杀。"
    }
  },
  {
    "slug": "drake",
    "shortId": 32,
    "name": "Drake",
    "nameZh": "幼龙",
    "type": "Troop",
    "families": [
      "Blackrock"
    ],
    "cost": 4,
    "health": 340,
    "damage": 320,
    "dps": 133.3,
    "speed": "Medium",
    "traits": [
      "Elemental",
      "Flying",
      "AoE",
      "Burn"
    ],
    "img": "./r/m/32.png",
    "tiers": {
      "pvp": "D",
      "pvpChange": "",
      "pve": "B",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Mother Drake",
        "nameZh": "龙母",
        "desc": "Periodically summon a Whelp Egg.",
        "descZh": "周期性召唤1枚雏龙蛋。",
        "icon": "./r/t/32-0.png",
        "pvpRec": "",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Engulfing Flames",
        "nameZh": "噬体烈焰",
        "desc": "Damaging enemies Burns them.",
        "descZh": "伤害敌人，灼烧他们。",
        "icon": "./r/t/32-1.png",
        "pvpRec": "",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Roost",
        "nameZh": "栖地",
        "desc": "Perch on top of a nearby tower, staying there to defend it.",
        "descZh": "栖息在附近的防御塔上，并保护那个地方。",
        "icon": "./r/t/32-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "攻击射程",
        "value": "7.0码"
      },
      {
        "label": "攻击范围",
        "value": "正前方大扇形AOE"
      },
      {
        "label": "伤害属性",
        "value": "纯元素伤害"
      }
    ],
    "talentNoteZh": "首推【幼龙之母】：边飞边产雏龙蛋布雷封路，让地面近战完全无法单线推进；次选【烈焰吞噬】拼直伤，【栖息】守塔机制较冷门。",
    "officialQuote": "成年黑龙幼龙掠过天际，扇形的滚滚烈焰将地面密集方阵彻底淹没在一片焦黑之中。",
    "skill": {
      "nameZh": "扇形烈焰吐息",
      "descZh": "黑石核心飞行轰炸手。朝飞行正前方的扇形地面大范围喷射汹涌龙息，持续对成群结队的地面敌兵造成高额元素伤害。"
    }
  },
  {
    "slug": "druid-of-the-claw",
    "shortId": 34,
    "name": "Druid of the Claw",
    "nameZh": "利爪德鲁伊",
    "type": "Troop",
    "families": [
      "Cenarion"
    ],
    "cost": 3,
    "health": 2340,
    "damage": 332,
    "dps": 0,
    "speed": "",
    "traits": [
      "Elemental",
      "Shapeshift",
      "Ranged",
      "One-Target"
    ],
    "img": "./r/m/34.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "down",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Regrowth",
        "nameZh": "愈合之变",
        "desc": "When entering Bear form, heal 20% health over 5 seconds.",
        "descZh": "变为熊形态时，在5秒内恢复20%生命值。",
        "icon": "./r/t/34-0.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Rejuvenation",
        "nameZh": "回春术",
        "desc": "Night Elf form gains the ability to apply a heal over time to an ally.",
        "descZh": "暗夜精灵形态会获得持续治疗一位盟友的能力。",
        "icon": "./r/t/34-1.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Leader of the Pack",
        "nameZh": "兽群领袖",
        "desc": "Bear Form grants a 15% damage boost to nearby allies.",
        "descZh": "熊形态会为附近的盟友提供15%的伤害加成。",
        "icon": "./r/t/34-2.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "变身阈值",
        "value": "生命低于50%"
      },
      {
        "label": "巨熊特性",
        "value": "获得护甲+近战拍击"
      },
      {
        "label": "人形射程",
        "value": "7.0码"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "综合中上的变形卡。PvP 首推【愈合】变熊稳稳站场回血；PvE 长线推进更易保命，可依据卡组选【回春术】兼职治疗或【兽群领袖】加攻。",
    "officialQuote": "掌握自然造化的塞纳里奥德鲁伊，在法术惩戒敌人之后，化身狂暴巨熊撕碎一切近身者。",
    "skill": {
      "nameZh": "暗夜施法与巨熊形态",
      "descZh": "进场以暗夜精灵形态进行远程自然攻击；当生命值降至 50% 以下时立刻变身为狂暴巨熊，获得护甲减伤、嘲讽并转为近战重拳猛击。"
    }
  },
  {
    "slug": "dryad",
    "shortId": 35,
    "name": "Dryad",
    "nameZh": "树妖",
    "type": "Troop",
    "families": [
      "Cenarion"
    ],
    "cost": 4,
    "health": 370,
    "damage": 175,
    "dps": 109.4,
    "speed": "Fast",
    "traits": [
      "Fast",
      "Poisonous",
      "Attack Root",
      "Ranged",
      "One-Target"
    ],
    "img": "./r/m/35.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "down",
      "pve": "B",
      "pveChange": "",
      "overall": "B",
      "overallChange": "up"
    },
    "talents": [
      {
        "name": "Barrage",
        "nameZh": "飞矛集火",
        "desc": "Favor new targets when possible.",
        "descZh": "可以选择新的目标。",
        "icon": "./r/t/35-0.png",
        "pvpRec": "",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Nature's Swiftness",
        "nameZh": "自然迅捷",
        "desc": "Grant rapid movement speed to an Ally. Ability has one charge.",
        "descZh": "使一位盟友获得快速移动速度。技能可充能一次。",
        "icon": "./r/t/35-1.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Thorns",
        "nameZh": "荆棘丛生",
        "desc": "Deal damage back to Melee attackers. Damage increases on kill, up to 10 stacks.",
        "descZh": "对近战攻击者造成伤害。消灭时提高伤害，最高可叠加10次。",
        "icon": "./r/t/35-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "射程",
        "value": "8.5码"
      },
      {
        "label": "攻击间隔",
        "value": "1.8秒"
      },
      {
        "label": "附带特效",
        "value": "剧毒+减速+净化驱散"
      }
    ],
    "tierDelta": {
      "pvp": "down",
      "overall": "up"
    },
    "talentNoteZh": "核心强度在于【自然迅捷】：给狂暴巨魔或石像鬼加速直冲对面主基地；PvE 容易保住后排时可选【弹幕】群体施毒与定身；【荆棘】几乎无用。",
    "officialQuote": "林地的欢快守护者，矫捷的四蹄让她在战线上穿梭自如，浸毒的标枪让凶猛的敌人寸步难行。",
    "skill": {
      "nameZh": "驱散毒镖与快速游击",
      "descZh": "具有极快移动与超远射程的塞纳里奥游侠。投掷附带剧毒与减速效果的标枪，使被命中的敌人移速攻速大幅降低并驱散其身上的增益护盾。"
    }
  },
  {
    "slug": "earth-and-moon",
    "shortId": 7,
    "name": "Earth and Moon",
    "nameZh": "大地与月亮",
    "type": "Spell",
    "families": [
      "Cenarion"
    ],
    "cost": 5,
    "health": 0,
    "damage": 1095,
    "dps": 154,
    "speed": "",
    "traits": [
      "Elemental",
      "Poisonous",
      "Earth and Moon",
      "Spell",
      "AoE"
    ],
    "img": "./r/m/7.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "up",
      "pve": "D",
      "pveChange": "",
      "overall": "D",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Moonfury",
        "nameZh": "月怒",
        "desc": "Starfall lasts 25% longer.",
        "descZh": "星坠持续时间延长25%。",
        "icon": "./r/t/7-0.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Nature's Grace",
        "nameZh": "自然之赐",
        "desc": "Entangling Roots also grants all allies Resist for 6 seconds.",
        "descZh": "纠缠根须还会使所有盟友获得抗性，持续6秒。",
        "icon": "./r/t/7-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Balance",
        "nameZh": "平衡",
        "desc": "Can be cast a second time.",
        "descZh": "可再次施放。",
        "icon": "./r/t/7-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "形态轮换",
        "value": "缠绕/流星交替"
      },
      {
        "label": "缠绕半径",
        "value": "4.5码"
      },
      {
        "label": "流星时长",
        "value": "6秒持续打击"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "主要价值全在星辰坠落的爆发，因此全模式首推【月怒】扩大范围与伤害；【自然之赐】抗性窗口太短极难抓时机；【平衡】连放两轮费用过高。",
    "officialQuote": "塞纳里奥大地的根须与苍穹的月影交替呼应，依照德鲁伊的指引展现双重自然形态。",
    "skill": {
      "nameZh": "塞纳里奥形态轮转",
      "descZh": "塞纳里奥专属双态法术。每当你打出一名塞纳里奥棋子，法术在“纠缠根须”（范围定身缠绕并造成自然伤害）与“星辰坠落”（大范围流星轰炸）间交替切换。"
    }
  },
  {
    "slug": "earth-elemental",
    "shortId": 36,
    "name": "Earth Elemental",
    "nameZh": "土元素",
    "type": "Troop",
    "families": [
      "Blackrock"
    ],
    "cost": 3,
    "health": 1175,
    "damage": 70,
    "dps": 35,
    "speed": "Medium",
    "traits": [
      "Tank",
      "Armored",
      "Unbound",
      "Siege Damage",
      "Siege Specialist",
      "One-Target"
    ],
    "img": "./r/m/36.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "",
      "pve": "B",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Obsidian Shard",
        "nameZh": "黑曜石碎片",
        "desc": "On death, split into two smaller Earth Elementals.",
        "descZh": "阵亡时会分裂成2个较小的土元素。",
        "icon": "./r/t/36-0.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Ready to Rumble",
        "nameZh": "放马过来",
        "desc": "Taunt on deploy.",
        "descZh": "部署时会嘲讽。",
        "icon": "./r/t/36-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Shrapnel Blast",
        "nameZh": "破片爆裂",
        "desc": "Destroying a tower deals damage to nearby enemies.",
        "descZh": "摧毁防御塔时对附近敌人造成爆发伤害。",
        "icon": "./r/t/36-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "部署方式",
        "value": "全图空投"
      },
      {
        "label": "护甲减伤",
        "value": "物理免伤50%"
      },
      {
        "label": "攻城特技",
        "value": "对防御塔双倍拆迁"
      }
    ],
    "talentNoteZh": "首推【黑曜石碎片】：死亡再分裂 2 个小土元素持续抗塔兼补伤，几乎所有场合稳赚；另外两个天赋分别功能重复或收益太窄。",
    "officialQuote": "从大地深处响应召唤的坚固岩石，无视敌人的杂乱攻击，一门心思只有砸碎敌方箭塔！",
    "skill": {
      "nameZh": "空投石甲与攻城重拳",
      "descZh": "具备“空投”特性的重装攻城坦克。可直接空投降落在敌方防御塔前吸收炮火伤害，单体对建筑与基地造成双倍攻城破坏。"
    }
  },
  {
    "slug": "eclipse",
    "shortId": 8,
    "name": "Eclipse",
    "nameZh": "日月之蚀",
    "type": "Spell",
    "families": [
      "Cenarion"
    ],
    "cost": 3,
    "health": 0,
    "damage": 580,
    "dps": 36,
    "speed": "",
    "traits": [
      "Elemental",
      "Eclipse",
      "Spell",
      "AoE",
      "Burn"
    ],
    "img": "./r/m/8.png",
    "tiers": {
      "pvp": "S",
      "pvpChange": "up",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Solar Flare",
        "nameZh": "耀斑",
        "desc": "Sunfire also Burns enemies.",
        "descZh": "阳炎术同时点燃敌人（燃烧）。",
        "icon": "./r/t/8-0.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Umbral Force",
        "nameZh": "幽影之力",
        "desc": "Moonfire also Stuns enemies for 1 second.",
        "descZh": "月火术同时击晕敌人1秒。",
        "icon": "./r/t/8-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Celestial Focus",
        "nameZh": "星界专注",
        "desc": "Spells gain 2 levels if played immediately after Sunfire or Moonfire.",
        "descZh": "紧接在阳炎术或月火术之后打出的法术提升2级。",
        "icon": "./r/t/8-2.png",
        "pvpRec": "silver",
        "pveRec": "gold",
        "codeIndex": 2,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "循环费用",
        "value": "2费"
      },
      {
        "label": "阳炎伤害",
        "value": "240元素瞬发"
      },
      {
        "label": "月火跳伤",
        "value": "2.5秒灼烧"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "最搭吉安娜触发法伤阈值。全模式强力推荐【太阳耀斑】：日火灼烧总伤提升约 60%（400→640）可秒女猎手与雷德骑乘；【天体聚焦】在团本/PvE 配“吉安娜→日蚀→斩杀”爆发毁灭级；【月影之力】较弱。",
    "officialQuote": "日之炙热与月之清冷相互轮转，每一次自然的交替都在敌方阵线上刻下伤痕。",
    "skill": {
      "nameZh": "日月轮换",
      "descZh": "塞纳里奥专属循环法术（仅需 2 费）。每打出一张塞纳里奥棋子，法术在“阳炎术”（小范围单体/穿透高伤）与“月火术”（直接轰击加持续灼烧）之间轮转。"
    }
  },
  {
    "slug": "emperor-thaurissan",
    "shortId": 37,
    "name": "Emperor Thaurissan",
    "nameZh": "索瑞森大帝",
    "type": "Leader",
    "families": [
      "Blackrock"
    ],
    "cost": 4,
    "health": 1330,
    "damage": 85,
    "dps": 33,
    "speed": "Medium",
    "traits": [
      "Elemental",
      "Fiery Weapon Enchant",
      "Burn",
      "Ranged",
      "AoE"
    ],
    "img": "./r/m/37.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "down",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Hubris",
        "nameZh": "傲慢",
        "desc": "After playing Thaurissan, your next non-Elemental Mini deploys with +2 levels.",
        "descZh": "打出索瑞森大帝后，下一名非元素棋子部署时+2级。",
        "icon": "./r/t/37-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Incinerate",
        "nameZh": "焚烧",
        "desc": "Lava Spike's Burn is permanent and Emperor Thaurissan prefers new targets when attacking.",
        "descZh": "熔岩尖刺的燃烧变为永久效果，且大帝优先攻击新目标。",
        "icon": "./r/t/37-1.png",
        "pvpRec": "",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Moira's Wit",
        "nameZh": "茉艾拉的机敏",
        "desc": "Nearby Burning enemies (in a 12 radius) heal Thaurissan for 1.5% of his maximum Health per second.",
        "descZh": "12码范围内每有燃烧的敌人，每秒为大帝恢复1.5%最大生命值。",
        "icon": "",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Fiery Weapon Enchant",
      "nameZh": "炽焰武器",
      "descZh": "在场时，所有友方单位的非元素攻击命中敌人时，都会附带施加“燃烧”效果，造成持续元素伤害。"
    },
    "statsExtra": [
      {
        "label": "范围伤害",
        "value": "140"
      },
      {
        "label": "攻击间隔",
        "value": "2.5秒"
      },
      {
        "label": "燃烧跳伤",
        "value": "8秒持续元素"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "全模式首推【傲慢】：每 8 秒将高价值关键兵种（如麦田傀儡、女猎手、石像鬼、徘徊者）升 2 级；PvE 持续作战可选【焚烧】（对 Boss 燃烧持续约 16 秒）；【茉艾拉的机智】极难稳定触发。",
    "officialQuote": "黑铁矮人的统治者，熔岩之王将火焰灌注于每一位战士的武器之上。",
    "skill": {
      "nameZh": "炽焰武器",
      "descZh": "在场时，所有友方单位的非元素攻击命中敌人时，都会附带施加“燃烧”效果，造成持续元素伤害。"
    }
  },
  {
    "slug": "execute",
    "shortId": 9,
    "name": "Execute",
    "nameZh": "处决",
    "type": "Spell",
    "families": [
      "Horde"
    ],
    "cost": 3,
    "health": 0,
    "damage": 0,
    "dps": 0,
    "speed": "",
    "traits": [
      "Spell",
      "AoE"
    ],
    "img": "./r/m/9.png",
    "tiers": {
      "pvp": "S",
      "pvpChange": "",
      "pve": "S",
      "pveChange": "",
      "overall": "S",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Bloodthirsty",
        "nameZh": "狂热渴望",
        "desc": "Bloodlust allies within spell area for 10 seconds.",
        "descZh": "法术范围内的盟友获得嗜血，持续10秒。",
        "icon": "./r/t/9-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Overpower",
        "nameZh": "压制",
        "desc": "Knock enemies away from the cast location.",
        "descZh": "从施放位置处将敌人击退。",
        "icon": "./r/t/9-1.png",
        "pvpRec": "gold",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Killing Spree",
        "nameZh": "再接再厉",
        "desc": "If an enemy is killed, the next Horde mini costs 1 less.",
        "descZh": "如果一个敌人被消灭，下一个部落棋子的费用减少1。",
        "icon": "./r/t/9-2.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "削血比例",
        "value": "目标当前生命50%"
      },
      {
        "label": "对首领机制",
        "value": "固定削血攻城伤"
      },
      {
        "label": "作用范围",
        "value": "圆形区域"
      }
    ],
    "talentNoteZh": "全模式首推【嗜血】：斩杀残局的同时让推进主力全员嗜血爆拆 Boss 与防御塔；PvE 刷法术可选【杀戮盛宴】减费；PvP 抢箱可玩【压制】把敌兵击飞瞬间空降抢箱。",
    "officialQuote": "毫不留情的致命处决，无视敌人的重重护甲，按照其残存生机直取要害！",
    "skill": {
      "nameZh": "百分比处决",
      "descZh": "消耗 3 费打击目标区域。直接扣除范围内所有普通敌方棋子 50% 的当前生命值；对防御塔、首领与基地造成固定破甲伤害。"
    }
  },
  {
    "slug": "faerie-dragon",
    "shortId": 38,
    "name": "Faerie Dragon",
    "nameZh": "精灵龙",
    "type": "Troop",
    "families": [
      "Cenarion"
    ],
    "cost": 3,
    "health": 180,
    "damage": 200,
    "dps": 133.3,
    "speed": "Medium",
    "traits": [
      "Detect",
      "Elemental",
      "Nullify",
      "Resistant",
      "Flying",
      "One-Target"
    ],
    "img": "./r/m/38.png",
    "tiers": {
      "pvp": "A",
      "pvpChange": "up",
      "pve": "B",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Fae Blessing",
        "nameZh": "灵龙祝福",
        "desc": "Grant Resist to a nearby Ally. Ability has one charge.",
        "descZh": "每次部署时，使附近的一个盟友获得抗性。",
        "icon": "./r/t/38-0.png",
        "pvpRec": "silver",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Invisibility",
        "nameZh": "隐形术",
        "desc": "Gain Stealth.",
        "descZh": "获得潜行。",
        "icon": "./r/t/38-1.png",
        "pvpRec": "bronze",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Phase Shift",
        "nameZh": "相位变换",
        "desc": "Teleport backwards when attacked.",
        "descZh": "受到攻击时会向后传送。",
        "icon": "./r/t/38-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "射程",
        "value": "6.0码"
      },
      {
        "label": "自保特技",
        "value": "相位变换规避致命伤害"
      },
      {
        "label": "团队辅助",
        "value": "提供抗性法术护盾"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "上场主要理由就是【精灵祝福】：开局永久给一名主力套元素抗性，极大提升核心前排生存（配合抗拒/护甲体系极强）；【隐形】与【相位转移】均以牺牲团队辅助价值为代价。",
    "officialQuote": "游荡在翡翠梦境边缘的淘气仙女龙，能在千钧一发之际隐入虚空规避致命一击。",
    "skill": {
      "nameZh": "魔法闪烁与相位变换",
      "descZh": "灵巧的飞行元素精魂。攻击为范围溅射穿透，受到致命攻击时可短暂进入相位隐形规避伤害，并可为周围友军施加法术抗性护盾。"
    }
  },
  {
    "slug": "fire-elemental",
    "shortId": 39,
    "name": "Fire Elemental",
    "nameZh": "火元素",
    "type": "Troop",
    "families": [
      "Blackrock"
    ],
    "cost": 4,
    "health": 1640,
    "damage": 120,
    "dps": 66.7,
    "speed": "Medium",
    "traits": [
      "Tank",
      "Elemental",
      "Resistant",
      "Melee",
      "AoE"
    ],
    "img": "./r/m/39.png",
    "tiers": {
      "pvp": "A",
      "pvpChange": "up",
      "pve": "A",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Immolation Aura",
        "nameZh": "献祭光环",
        "desc": "Periodically damage nearby enemies.",
        "descZh": "周期性伤害附近的敌人。",
        "icon": "./r/t/39-0.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Molten Core",
        "nameZh": "熔岩之核",
        "desc": "On death, summon a pool of lava, damaging enemies within.",
        "descZh": "死亡时召唤一池岩浆，伤害其中的敌人。",
        "icon": "./r/t/39-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Fan The Flames",
        "nameZh": "煽风点火",
        "desc": "Taking Elemental damage increases damage dealt by 10%. Stacks to 30%.",
        "descZh": "受到元素伤害时，会使输出伤害提高10%。最多30%。",
        "icon": "./r/t/39-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "献祭范围",
        "value": "身边近战范围"
      },
      {
        "label": "抗性特性",
        "value": "元素免伤50%"
      },
      {
        "label": "攻击间隔",
        "value": "1.8秒"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "全模式最稳【献祭光环】：持续灼烧周边完美克制小兵群；【扇风点火】仅适合特定全元素伤害 PvE 首领战；【熔火之心】熔岩池存在虽久但数值偏弱。",
    "officialQuote": "纯粹的烈火聚合体，燃烧的狂暴高温让任何胆敢靠近肉搏的敌人都在痛苦中化为灰烬。",
    "skill": {
      "nameZh": "献祭烈焰光环",
      "descZh": "极高生命值的熔火护甲坦克。身体周围时刻散发着高温献祭光环，任何接近其身旁的近战敌军都会持续受到灼烧元素伤害。"
    }
  },
  {
    "slug": "firehammer",
    "shortId": 40,
    "name": "Firehammer",
    "nameZh": "火焰之锤",
    "type": "Troop",
    "families": [
      "Blackrock"
    ],
    "cost": 4,
    "health": 350,
    "damage": 140,
    "dps": 100,
    "speed": "Medium",
    "traits": [
      "Elemental",
      "Fury",
      "Ranged",
      "One-Target"
    ],
    "img": "./r/m/40.png",
    "tiers": {
      "pvp": "D",
      "pvpChange": "",
      "pve": "C",
      "pveChange": "",
      "overall": "D",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Moultin' Metal",
        "nameZh": "折翼金属",
        "desc": "Deal 50% more damage to Flying enemies.",
        "descZh": "对飞行敌人额外造成50%的伤害。",
        "icon": "./r/t/40-0.png",
        "pvpRec": "",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Blazing Speed",
        "nameZh": "炽热疾速",
        "desc": "Fury builds up to 40% higher.",
        "descZh": "狂怒的积累速度提高40%。",
        "icon": "./r/t/40-1.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Heightened Rage",
        "nameZh": "火上浇油",
        "desc": "Level up upon reaching full Fury.",
        "descZh": "狂怒全满时会升级。",
        "icon": "./r/t/40-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "射程",
        "value": "7.5码"
      },
      {
        "label": "充能机制",
        "value": "连击时攻速无限暴涨"
      },
      {
        "label": "抗性特性",
        "value": "黑铁抗性加持"
      }
    ],
    "talentNoteZh": "4 费偏脆极少进 PvP，定位为 PvE 狂暴炮台。想打长线爆发选【炽烈速度】拉高攻速叠层；若专门对付飞行 Boss（如基什/布鲁米兰）必选【熔铁】打重创；【怒火升级】门槛太高。",
    "officialQuote": "黑铁矮人的狂热工匠，他的锻炉战锤在持续轰鸣中会越打越烫，直至喷射出金属熔流！",
    "skill": {
      "nameZh": "充能火锤轰击",
      "descZh": "远程黑铁矮人火枪射手。对同一目标持续轰击时，战锤枪管过热充能，攻击速度以惊人幅度不断叠加递增直至彻底轰碎目标。"
    }
  },
  {
    "slug": "flamewaker",
    "shortId": 41,
    "name": "Flamewaker",
    "nameZh": "火妖",
    "type": "Troop",
    "families": [
      "Blackrock"
    ],
    "cost": 4,
    "health": 460,
    "damage": 220,
    "dps": 122.2,
    "speed": "Medium",
    "traits": [
      "Elemental",
      "Bombard",
      "Ranged",
      "AoE",
      "Burn"
    ],
    "img": "./r/m/41.png",
    "tiers": {
      "pvp": "D",
      "pvpChange": "",
      "pve": "B",
      "pveChange": "",
      "overall": "D",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Backdraft",
        "nameZh": "回火",
        "desc": "Successive attacks increase flame wave distance. Resets on movement.",
        "descZh": "连续的攻击会增加烈焰波的距离。移动时重置。",
        "icon": "./r/t/41-0.png",
        "pvpRec": "",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Engulf",
        "nameZh": "火噬",
        "desc": "Damaging enemies Burns thems.",
        "descZh": "造成伤害时点燃敌人。",
        "icon": "./r/t/41-1.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Heat Stroke",
        "nameZh": "热力打击",
        "desc": "Damaging enemies Dazes them.",
        "descZh": "伤害敌人会使其眩晕。",
        "icon": "./r/t/41-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "攻击射程",
        "value": "7.0码"
      },
      {
        "label": "范围形状",
        "value": "前进长条形熔岩波"
      },
      {
        "label": "伤害属性",
        "value": "纯元素AOE"
      }
    ],
    "talentNoteZh": "首推【逆火】：攻击击杀或收割就能滚出远距离增伤收掉后排，撑得起 4 费身价；【吞噬】与【中暑】需要多次站桩出手，在身板脆的前提下极难叠出上限。",
    "officialQuote": "来自熔火之心的蛇人施法者，翻滚的烈焰之潮将把面前的一切步兵阵型彻底冲垮！",
    "skill": {
      "nameZh": "熔岩波浪冲击",
      "descZh": "远程蛇形法师。向前释放穿透性的大范围地面熔岩波，不仅对范围内所有步兵造成连续火系暴击，还能强行打散密集的敌人阵型。"
    }
  },
  {
    "slug": "footmen",
    "shortId": 42,
    "name": "Footmen",
    "nameZh": "步兵",
    "type": "Troop",
    "families": [
      "Alliance"
    ],
    "cost": 5,
    "health": 800,
    "damage": 70,
    "dps": 43.8,
    "speed": "Slow",
    "traits": [
      "Tank",
      "Armored",
      "Slow",
      "Melee",
      "Squad"
    ],
    "img": "./r/m/42.png",
    "tiers": {
      "pvp": "D",
      "pvpChange": "down",
      "pve": "B",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Fortification",
        "nameZh": "强固",
        "desc": "Gain 30% extra emtpy Health.",
        "descZh": "获得30%额外的空余生命值。",
        "icon": "./r/t/42-0.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Shield Bash",
        "nameZh": "盾击",
        "desc": "Periodically Stun the target for 1 second.",
        "descZh": "周期性击晕目标，持续1秒。",
        "icon": "./r/t/42-1.png",
        "pvpRec": "silver",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Last Stand",
        "nameZh": "破釜沉舟",
        "desc": "Armor increases to 75% damage reduction when no other Footmen are nearby.",
        "descZh": "附近没有其他步兵时，护甲的伤害减免提高至75%。",
        "icon": "./r/t/42-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "编制数量",
        "value": "4名步兵"
      },
      {
        "label": "单兵生命",
        "value": "800点"
      },
      {
        "label": "攻击间隔",
        "value": "1.6秒"
      },
      {
        "label": "护甲减免",
        "value": "物理免伤50%"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "4 费盾兵常与提里奥、萨满等奶妈成群推进。首推【坚固】撑满坦度；配合玛法里奥或控制体系可选【盾击】眩晕；【背水一战】收益最低。",
    "officialQuote": "“为了洛丹伦！”手持坚固盾牌的联盟士兵筑起龟壳盾墙，是战线上最可靠的中流砥柱。",
    "skill": {
      "nameZh": "盾墙龟壳战术",
      "descZh": "4 名一组的联盟重甲盾卫（单兵生命 800，单兵伤害 70）。近战护甲减免 50% 物理伤害，以严整阵型阻挡冲锋，吸收极高物理爆发。"
    }
  },
  {
    "slug": "frostwolf-shaman",
    "shortId": 75,
    "name": "Frostwolf Shaman",
    "nameZh": "霜狼萨满祭司",
    "type": "Troop",
    "families": [
      "Horde"
    ],
    "cost": 4,
    "health": 480,
    "damage": 60,
    "dps": 40,
    "speed": "Medium",
    "traits": [
      "Elemental",
      "Healer",
      "Ranged",
      "One-Target"
    ],
    "img": "./r/m/75.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "down",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Earth Shield",
        "nameZh": "大地之盾",
        "desc": "Grant Armored to a nearby ally. Ability has 1 charge.",
        "descZh": "使附近的一个盟友获得护甲。可使用1次。",
        "icon": "./r/t/75-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Lightning Mastery",
        "nameZh": "闪电掌握",
        "desc": "Ranged attack chains to 3 nearby targets.",
        "descZh": "远程攻击会额外命中3个附近的目标。",
        "icon": "./r/t/75-1.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Earthwall Totem",
        "nameZh": "地墙图腾",
        "desc": "Once per deploy, place a totem that partially heals a nearby tower or base.",
        "descZh": "每次部署时，放置一个可以部分治疗附近防御塔或基地的图腾。",
        "icon": "./r/t/75-2.png",
        "pvpRec": "",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "大地之盾",
        "value": "赋予前排护甲免伤"
      },
      {
        "label": "攻击射程",
        "value": "7.5码"
      },
      {
        "label": "攻击间隔",
        "value": "2.0秒"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "全模式第一顺位必选【大地之盾】：给达基萨斯、火元素等自带抗性的高血核心套永久护甲，造出双抗怪物；【大地之墙图腾】在 PvP 不能奶主基地仅 PvE 部分地图有用；【闪电掌握】极少用。",
    "officialQuote": "崇敬祖先的霜狼氏族祭司，大地的坚盾与天空的奔雷由她一手掌控。",
    "skill": {
      "nameZh": "大地之盾与闪电链",
      "descZh": "远程多面手辅助。为前方前排坦克施加提供护甲减伤的坚固土盾，同时远程释放闪电链击退对空和地面来袭的杂兵。"
    }
  },
  {
    "slug": "gargoyle",
    "shortId": 43,
    "name": "Gargoyle",
    "nameZh": "石像兽",
    "type": "Troop",
    "families": [
      "Undead"
    ],
    "cost": 4,
    "health": 1300,
    "damage": 250,
    "dps": 147,
    "speed": "Slow",
    "traits": [
      "Tank",
      "Armored",
      "Siege Damage",
      "Slow",
      "Flying",
      "One-Target"
    ],
    "img": "./r/m/43.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Wing Buffet",
        "nameZh": "飞翼打击",
        "desc": "Increases move speed by 33%.",
        "descZh": "移动速度提高33%。",
        "icon": "./r/t/43-0.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Aerial Superiority",
        "nameZh": "空中优势",
        "desc": "Incoming damage from Flying minis is reduced by 50%.",
        "descZh": "受到来自空中棋子的伤害降低50%。",
        "icon": "./r/t/43-1.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": false
      },
      {
        "name": "Obsidian Statue",
        "nameZh": "黑曜石雕像",
        "desc": "On death, summon a statue with Taunt. Lasts until destroyed.",
        "descZh": "阵亡时召唤1个具有嘲讽的雕像，可持续到被摧毁为止。",
        "icon": "./r/t/43-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "目标筛选",
        "value": "专职攻城(只打塔和Boss)"
      },
      {
        "label": "护甲特性",
        "value": "空中物理免伤50%"
      },
      {
        "label": "攻击间隔",
        "value": "2.5秒"
      }
    ],
    "talentNoteZh": "石像鬼唯一目标就是最快敲到塔。PvP/通用首推【振翅】加速冲塔；若搭配树妖【自然迅捷】或内战防鹰身人/狮鹫时必须改用【制空优势】减伤（振翅与树妖加速不叠加）；【黑曜石雕像】太边缘。",
    "officialQuote": "盘踞在城垛之上的黑色石像鬼，展翅飞翔时唯有一个执念——将敌方的箭塔砸成废墟！",
    "skill": {
      "nameZh": "飞行石化与攻城穿刺",
      "descZh": "只攻击建筑与首领的高护甲飞行重坦。极具威胁的偷塔核心，无视途中杂兵直扑敌方防御塔和主基地，对建筑造成成吨双倍拆迁伤害。"
    }
  },
  {
    "slug": "general-drakkisath",
    "shortId": 33,
    "name": "General Drakkisath",
    "nameZh": "达基萨斯将军",
    "type": "Leader",
    "families": [
      "Blackrock"
    ],
    "cost": 5,
    "health": 1600,
    "damage": 300,
    "dps": 166.7,
    "speed": "Slow",
    "traits": [
      "Tank",
      "Elemental",
      "Resistant",
      "Slow",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/33.png",
    "tiers": {
      "pvp": "D",
      "pvpChange": "",
      "pve": "S",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Chromatic Scales",
        "nameZh": "多彩龙鳞",
        "desc": "Grants nearby allies the Resistant trait.",
        "descZh": "赋予附近所有友军“抗性”特性。",
        "icon": "./r/t/33-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Piercing Blows",
        "nameZh": "穿刺重击",
        "desc": "Attacks pierce through enemies in a line.",
        "descZh": "攻击可穿透一条直线上的多个敌人。",
        "icon": "./r/t/33-1.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Lasting Legacy",
        "nameZh": "永恒传承",
        "desc": "On death, drop a banner. Nearby enemies take 50% additional Elemental damage. Lasts 10 seconds.",
        "descZh": "死亡时插下战旗，使附近敌人受到的元素伤害提高50%，持续10秒。",
        "icon": "./r/t/33-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Banner of Flame",
      "nameZh": "烈焰战旗",
      "descZh": "在场时，周围半径 9 码内的所有敌方单位与敌方建筑承受的元素伤害额外提高 50%。"
    },
    "statsExtra": [
      {
        "label": "范围伤害",
        "value": "230"
      },
      {
        "label": "攻击间隔",
        "value": "2.6秒"
      },
      {
        "label": "易伤光环",
        "value": "+50%元素增伤"
      }
    ],
    "talentNoteZh": "黑龙将军本身已极肉且自带抗性，【彩鳞】把全元素抗性光环分享给整个推进大队，完美防深呼吸与 Boss 元素 AOE，务必首发；次选【穿刺打击】补清杂，【永恒传承】收益差。",
    "officialQuote": "黑石塔的黑龙重装统帅，高举炽热战旗让敌人的每一寸铠甲都在烈焰中消融。",
    "skill": {
      "nameZh": "烈焰战旗",
      "descZh": "在场时，周围半径 9 码内的所有敌方单位与敌方建筑承受的元素伤害额外提高 50%。"
    }
  },
  {
    "slug": "ghoul",
    "shortId": 44,
    "name": "Ghoul",
    "nameZh": "贪食者",
    "type": "Troop",
    "families": [
      "Undead"
    ],
    "cost": 2,
    "health": 1040,
    "damage": 110,
    "dps": 64.7,
    "speed": "Medium",
    "traits": [
      "Tank",
      "Cycle",
      "Cannibalize",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/44.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "down",
      "pve": "A",
      "pveChange": "",
      "overall": "S",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Bone Shield",
        "nameZh": "白骨之盾",
        "desc": "Cannibalizing grants Armored for 10 seconds.",
        "descZh": "食尸会获得护甲，持续10秒。",
        "icon": "./r/t/44-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Taste for Blood",
        "nameZh": "扩大优势",
        "desc": "Deal 50% additional damage to enemies who are below 50% health.",
        "descZh": "对生命值低于50%的敌人额外造成50%的伤害。",
        "icon": "./r/t/44-1.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Ravenous",
        "nameZh": "狼吞虎咽",
        "desc": "Cannibalizing grants Bloodlust for 10 seconds.",
        "descZh": "食尸会获得嗜血，持续10秒。",
        "icon": "./r/t/44-2.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "费用属性",
        "value": "2费极速循环"
      },
      {
        "label": "食尸回血",
        "value": "阵亡单位附近回血"
      },
      {
        "label": "护甲特性",
        "value": "物理免伤50%"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "本质 2 费功能肉盾，首推【白骨之盾】增加开局接敌与吃尸回血时的坦度上限；【嗜血】与【贪婪】虽加攻速但食尸鬼并非输出定位。",
    "officialQuote": "天灾军团不知疲倦的食腐爪牙，只要战场上不断有死者倒下，他的饕餮盛宴就永不终结。",
    "skill": {
      "nameZh": "贪食骨肉",
      "descZh": "仅需 2 费的重装轻甲亡灵。自带高额护甲，近身撕咬输出，每当周围战场有棋子阵亡时立刻吞噬尸骸残渣自愈回血，残局续航极强。"
    }
  },
  {
    "slug": "gnoll-brute",
    "shortId": 45,
    "name": "Gnoll Brute",
    "nameZh": "豺狼人蛮兵",
    "type": "Troop",
    "families": [
      "Beast"
    ],
    "cost": 3,
    "health": 1240,
    "damage": 130,
    "dps": 65,
    "speed": "Medium",
    "traits": [
      "Tank",
      "Melee",
      "AoE"
    ],
    "img": "./r/m/45.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "",
      "pve": "B",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Rabid",
        "nameZh": "疯乱",
        "desc": "Reduce deploy cost by 1 and gain the Cycle trait.",
        "descZh": "部署费用减少1黄金，并获得刷新专长。",
        "icon": "./r/t/45-0.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Thick Hide",
        "nameZh": "皮糙肉厚",
        "desc": "Gain Armor.",
        "descZh": "获得护甲。",
        "icon": "./r/t/45-1.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Pillage",
        "nameZh": "掠夺",
        "desc": "Deal Siege damage.",
        "descZh": "获得“攻城伤害”特性。",
        "icon": "./r/t/45-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "范围形状",
        "value": "前方大角度顺劈"
      },
      {
        "label": "护甲特性",
        "value": "物理免伤50%"
      },
      {
        "label": "攻击间隔",
        "value": "1.8秒"
      }
    ],
    "talentNoteZh": "基础慢速且偏冷门，唯一常见高光是在拉格纳罗斯体系选【厚皮】获得护甲以触发主将反伤加成；其余卡组如凑费用可选【狂躁】减费为 2 费，【掠夺】几乎不用。",
    "officialQuote": "粗野暴躁的豺狼人头目，挥舞沉重的长钉狼牙棒，一记横扫就能让面前的杂兵横飞倒地。",
    "skill": {
      "nameZh": "顺劈横扫与坚硬毛皮",
      "descZh": "3 费近战范围输出前排。挥舞粗重骨棒对正前方扇形区域的所有敌人造成连续顺劈物理打击，附带厚实护甲减伤。"
    }
  },
  {
    "slug": "goblin-sapper",
    "shortId": 47,
    "name": "Goblin Sapper",
    "nameZh": "地精工兵",
    "type": "Troop",
    "families": [
      "Horde"
    ],
    "cost": 2,
    "health": 120,
    "damage": 450,
    "dps": 0,
    "speed": "Med-Fast",
    "traits": [
      "Cycle",
      "Siege Damage",
      "Siege Specialist",
      "Squad",
      "Burn"
    ],
    "img": "./r/m/47.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "",
      "pve": "B",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Rocket Powered Turbo Boots",
        "nameZh": "火箭涡轮靴",
        "desc": "Move twice as fast and gain the Fast trait.",
        "descZh": "移动速度翻倍并获得“快速”特性。",
        "icon": "./r/t/47-0.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Extra BOOM",
        "nameZh": "多多益善",
        "desc": "Deploy an additional +1 Goblin Sapper.",
        "descZh": "额外部署一个地精工兵。",
        "icon": "./r/t/47-1.png",
        "pvpRec": "",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Crude Gunpowder",
        "nameZh": "粗制火药",
        "desc": "On death, Burn nearby enemies.",
        "descZh": "死亡时，灼烧附近的敌人。",
        "icon": "./r/t/47-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "talentNoteZh": "搭配烟雾弹抢塔流必选【火箭推进涡轮靴】：极高移速压缩对手反应时间直冲爆塔；另外两个天赋要么容易提前阵亡要么未撞到就被清完。",
    "officialQuote": "两个抱紧炸药桶的地精亡命徒，点燃引信全速冲刺，只要一声巨响，世界就清静了！",
    "skill": {
      "nameZh": "自杀式建筑爆破",
      "descZh": "2 费 2 人一组的飞奔炸药组。以极快速度全速冲向最近的敌方防御塔或主基地引爆背负炸药，造成毁灭性的双倍攻城范围爆炸！"
    },
    "statsExtra": [
      {
        "label": "编制数量",
        "value": "2名地精"
      },
      {
        "label": "爆破特性",
        "value": "对建筑双倍攻城爆炸"
      },
      {
        "label": "移动速度",
        "value": "超高速冲锋"
      }
    ]
  },
  {
    "slug": "grommash-hellscream",
    "shortId": 48,
    "name": "Grommash Hellscream",
    "nameZh": "格罗玛什·地狱咆哮",
    "type": "Leader",
    "families": [
      "Horde"
    ],
    "cost": 4,
    "health": 1496,
    "damage": 220,
    "dps": 169.2,
    "speed": "Medium",
    "traits": [
      "Tank",
      "Bloodlust",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/48.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "up",
      "pve": "A",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Savage Strikes",
        "nameZh": "野蛮打击",
        "desc": "Deal double damage to enemies who are below 50% health.",
        "descZh": "对生命值低于50%的敌人造成双倍伤害。",
        "icon": "./r/t/48-0.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Bladestorm",
        "nameZh": "剑刃风暴",
        "desc": "Gain an AOE bladespin ability that damages all nearby enemies.",
        "descZh": "获得范围旋风斩技能，伤害周围所有敌人。",
        "icon": "./r/t/48-1.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Mirror Image",
        "nameZh": "镜像",
        "desc": "Summon two fragile mirror images when entering combat.",
        "descZh": "进入战斗时召唤两个脆弱的镜像分身。",
        "icon": "./r/t/48-2.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      }
    ],
    "leaderAbility": {
      "name": "For The Horde!",
      "nameZh": "为了部落！",
      "descZh": "在场时，周围所有友方单位持续获得“嗜血”增益效果（移动速度与攻击速度均提高 +33%）。"
    },
    "statsExtra": [
      {
        "label": "攻击间隔",
        "value": "1.7秒"
      },
      {
        "label": "攻击范围",
        "value": "近战"
      },
      {
        "label": "嗜血加成",
        "value": "+33%移速与攻速"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "三大天赋都有出场空间，【镜像】在 PvP 分身骗技能兼加倍砍击最强；【野蛮打击】与【剑刃风暴】偏顺风或特定防守反击，整体较挑局面。",
    "officialQuote": "战歌氏族的狂暴督军，血吼一出，周围的所有战士都将陷入不可阻挡的嗜血狂怒。",
    "skill": {
      "nameZh": "为了部落！",
      "descZh": "在场时，周围所有友方单位持续获得“嗜血”增益效果（移动速度与攻击速度均提高 +33%）。"
    }
  },
  {
    "slug": "gryphon-rider",
    "shortId": 49,
    "name": "Gryphon Rider",
    "nameZh": "狮鹫骑士",
    "type": "Troop",
    "families": [
      "Alliance"
    ],
    "cost": 2,
    "health": 170,
    "damage": 160,
    "dps": 145.4,
    "speed": "Med-Fast",
    "traits": [
      "Cycle",
      "Flying",
      "One-Target"
    ],
    "img": "./r/m/49.png",
    "tiers": {
      "pvp": "S",
      "pvpChange": "up",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Mighty Throw",
        "nameZh": "强力投掷",
        "desc": "Gain +3 Range.",
        "descZh": "攻击射程+3。",
        "icon": "./r/t/49-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Odyn's Fury",
        "nameZh": "奥丁之怒",
        "desc": "Gain Fury.",
        "descZh": "获得“狂暴”特性。",
        "icon": "./r/t/49-1.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Air Drop",
        "nameZh": "空投补给",
        "desc": "Periodically drop a potion, leveling up the first ally to touch it.",
        "descZh": "周期性落下1瓶药水，使第一个触碰到的盟友升级。",
        "icon": "./r/t/49-2.png",
        "pvpRec": "silver",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "费用优势",
        "value": "2费廉价制空"
      },
      {
        "label": "攻击射程",
        "value": "5.0码"
      },
      {
        "label": "攻击间隔",
        "value": "1.7秒"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "首推【强力投掷】：射程由 5 暴涨至 8 码（+60%），从短手缺点直接蜕变为安全白嫖输出；【空投】可稳定给达基萨斯、雷德、大仙等核心升 1 级打等级压制；【奥丁之怒】排最后。",
    "officialQuote": "翱翔在高空的蛮锤矮人空军，居高临下投掷的风暴战锤是无对空单位的致命梦魇。",
    "skill": {
      "nameZh": "蛮锤重锤投掷",
      "descZh": "仅需 2 费的飞行制空单体射手。射程 5 码，攻击间隔 1.7 秒，在空中稳定狙击地面和空中无对空能力的慢速兵种。"
    }
  },
  {
    "slug": "harpies",
    "shortId": 50,
    "name": "Harpies",
    "nameZh": "鹰身人",
    "type": "Troop",
    "families": [
      "Beast"
    ],
    "cost": 3,
    "health": 150,
    "damage": 140,
    "dps": 116.6,
    "speed": "Fast",
    "traits": [
      "Fast",
      "Flying",
      "Squad"
    ],
    "img": "./r/m/50.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "",
      "pve": "S",
      "pveChange": "",
      "overall": "S",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Infectious Swipes",
        "nameZh": "感染猛击",
        "desc": "Gain Poison.",
        "descZh": "获得剧毒。",
        "icon": "./r/t/50-0.png",
        "pvpRec": "silver",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Trinket Collectors",
        "nameZh": "收集狂",
        "desc": "Gain the Miner trait. Cost increased by 1.",
        "descZh": "获得矿工专长。费用增加1。",
        "icon": "./r/t/50-1.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Talon Dive",
        "nameZh": "利爪冲击",
        "desc": "Deal double damage on the 1st attack.",
        "descZh": "第一次攻击会造成双倍伤害。",
        "icon": "./r/t/50-2.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "编制数量",
        "value": "3只鹰身人"
      },
      {
        "label": "极限秒伤",
        "value": "全游戏顶级爆发"
      },
      {
        "label": "攻击间隔",
        "value": "0.9秒"
      }
    ],
    "talentNoteZh": "必先拿【传染挥击】：极高攻击频率瞬间叠满剧毒连护甲重坦一并融化；高玩或富裕矿图次选【饰品收集者】兼职挖矿但费用涨至 4 费需控节奏；【利爪俯冲】第三。",
    "officialQuote": "狂风撕扯着峭壁，当鹰身女妖尖啸着亮出利爪时，任何地面巨兽都将在几秒内被撕成碎肉！",
    "skill": {
      "nameZh": "疾风鹰爪绞杀",
      "descZh": "3 费 3 只一组的超高爆发飞行近战刺客。移动极快、秒伤全游戏名列前茅，几秒内即可撕碎任何高血量地面坦克。"
    }
  },
  {
    "slug": "harvest-golem",
    "shortId": 51,
    "name": "Harvest Golem",
    "nameZh": "麦田傀儡",
    "type": "Troop",
    "families": [
      "Alliance"
    ],
    "cost": 3,
    "health": 1480,
    "damage": 140,
    "dps": 70,
    "speed": "Slow",
    "traits": [
      "Tank",
      "Rebirth",
      "Slow",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/51.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "down",
      "pve": "A",
      "pveChange": "",
      "overall": "S",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Trojan Chickens",
        "nameZh": "士兵突鸡",
        "desc": "On death, spawn 5 Angry Chickens.",
        "descZh": "阵亡时会生成5只愤怒的小鸡。",
        "icon": "./r/t/51-0.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Unstable Core",
        "nameZh": "不稳定的核心",
        "desc": "On death, Stun nearby enemies for 3 seconds.",
        "descZh": "死亡时会使附近的敌人昏迷3秒。",
        "icon": "./r/t/51-1.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Bountiful Harvest",
        "nameZh": "丰收",
        "desc": "On death, apply a Heal over time effect to nearby allies.",
        "descZh": "死亡时对附近的盟友施加一个持续的治疗效果。",
        "icon": "./r/t/51-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "复生机制",
        "value": "倒地后原地复生轻傀儡"
      },
      {
        "label": "护甲特性",
        "value": "物理免伤50%"
      },
      {
        "label": "攻击间隔",
        "value": "1.7秒"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "【不稳定核心】让麦田成为 PvP 防守神卡：两次死亡均触发 3 秒大范围眩晕死守基地；【特洛伊小鸡】两次阵亡共召多只小鸡蹭伤兼抢攻火箭塔（小鸡跑得比火箭落地快！）；【丰收】最弱。",
    "officialQuote": "西部荒野废弃农田里的发条机械，就算身躯被敌人拆成两截，备用齿轮也会立即重新运转！",
    "skill": {
      "nameZh": "废品重装复生",
      "descZh": "带有护甲的机械傀儡前排。生命值归零被拆毁后，会在原地立即复生为一个完好的轻型机械收割者继续挥舞镰刀作战！"
    }
  },
  {
    "slug": "headless-horseman",
    "shortId": 52,
    "name": "Headless Horseman",
    "nameZh": "无头骑士",
    "type": "Troop",
    "families": [
      "Undead"
    ],
    "cost": 4,
    "health": 1550,
    "damage": 200,
    "dps": 133,
    "speed": "Fast",
    "traits": [
      "Fast",
      "Poisonous",
      "Elemental",
      "Bombard",
      "Melee",
      "AoE"
    ],
    "img": "./r/m/52.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "",
      "pve": "C",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Night Watch",
        "nameZh": "暗夜守望",
        "desc": "Remain at the deploy location, attacking enemies who approach.",
        "descZh": "停留在部署位置，攻击接近的敌人。",
        "icon": "./r/t/52-0.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Neigh Death Experience",
        "nameZh": "濒死体验",
        "desc": "At 40% health, Heal to 80% health and Stun nearby enemies. Ability has one charge.",
        "descZh": "在生命值为40%时，恢复到80%生命值并击晕附近的敌人。技能可充能一次。",
        "icon": "./r/t/52-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Decapitate",
        "nameZh": "身首异处",
        "desc": "On kill, gain Bloodlust for 5 seconds.",
        "descZh": "消灭时获得狂热，持续5秒。",
        "icon": "./r/t/52-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "形态切换",
        "value": "战马顺劈+步战投掷南瓜"
      },
      {
        "label": "烈焰属性",
        "value": "大范围元素灼烧"
      },
      {
        "label": "攻击间隔",
        "value": "1.5秒"
      }
    ],
    "talentNoteZh": "首推【近死体验】亡语炸伤加持续范围伤害；次选【斩首】切残血或补斩杀；【守夜】同多数原地罚站防御天赋一样泛用性最差。",
    "officialQuote": "“火焰升腾，灰烬飞扬！”南瓜烈焰与狂笑战马交织，万圣节的恐惧将主宰整片暗夜战场。",
    "skill": {
      "nameZh": "南瓜烈焰斩与狂笑投掷",
      "descZh": "强大的亡灵双形态战士。骑马时快速冲杀顺劈群敌，下马后化身烈焰狂怒形态投掷爆炸南瓜头，范围灼烧四方敌人。"
    }
  },
  {
    "slug": "hogger",
    "shortId": 53,
    "name": "Hogger",
    "nameZh": "霍格",
    "type": "Leader",
    "families": [
      "Beast"
    ],
    "cost": 4,
    "health": 1120,
    "damage": 190,
    "dps": 79.2,
    "speed": "Med-Fast",
    "traits": [
      "Tank",
      "Melee",
      "AoE"
    ],
    "img": "./r/m/53.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "",
      "pve": "B",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Ham Hock",
        "nameZh": "猪肘大餐",
        "desc": "Hogger also gains +15% max health each time he is played.",
        "descZh": "每次打出霍格时，自身最大生命值额外提升15%。",
        "icon": "./r/t/53-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Fatal Frenzy",
        "nameZh": "致命狂乱",
        "desc": "On death, Bloodlust and grant 1 level to allied Beasts.",
        "descZh": "死亡时使所有友方野兽获得嗜血并提升1级。",
        "icon": "./r/t/53-1.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      },
      {
        "name": "Spoiled Meat",
        "nameZh": "变质的肉",
        "desc": "Gain Poison.",
        "descZh": "获得“剧毒”特性。",
        "icon": "./r/t/53-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": true
      }
    ],
    "leaderAbility": {
      "name": "Relentless",
      "nameZh": "坚韧不拔",
      "descZh": "本局战斗中霍格每打出上场一次，其移动速度与攻击速度便永久提升 35%（最多可叠加 3 层狂怒）。"
    },
    "statsExtra": [
      {
        "label": "范围伤害",
        "value": "130"
      },
      {
        "label": "攻击间隔",
        "value": "1.5秒(初态)"
      },
      {
        "label": "狂怒上限",
        "value": "3层(+105%)"
      }
    ],
    "talentNoteZh": "霍格套路核心是高频刷牌重复下场叠被动，几乎必带【猪肘】把加攻转化为加生命提升滚雪球上限；PvE 打纯野兽/护甲怪才偶尔考虑另两个天赋。",
    "officialQuote": "艾尔文森林的新人噩梦，每一次死里逃生重返战场，霍格都会变得更加嗜血和凶猛。",
    "skill": {
      "nameZh": "坚韧不拔",
      "descZh": "本局战斗中霍格每打出上场一次，其移动速度与攻击速度便永久提升 35%（最多可叠加 3 层狂怒）。"
    }
  },
  {
    "slug": "holy-nova",
    "shortId": 10,
    "name": "Holy Nova",
    "nameZh": "神圣新星",
    "type": "Spell",
    "families": [
      "Alliance"
    ],
    "cost": 3,
    "health": 0,
    "damage": 150,
    "dps": 0,
    "speed": "",
    "traits": [
      "Elemental",
      "Spell",
      "AoE"
    ],
    "img": "./r/m/10.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "",
      "pve": "B",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Inner Fire",
        "nameZh": "心灵之火",
        "desc": "Affected allies gain Armored and Resist for 5 seconds.",
        "descZh": "受影响的友军获得护甲与抗性，持续5秒。",
        "icon": "./r/t/10-0.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Amplify Magic",
        "nameZh": "魔法增效",
        "desc": "Effects are doubled on all Elemental minis.",
        "descZh": "所有元素棋子受到的效果翻倍。",
        "icon": "./r/t/10-1.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": false
      },
      {
        "name": "Renew",
        "nameZh": "恢复",
        "desc": "Also adds a heal over time to allies.",
        "descZh": "同时为友军附加持续治疗效果。",
        "icon": "./r/t/10-2.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "治疗数值",
        "value": "180友方回血"
      },
      {
        "label": "伤害数值",
        "value": "180敌方元素伤"
      },
      {
        "label": "作用范围",
        "value": "大面积圆形"
      }
    ],
    "talentNoteZh": "团战翻盘关键法术，首推【心灵之火】：5 秒护甲+抗性双减伤硬扛一波集火；达基萨斯大部队卡组常用【魔法增效】给黑龙大队倍增回血；【恢复】适合战后回血。",
    "officialQuote": "神圣的光芒在战场中心迸发，既是庇护战友的生命甘霖，也是惩戒恶徒的圣洁审判。",
    "skill": {
      "nameZh": "神圣新星",
      "descZh": "在指定点迸发圣光光环，同时为范围内的所有友方棋子恢复生命值，并对范围内的所有敌方单位造成元素神圣伤害。"
    }
  },
  {
    "slug": "huntress",
    "shortId": 54,
    "name": "Huntress",
    "nameZh": "女猎手",
    "type": "Troop",
    "families": [
      "Alliance"
    ],
    "cost": 5,
    "health": 350,
    "damage": 150,
    "dps": 107.1,
    "speed": "Fast",
    "traits": [
      "Fast",
      "Resistant",
      "Ranged",
      "AoE"
    ],
    "img": "./r/m/54.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "down",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Elven Might",
        "nameZh": "精灵之力",
        "desc": "Deal 50% additional damage to the initial target.",
        "descZh": "对初始目标额外造成50%的伤害。",
        "icon": "./r/t/54-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Shadowmeld",
        "nameZh": "影遁",
        "desc": "Gain Stealth and Ambush.",
        "descZh": "获得潜行和伏击。",
        "icon": "./r/t/54-1.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Darnassian Steel",
        "nameZh": "达纳苏斯钢铁",
        "desc": "Glaive bounces an additional 3 times.",
        "descZh": "战刃会额外弹跳3次。",
        "icon": "./r/t/54-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "弹射机制",
        "value": "连续折射3个目标"
      },
      {
        "label": "射程范围",
        "value": "6.0码"
      },
      {
        "label": "抗性特性",
        "value": "元素免伤50%"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "【精灵之力】弥补女猎手单体疲软（对主目标+50%伤害）泛用极高；【影遁】则化身高爆发潜行刺客抢首轮伏击双倍暴击；【达纳苏斯钢铁】多弹射意义较小。",
    "officialQuote": "骑乘暗夜黑豹的丛林哨兵，手中的三刃月刃在敌群中疾速飞旋，折射出致命的清场光芒。",
    "skill": {
      "nameZh": "月刃连环弹射",
      "descZh": "骑乘黑豹的高速远程精灵哨兵。射出的锋利月刃可在最多 3 个敌方目标之间折射跳跃，同时具备抗性，专克成群脆皮与远程后排。"
    }
  },
  {
    "slug": "jaina-proudmoore",
    "shortId": 55,
    "name": "Jaina Proudmoore",
    "nameZh": "吉安娜·普罗德摩尔",
    "type": "Leader",
    "families": [
      "Alliance"
    ],
    "cost": 3,
    "health": 250,
    "damage": 190,
    "dps": 118.7,
    "speed": "Medium",
    "traits": [
      "Elemental",
      "Frost",
      "Ranged",
      "One-Target"
    ],
    "img": "./r/m/55.png",
    "tiers": {
      "pvp": "A",
      "pvpChange": "up",
      "pve": "S",
      "pveChange": "",
      "overall": "S",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Clearcasting",
        "nameZh": "节能施法",
        "desc": "Spells cost 1 less (but no less than 1) if played immediately after Jaina.",
        "descZh": "紧接在吉安娜之后打出的法术费用减1（最低为1）。",
        "icon": "./r/t/55-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Flurry",
        "nameZh": "冰风暴",
        "desc": "Frostbolts burst on impact, affecting enemies near the target.",
        "descZh": "寒冰箭命中时爆裂，波及目标附近的敌人。",
        "icon": "./r/t/55-1.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Blink",
        "nameZh": "闪现术",
        "desc": "Periodically teleport away from attackers.",
        "descZh": "受到攻击时周期性向后闪现拉距。",
        "icon": "./r/t/55-2.png",
        "pvpRec": "silver",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Arcane Brilliance",
      "nameZh": "奥术光辉",
      "descZh": "在场时，你施放的所有法术等级直接提高 3 级，显著强化所有伤害法术的威力与控制范围。"
    },
    "statsExtra": [
      {
        "label": "范围伤害",
        "value": "190"
      },
      {
        "label": "攻击间隔",
        "value": "2.2秒"
      },
      {
        "label": "射程",
        "value": "8.0码"
      },
      {
        "label": "法术增阶",
        "value": "+3级"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "吉安娜法术爆发核心：首推【节能施法】让部署后的高费法术减 1 费并吃满 +3 级法伤连招；【乱舞】提供冰霜小控但价值不及省费爆发，【闪现】仅小幅保命。",
    "officialQuote": "达拉然的大法师掌控着至高奥术，她所唤起的每一记法术都具备毁灭性的威力强化。",
    "skill": {
      "nameZh": "奥术光辉",
      "descZh": "在场时，你施放的所有法术等级直接提高 3 级，显著强化所有伤害法术的威力与控制范围。"
    }
  },
  {
    "slug": "living-bomb",
    "shortId": 11,
    "name": "Living Bomb",
    "nameZh": "活动炸弹",
    "type": "Spell",
    "families": [
      "Blackrock"
    ],
    "cost": 6,
    "health": 0,
    "damage": 200,
    "dps": 0,
    "speed": "",
    "traits": [
      "Elemental",
      "Spell",
      "AoE",
      "Burn"
    ],
    "img": "./r/m/11.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "up",
      "pve": "B",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Chain Reaction",
        "nameZh": "连锁反应",
        "desc": "Splash damage inflicts Living Bomb.",
        "descZh": "范围伤害会造成活动炸弹。",
        "icon": "./r/t/11-0.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Burden Of Fate",
        "nameZh": "命运重担",
        "desc": "Affected enemies are Dazed.",
        "descZh": "受影响的敌人会眩晕。",
        "icon": "./r/t/11-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Blast Radius",
        "nameZh": "爆炸半径",
        "desc": "Also burn enemies within 10.",
        "descZh": "还会灼烧半径10以内的敌人。",
        "icon": "./r/t/11-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "爆炸机制",
        "value": "多目标相互连锁"
      },
      {
        "label": "单体起爆",
        "value": "高额范围元素伤"
      },
      {
        "label": "适用场景",
        "value": "消灭高密度扎堆大军"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "6 费过高几乎仅现身于 PvE 活动或海量清杂关卡，优选【连锁反应】在怪堆引发二次爆炸；其余两个同样难回 6 费成本。",
    "officialQuote": "潜伏在敌人血肉中的狂暴火种，倒计时归零时，连带周围的一切彻底引爆！",
    "skill": {
      "nameZh": "活动炸弹引爆",
      "descZh": "消耗 6 费引燃目标区域内的所有敌兵。受感染目标在短暂延迟后剧烈爆炸，单位之间产生的连锁爆炸会成倍摧毁整支密集部队。"
    }
  },
  {
    "slug": "maiev-shadowsong",
    "shortId": 56,
    "name": "Maiev Shadowsong",
    "nameZh": "玛维·影歌",
    "type": "Leader",
    "families": [
      "Alliance"
    ],
    "cost": 5,
    "health": 744,
    "damage": 552,
    "dps": 120,
    "speed": "Med-Fast",
    "traits": [
      "Unbound",
      "Stealth",
      "Melee",
      "AoE"
    ],
    "img": "./r/m/56.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "",
      "pve": "A",
      "pveChange": "up",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Remorseless",
        "nameZh": "冷酷无情",
        "desc": "Deal double damage for 2 seconds after killing an enemy.",
        "descZh": "击杀敌人后2秒内造成双倍伤害。",
        "icon": "./r/t/56-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Enveloping Shadows",
        "nameZh": "阴影笼罩",
        "desc": "Cast Smoke Bomb on deploy, Stealthing nearby allies.",
        "descZh": "部署时自动施放烟雾弹，使附近友军潜行。",
        "icon": "./r/t/56-1.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Shadowstep",
        "nameZh": "暗影步",
        "desc": "Periodically teleport to a ranged attacker when hit.",
        "descZh": "被远程攻击命中时，周期性瞬移至攻击者身边。",
        "icon": "./r/t/56-2.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Master Assassin",
      "nameZh": "刺客大师",
      "descZh": "你每部署 1 个带有“空投”特性的棋子，玛维的黄金费用便降低 1 点（最低可降至 1 费）；进场潜行伏击双倍伤害。"
    },
    "statsExtra": [
      {
        "label": "刀扇伤害",
        "value": "140"
      },
      {
        "label": "攻击间隔",
        "value": "1.5秒"
      },
      {
        "label": "降费机制",
        "value": "-1费/空投单位"
      }
    ],
    "tierDelta": {
      "pve": "up"
    },
    "talentNoteZh": "首推【无情】：空投空降刀扇收割直接刷新攻击与隐身并大幅提伤，配合烟雾弹二次收割爆发恐怖；【暗影笼罩】当作自带兵种的烟雾弹玩重潜行体系；【暗影步】PvP 偷家偶尔可用。",
    "officialQuote": "不屈的守望者典狱长，于阴影中潜伏伺机而动，空投斥候的每一次部署都在为她缩减降临代价。",
    "skill": {
      "nameZh": "刺客大师",
      "descZh": "你每部署 1 个带有“空投”特性的棋子，玛维的黄金费用便降低 1 点（最低可降至 1 费）；进场潜行伏击双倍伤害。"
    }
  },
  {
    "slug": "malfurion",
    "shortId": 57,
    "name": "Malfurion",
    "nameZh": "玛法里奥",
    "type": "Leader",
    "families": [
      "Alliance",
      "Cenarion"
    ],
    "cost": 4,
    "health": 1116,
    "damage": 190,
    "dps": 95,
    "speed": "Medium",
    "traits": [
      "Elemental",
      "Healer",
      "Seeds of Protection",
      "Ranged",
      "One-Target"
    ],
    "img": "./r/m/57.png",
    "tiers": {
      "pvp": "A",
      "pvpChange": "",
      "pve": "S",
      "pveChange": "",
      "overall": "S",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Natural Salve",
        "nameZh": "自然药膏",
        "desc": "Nearby Poison damage heals Malfurion.",
        "descZh": "附近触发的中毒伤害会治疗玛法里奥。",
        "icon": "./r/t/57-0.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Deep Slumber",
        "nameZh": "深度沉睡",
        "desc": "Deploy asleep and stationary. Awaken once attacked.",
        "descZh": "部署时处于沉睡静止状态，受到攻击后才苏醒战斗。",
        "icon": "./r/t/57-1.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Germinate",
        "nameZh": "发芽",
        "desc": "After 30 seconds, if at least one Seed of Protection remains, apply Seeds of Protection to all allied Buildings and Meeting Stones.",
        "descZh": "存活30秒后若仍保留至少1枚守护之种，则为所有友方建筑和集合石施加守护之种。",
        "icon": "./r/t/57-2.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": true
      }
    ],
    "leaderAbility": {
      "name": "Cenarion and Alliance allies receive a heal over time at 30% health and Tank Minis gain extra protection.",
      "nameZh": "守护之种",
      "descZh": "使联盟与塞纳里奥友军在生命值低于 30% 时持续获得自然回血；重装坦克单位进场获得 3 层守护种子抵挡攻击。"
    },
    "statsExtra": [
      {
        "label": "单次治疗",
        "value": "75"
      },
      {
        "label": "攻击间隔",
        "value": "1.6秒"
      },
      {
        "label": "射程",
        "value": "8.5码"
      }
    ],
    "talentNoteZh": "全模式首推【萌芽】：死亡在友军塔旁召唤保护种子挡 3 次伤害，极大克制石像鬼与土元素偷家；团本（如古雷曼格）特殊防 Boss 机制才偶用【沉睡】；【自然药膏】每秒 1% 回血太慢排最后。",
    "officialQuote": "艾泽拉斯的第一位大德鲁伊，大自然的神圣庇护将在绝境中赐予战士无限生机与重重坚壳。",
    "skill": {
      "nameZh": "守护之种",
      "descZh": "使联盟与塞纳里奥友军在生命值低于 30% 时持续获得自然回血；重装坦克单位进场获得 3 层守护种子抵挡攻击。"
    }
  },
  {
    "slug": "meat-wagon",
    "shortId": 58,
    "name": "Meat Wagon",
    "nameZh": "绞肉车",
    "type": "Troop",
    "families": [
      "Undead"
    ],
    "cost": 3,
    "health": 320,
    "damage": 210,
    "dps": 70,
    "speed": "Medium",
    "traits": [
      "Bombard",
      "Siege Damage",
      "Longshot",
      "Ranged",
      "AoE"
    ],
    "img": "./r/m/58.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "up",
      "pve": "A",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Filet Trebuchet",
        "nameZh": "杠上加杆",
        "desc": "Increase Bombard range by +2.",
        "descZh": "轰炸射程+2。",
        "icon": "./r/t/58-0.png",
        "pvpRec": "",
        "pveRec": "gold",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Meat And Bones",
        "nameZh": "骨肉相连",
        "desc": "Every other attack summons a Skeleton instead of dealing damage.",
        "descZh": "每隔一次攻击转而召唤一个髅髅，而非造成伤害。",
        "icon": "./r/t/58-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Greased Gears",
        "nameZh": "机件上油",
        "desc": "Gain Fury.",
        "descZh": "获得狂怒。",
        "icon": "./r/t/58-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "超视距射程",
        "value": "13.0码(塔外轰杀)"
      },
      {
        "label": "目标特性",
        "value": "攻城伤害加倍"
      },
      {
        "label": "攻击间隔",
        "value": "4.0秒"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "PvE 拆塔利器（奥妮克希亚/迦顿男爵关键输出）。必先买【投石车改装】增加 2 码超远射程站在塔与 Boss 攻击范围外白嫖；长战纯靠站桩可选【滑润齿轮】，【血肉与白骨】偏弱。",
    "officialQuote": "天灾绞肉车的投臂嘎吱作响，即使站在防御塔的警戒射程之外，腐肉与枯骨也能砸平前线！",
    "skill": {
      "nameZh": "超视距尸块投掷",
      "descZh": "具备全游戏最远射程（13 码）的重型攻城器械。射程甚至远超防御塔警戒线，可在塔外毫发无伤地用腐烂尸体砸碎敌方阵地。"
    }
  },
  {
    "slug": "molten-giant",
    "shortId": 59,
    "name": "Molten Giant",
    "nameZh": "熔核巨人",
    "type": "Troop",
    "families": [
      "Blackrock"
    ],
    "cost": 6,
    "health": 3500,
    "damage": 230,
    "dps": 85.2,
    "speed": "Medium",
    "traits": [
      "Tank",
      "Armored",
      "Siege Damage",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/59.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "up",
      "pve": "B",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Bolster",
        "nameZh": "激励",
        "desc": "Heal and gain 1 Gold when destroying a tower.",
        "descZh": "摧毁防御塔时会获得治疗并积累1黄金。",
        "icon": "./r/t/59-0.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Blood Of The Mountain",
        "nameZh": "山脉之血",
        "desc": "On death, explode, damaging nearby enemies.",
        "descZh": "死亡时会爆炸，伤害附近的敌人。",
        "icon": "./r/t/59-1.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Threatening Presence",
        "nameZh": "胁迫气场",
        "desc": "Gain Taunt.",
        "descZh": "获得嘲讽。",
        "icon": "./r/t/59-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "生命厚度",
        "value": "全游顶级重装血量"
      },
      {
        "label": "护甲减免",
        "value": "物理免伤50%"
      },
      {
        "label": "攻城破坏",
        "value": "双倍攻城重拳"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "6 费过贵偏冷门，三者中【山脉之血】亡语爆伤与炸塔最易打出最低保底价值；【振作】拆塔后回血触发门槛高；【威胁存在】站位合理本身就会吸仇恨。",
    "officialQuote": "由纯粹黑石熔岩凝结而成的巍峨泰坦，他的每一步迈出都会让大地震颤，挥出的重拳足以撼动要塞！",
    "skill": {
      "nameZh": "地动山摇与坚硬岩躯",
      "descZh": "6 费巨型黑石攻城重坦。单体生命极高并具备护甲，以粉碎性的大力震荡拳猛烈破坏敌方防御塔和主基地建筑。"
    }
  },
  {
    "slug": "moonkin",
    "shortId": 60,
    "name": "Moonkin",
    "nameZh": "枭兽",
    "type": "Troop",
    "families": [
      "Cenarion"
    ],
    "cost": 3,
    "health": 360,
    "damage": 208,
    "dps": 59.4,
    "speed": "Medium",
    "traits": [
      "Elemental",
      "Armored",
      "Ranged",
      "AoE"
    ],
    "img": "./r/m/60.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "up",
      "pve": "C",
      "pveChange": "",
      "overall": "D",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Vengeance",
        "nameZh": "复仇",
        "desc": "Taking damage increases attack damage by 50% for 5 secs.",
        "descZh": "受到伤害会使攻击伤害提高50%，持续5秒。",
        "icon": "./r/t/60-0.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Moonglow",
        "nameZh": "月光",
        "desc": "The next Spell played after Moonkin gains 2 levels.",
        "descZh": "在枭兽之后使用的法术会提升2级。",
        "icon": "./r/t/60-1.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Typhoon",
        "nameZh": "台风",
        "desc": "Knockback and Daze nearby enemies on deploy, 50% health, and death.",
        "descZh": "部署时、生命值为50%时以及阵亡时击退并晕眩附近的敌人。",
        "icon": "./r/t/60-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "激怒特效",
        "value": "受击时大幅狂暴提速"
      },
      {
        "label": "伤害属性",
        "value": "范围元素奥术"
      },
      {
        "label": "射程",
        "value": "7.0码"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "3 费综合偏弱，【月光】虽使法术体系变贵但好歹兼顾场上一只输出单位，矮子里拔高个；【复仇】PvE 偶有增伤表现，【台风】最弱。",
    "officialQuote": "外表憨厚的咕咕隐藏着月神的愤怒，一旦受到惊扰，倾泻的星火将把敌人彻底焚尽！",
    "skill": {
      "nameZh": "月火轰炸与激怒狂暴",
      "descZh": "远程范围法系输出。轮流投掷月火术与阳炎打击群敌，受到近战攻击时会激怒狂暴大幅增加近身反击攻速。"
    }
  },
  {
    "slug": "mountaineer",
    "shortId": 61,
    "name": "Mountaineer",
    "nameZh": "巡山人",
    "type": "Troop",
    "families": [
      "Alliance"
    ],
    "cost": 5,
    "health": 1700,
    "damage": 280,
    "dps": 182.4,
    "speed": "Medium",
    "traits": [
      "Tank",
      "Heal Squadmate",
      "Melee",
      "Squad"
    ],
    "img": "./r/m/61.png",
    "tiers": {
      "pvp": "D",
      "pvpChange": "",
      "pve": "B",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Mend Pets",
        "nameZh": "治疗宠物",
        "desc": "Heal up to 3 additional nearby Beasts when healing the Bear.",
        "descZh": "在为熊治疗时，最多额外治疗附近的3只野兽。",
        "icon": "./r/t/61-0.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Intimidation",
        "nameZh": "恐吓",
        "desc": "The Bear roars every 10 seconds, stunning up to 3 nearby enemies for 1 second.",
        "descZh": "熊每10秒会咆哮，会使最多3个附近的敌人昏迷1秒。",
        "icon": "./r/t/61-1.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Frenzied Spirit",
        "nameZh": "精神狂乱",
        "desc": "When the Bear or Mountaineer die, the other gains Bloodlust and heals to full health.",
        "descZh": "当巡山人或他的熊死亡时，另一方获得狂热并恢复全部生命值。",
        "icon": "./r/t/61-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "战熊生命",
        "value": "1300点高护甲前排"
      },
      {
        "label": "矮人射程",
        "value": "8.5码超远狙击"
      },
      {
        "label": "治愈机制",
        "value": "猎人定期奶熊"
      }
    ],
    "talentNoteZh": "矮人身板脆弱在 PvP 极易被深呼吸/飞行员秒杀，真要玩 PvP 只能选【威吓】；PvE 配合狮鹫/鹰身/奇美拉等野兽卡可选【治疗宠物】；【狂暴之魂】在熊死后才触发嗜血，性价比一般。",
    "officialQuote": "丹莫罗雪山中的老练猎人，身旁跟随的忠诚战熊是他最值得托付后背的坚强臂膀。",
    "skill": {
      "nameZh": "猎人与战熊双生作战",
      "descZh": "矮人猎枪手（射程 8.5 码）与忠诚前排战熊（生命 1300，近战护甲）同台出战，猎人在后排稳定输出并周期性为巨熊治疗回血。"
    }
  },
  {
    "slug": "murloc-tidehunters",
    "shortId": 63,
    "name": "Murloc Tidehunters",
    "nameZh": "鱼人猎潮者",
    "type": "Troop",
    "families": [
      "Beast"
    ],
    "cost": 2,
    "health": 80,
    "damage": 90,
    "dps": 56.2,
    "speed": "Fast",
    "traits": [
      "Cycle",
      "Fast",
      "Ranged",
      "Squad"
    ],
    "img": "./r/m/63.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "down",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Safety Bubble",
        "nameZh": "安全泡泡",
        "desc": "Deploy with a bubble that blocks the first attack.",
        "descZh": "部署时自带护盾泡泡，抵挡首次受到的攻击。",
        "icon": "./r/t/63-0.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Morelocs",
        "nameZh": "年年有鱼",
        "desc": "Deploy with +1 additional Murloc.",
        "descZh": "额外部署一个鱼人。",
        "icon": "./r/t/63-1.png",
        "pvpRec": "bronze",
        "pveRec": "gold",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Careful Aim",
        "nameZh": "精准瞄准",
        "desc": "Gain +2 range.",
        "descZh": "攻击射程+2。",
        "icon": "./r/t/63-2.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "编制数量",
        "value": "2名鱼人"
      },
      {
        "label": "费用属性",
        "value": "2费循环低耗"
      },
      {
        "label": "攻击间隔",
        "value": "1.5秒"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "2 费最强杂毛之一，三大天赋都极实用！PvP 首推【安全泡泡】给每只鱼人套 1 次免伤膜完成极高赚费交换；需要 8.5 码射程反雷德/幼龙选【仔细瞄准】；PvE 清杂少时选【更多鱼人】多叫 1 只（总火力+50%）。",
    "officialQuote": "“哇啦啦啦！”海滩上最吵闹的鱼人搭档，虽然瘦小，但手中的尖刺飞镖从不落空。",
    "skill": {
      "nameZh": "双人飞镖投掷",
      "descZh": "仅需 2 费的 2 名一组轻型远程射手。可作为廉价循环过牌手段，防守时协助提供集火防空和对地远程支持。"
    }
  },
  {
    "slug": "necromancer",
    "shortId": 64,
    "name": "Necromancer",
    "nameZh": "亡灵巫师",
    "type": "Troop",
    "families": [
      "Undead"
    ],
    "cost": 4,
    "health": 400,
    "damage": 190,
    "dps": 146.1,
    "speed": "Medium",
    "traits": [
      "Elemental",
      "Summoner",
      "Ranged",
      "One-Target"
    ],
    "img": "./r/m/64.png",
    "tiers": {
      "pvp": "D",
      "pvpChange": "",
      "pve": "B",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Jeweled Skulls",
        "nameZh": "宝石徽记",
        "desc": "Summon Skeletal Mages instead of Skeletons.",
        "descZh": "召唤髅髅法师而非普通髅髅。",
        "icon": "./r/t/64-0.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Breath of the Dying",
        "nameZh": "死神之息",
        "desc": "On death, summon 5 Skeletons.",
        "descZh": "死亡时召唤5只骷髅。",
        "icon": "./r/t/64-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Cult of the Damned",
        "nameZh": "禁忌仪式",
        "desc": "On kill, summon a Skeleton.",
        "descZh": "消灭时召唤1个髅髅。",
        "icon": "./r/t/64-2.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "召唤周期",
        "value": "每8秒唤醒2具骷髅"
      },
      {
        "label": "射程",
        "value": "7.5码"
      },
      {
        "label": "伤害属性",
        "value": "远程元素暗影"
      }
    ],
    "talentNoteZh": "必选【镶宝骷髅】：把召唤的近战脆皮小骷髅升级为带冰霜减速的远程骷髅法师，配合当前龙塔词缀与团战拉扯极强；另两个纯加普通骷髅数量实战作用不大。",
    "officialQuote": "吟唱死灵咒语的通灵法师，骸骨在泥土之下战栗，在他的召唤声中源源不断爬上地表！",
    "skill": {
      "nameZh": "冥府死灵唤醒",
      "descZh": "远程暗影魔法弹输出手。战斗期间每隔数秒便施展通灵秘术，直接从地面召唤出 2 名骷髅战士在身前构筑人肉防线。"
    }
  },
  {
    "slug": "ogre-mage",
    "shortId": 65,
    "name": "Ogre Mage",
    "nameZh": "食人魔法师",
    "type": "Troop",
    "families": [
      "Horde"
    ],
    "cost": 5,
    "health": 650,
    "damage": 160,
    "dps": 114.3,
    "speed": "Medium",
    "traits": [
      "Elemental",
      "Bloodlust",
      "Ranged",
      "AoE"
    ],
    "img": "./r/m/65.png",
    "tiers": {
      "pvp": "D",
      "pvpChange": "",
      "pve": "D",
      "pveChange": "",
      "overall": "D",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Avarice",
        "nameZh": "贪婪",
        "desc": "Gain Bloodlust when Bloodlusting an ally.",
        "descZh": "在嗜血一个盟友时，自身也获得嗜血。",
        "icon": "./r/t/65-0.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Frostfire Bolt",
        "nameZh": "霜火之箭",
        "desc": "Gain Frost.",
        "descZh": "攻击获得“冰霜”减速效果。",
        "icon": "./r/t/65-1.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Ignite",
        "nameZh": "点燃",
        "desc": "Burn enemy targets.",
        "descZh": "灼烧敌方目标。",
        "icon": "./r/t/65-2.png",
        "pvpRec": "",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "嗜血辅助",
        "value": "+33%移速与攻速"
      },
      {
        "label": "火球溅射",
        "value": "大范围范围元素伤"
      },
      {
        "label": "生命厚度",
        "value": "高血量法系肉坦"
      }
    ],
    "talentNoteZh": "首推【贪婪】给自身和附近队友挂双份嗜血，推线爆发翻倍；PvP 防近战贴脸切后可选【霜火箭】减攻减移速；【点燃】收益不如直接嗜血高。",
    "officialQuote": "双头食人魔的两个脑袋各有所长：一个负责丢大火球，另一个负责给队友大喊加速！",
    "skill": {
      "nameZh": "狂暴嗜血与重磅火球",
      "descZh": "极高生命值的双头法坦。远程投掷大范围溅射的元素火球，并周期性为最近的友军施加【嗜血】增益，攻速移速提升 33%。"
    }
  },
  {
    "slug": "old-murk-eye",
    "shortId": 66,
    "name": "Old Murk-Eye",
    "nameZh": "老瞎眼",
    "type": "Leader",
    "families": [
      "Beast"
    ],
    "cost": 4,
    "health": 160,
    "damage": 150,
    "dps": 93.8,
    "speed": "Fast",
    "traits": [
      "Fast",
      "Elemental",
      "Ranged",
      "AoE"
    ],
    "img": "./r/m/66.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "",
      "pve": "B",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Marathon Of The Murlocs",
        "nameZh": "鱼人马拉松",
        "desc": "March of the Murlocs lasts an additional 5 seconds longer after deploying.",
        "descZh": "部署后“鱼人冲锋”技能的持续时间延长5秒。",
        "icon": "./r/t/66-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Electric Eels",
        "nameZh": "电鳗打击",
        "desc": "Attacks briefly Stun enemies.",
        "descZh": "攻击会短暂击晕敌人。",
        "icon": "./r/t/66-1.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": false
      },
      {
        "name": "Tip of the Spear",
        "nameZh": "矛尖突击",
        "desc": "Tidehunters spawn at Old Murk Eye's location instead.",
        "descZh": "鱼人猎潮者改为直接在老瞎眼当前位置生成。",
        "icon": "./r/t/66-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": true
      }
    ],
    "leaderAbility": {
      "name": "March of the Murlocs",
      "nameZh": "鱼人大进军",
      "descZh": "部署老瞎眼后的 5 秒内，你每消耗 1 点黄金部署其他棋子，便会在老瞎眼身旁召唤 1 只狂怒鱼人猎潮者狂奔冲锋。"
    },
    "statsExtra": [
      {
        "label": "攻击间隔",
        "value": "1.4秒"
      },
      {
        "label": "射程",
        "value": "7.0码"
      },
      {
        "label": "召唤窗口",
        "value": "部署后5秒"
      }
    ],
    "talentNoteZh": "【鱼人马拉松】几乎必带：对战约 3 秒回 1 费，多出 5 秒持续时间可多刷接近 2 费并白招 2 只鱼人（注意卡回费条大半时再下老瞎眼！）；PvP“英雄决心”词缀等高费等级时偶用【矛尖】。",
    "officialQuote": "西部荒野海滨的不朽传说，号令一下，千百只狂暴鱼人便会如怒涛般席卷整条战线。",
    "skill": {
      "nameZh": "鱼人大进军",
      "descZh": "部署老瞎眼后的 5 秒内，你每消耗 1 点黄金部署其他棋子，便会在老瞎眼身旁召唤 1 只狂怒鱼人猎潮者狂奔冲锋。"
    }
  },
  {
    "slug": "onu",
    "shortId": 67,
    "name": "Onu",
    "nameZh": "安努",
    "type": "Leader",
    "families": [
      "Cenarion"
    ],
    "cost": 5,
    "health": 4660,
    "damage": 190,
    "dps": 76,
    "speed": "Slow",
    "traits": [
      "Tank",
      "Vulnerable",
      "Slow",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/67.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "up",
      "pve": "B",
      "pveChange": "",
      "overall": "C",
      "overallChange": "up"
    },
    "talents": [
      {
        "name": "Barkskin",
        "nameZh": "树皮术",
        "desc": "Minis deployed within Safe Arbor gain Armor for 8 seconds. Also grants Onu Armor trait.",
        "descZh": "在安全林地内玩法的棋子获得8秒护甲，同时奥努自身获得护甲特性。",
        "icon": "./r/t/67-0.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Petrify",
        "nameZh": "石化",
        "desc": "Petrify on death, keeping Safe Arbor active for 8 seconds. Also summons 3 Treants on spawn.",
        "descZh": "死亡时石化并使安全林地继续维持8秒；部署时额外召唤3名树人。",
        "icon": "./r/t/67-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "From the Trees!",
        "nameZh": "树冠奇袭",
        "desc": "Minis deployed within Safe Arbor deal double damage on their first attack.",
        "descZh": "在安全林地内部署的棋子首次攻击造成双倍伤害。",
        "icon": "./r/t/67-2.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": true
      }
    ],
    "leaderAbility": {
      "name": "Safe Arbor",
      "nameZh": "安全树冠",
      "descZh": "安努周身半径 8 码范围内被视作友方部署区，允许你直接在其身旁部署任何地面棋子（如同全员空投）。"
    },
    "statsExtra": [
      {
        "label": "范围伤害",
        "value": "150"
      },
      {
        "label": "攻击间隔",
        "value": "2.8秒"
      },
      {
        "label": "前线据点",
        "value": "8码移动部署区"
      }
    ],
    "tierDelta": {
      "pvp": "up",
      "overall": "up"
    },
    "talentNoteZh": "欧努整体弱势，【从树中来】让前线直接展开高费大部队（女猎手/炎术师/工兵）最稳，必须首选；【石化】控场次之，【树皮术】最差。",
    "officialQuote": "古老的智慧古树与大地脉络相连，巨大的绿荫为友军构筑出随时可以切入战场的前线据点。",
    "skill": {
      "nameZh": "安全树冠",
      "descZh": "安努周身半径 8 码范围内被视作友方部署区，允许你直接在其身旁部署任何地面棋子（如同全员空投）。"
    }
  },
  {
    "slug": "orgrim-doomhammer",
    "shortId": 31,
    "name": "Orgrim Doomhammer",
    "nameZh": "奥格瑞姆·毁灭之锤",
    "type": "Leader",
    "families": [
      "Blackrock",
      "Horde"
    ],
    "cost": 3,
    "health": 1000,
    "damage": 190,
    "dps": 95,
    "speed": "Medium",
    "traits": [
      "Tank",
      "Mak'gora",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/31.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "down",
      "pve": "S",
      "pveChange": "",
      "overall": "S",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Deathless Rage",
        "nameZh": "不死狂怒",
        "desc": "During the Mak'gora, refuse to die, gaining Cheat Death and Bloodlust for 3.5 seconds instead.",
        "descZh": "在玛克戈拉决斗中免疫死亡，改为获得3.5秒假死与嗜血。",
        "icon": "./r/t/31-0.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Conqueror's Diplomacy",
        "nameZh": "征服者外交",
        "desc": "After winning the Mak'gora, the opponent uses the last of their strength to heal to full and join Doomhammer's side before bleeding out over 15 seconds.",
        "descZh": "赢得决斗后，败者回满血加入奥格瑞姆阵营，并在15秒内流血阵亡。",
        "icon": "./r/t/31-1.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Rally the Clan",
        "nameZh": "号召氏族",
        "desc": "Grant Bloodlust to all allies on the board for 10 seconds upon winning the Mak'gora.",
        "descZh": "赢得玛克戈拉决斗后，赋予场上所有友军10秒嗜血。",
        "icon": "./r/t/31-2.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      }
    ],
    "leaderAbility": {
      "name": "Horde and Blackrock allies deal double damage on their first attack.",
      "nameZh": "玛克戈拉决斗",
      "descZh": "部落与黑石友军首次攻击造成双倍伤害；奥格瑞姆遇敌发起一对一单挑决斗，胜出后回满生命值、升级大范围顺劈并极速加速。"
    },
    "statsExtra": [
      {
        "label": "攻击间隔",
        "value": "1.6秒"
      },
      {
        "label": "攻击范围",
        "value": "近战顺劈"
      },
      {
        "label": "单挑奖励",
        "value": "回满血+范围顺劈"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "必选【征服者的外交】：低费空降决斗赢下即永久倒戈对手棋子（15 秒持续掉血已极长），哪怕只抓小幼龙或随从也是血赚滚雪球（无需死等大怪，抓蛋孵出反打两条龙！）；PvE 次选【召集部族】。",
    "officialQuote": "手持毁灭之锤的部落大酋长，渴望在神圣决斗中彻底击垮最强敌人证明战力。",
    "skill": {
      "nameZh": "玛克戈拉决斗",
      "descZh": "部落与黑石友军首次攻击造成双倍伤害；奥格瑞姆遇敌发起一对一单挑决斗，胜出后回满生命值、升级大范围顺劈并极速加速。"
    }
  },
  {
    "slug": "plague-farmer",
    "shortId": 68,
    "name": "Plague Farmer",
    "nameZh": "染病农夫",
    "type": "Troop",
    "families": [
      "Undead"
    ],
    "cost": 2,
    "health": 250,
    "damage": 300,
    "dps": 130.43,
    "speed": "Medium",
    "traits": [
      "Cycle",
      "Bombard",
      "Poisonous",
      "Ranged",
      "AoE"
    ],
    "img": "./r/m/68.png",
    "tiers": {
      "pvp": "S",
      "pvpChange": "up",
      "pve": "S",
      "pveChange": "up",
      "overall": "S",
      "overallChange": "up"
    },
    "talents": [
      {
        "name": "Splashing Pumpkins",
        "nameZh": "南瓜飞舞",
        "desc": "Increase Range by +1 and double the Splash area.",
        "descZh": "射程+1，伤害范围翻倍。",
        "icon": "./r/t/68-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Parting Gift",
        "nameZh": "临别赠礼",
        "desc": "On death, summon a pumpkin. When touched, it Poisons nearby enemies.",
        "descZh": "死亡时召唤一个南瓜。触碰时，使附近的敌人中毒。",
        "icon": "./r/t/68-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Virulence",
        "nameZh": "遗祸无穷",
        "desc": "On kill, Poison enemies near the target.",
        "descZh": "消灭时使目标附近的敌人中毒。",
        "icon": "./r/t/68-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "射程",
        "value": "9.0码超远打击"
      },
      {
        "label": "剧毒云雾",
        "value": "区域地面无限叠毒"
      },
      {
        "label": "费用优势",
        "value": "3费低消耗"
      }
    ],
    "tierDelta": {
      "pvp": "up",
      "pve": "up",
      "overall": "up"
    },
    "talentNoteZh": "只有【溅射南瓜】一个必选答案！普攻变为 4 层范围溅射剧毒，清兵叠毒效率质变；有了溅射后【毒性加剧】完全冗余，【临别礼物】微不足道。",
    "officialQuote": "在被瘟疫侵蚀的农田里耕作的疯狂农夫，他的南瓜装满毒液，落地之处皆是恶臭毒雾。",
    "skill": {
      "nameZh": "恶臭南瓜毒雾",
      "descZh": "超远射程的毒系投掷手（射程 9 码）。投掷腐烂毒南瓜在地面留下一片剧毒之云，对走入其中的所有地面敌人叠加持续毒伤。"
    }
  },
  {
    "slug": "polymorph",
    "shortId": 12,
    "name": "Polymorph",
    "nameZh": "变形术",
    "type": "Spell",
    "families": [
      "Beast"
    ],
    "cost": 3,
    "health": 0,
    "damage": 0,
    "dps": 0,
    "speed": "",
    "traits": [
      "Spell",
      "AoE"
    ],
    "img": "./r/m/12.png",
    "tiers": {
      "pvp": "S",
      "pvpChange": "up",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Golden Fleece",
        "nameZh": "金羊毛",
        "desc": "One sheep becomes golden. Killing it grants +1 gold.",
        "descZh": "一只绵羊变成金绵羊。消灭它可获得1黄金。",
        "icon": "./r/t/12-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Exploding Sheep",
        "nameZh": "暴躁绵羊",
        "desc": "Killing a sheep damages nearby enemies.",
        "descZh": "消灭一只绵羊会伤害附近的敌人。",
        "icon": "./r/t/12-1.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Stable Transfiguration",
        "nameZh": "持久变形",
        "desc": "Lasts twice as long, but sheep regenerate health very quickly.",
        "descZh": "持续时间两倍长，但绵羊的恢复速度变快。",
        "icon": "./r/t/12-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "控制时长",
        "value": "5.0秒"
      },
      {
        "label": "状态削弱",
        "value": "无法攻击，护甲归零"
      },
      {
        "label": "破控机制",
        "value": "受到直接伤害恢复"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "神级法术核心在于【金羊毛】：把羊变成高价值金羊，只要补刀击杀立即返还 1 费，等于 2 费打 6 秒全额群体硬控；配合飞行员/法术秒一群选【爆炸羊】；【稳定变形】反而给对面回血攒费窗口。",
    "officialQuote": "最古老而羞辱的法师秘术，任凭你战力惊人，也只能在咩咩叫声中沦为待宰羔羊。",
    "skill": {
      "nameZh": "变形术绵羊诅咒",
      "descZh": "将目标区域内的所有敌方棋子变成毫无还手之力的绵羊，持续 5 秒。变形状态下敌人无法攻击且防御归零，受击后解除变形。"
    }
  },
  {
    "slug": "priestess",
    "shortId": 93,
    "name": "Priestess",
    "nameZh": "女祭司",
    "type": "Troop",
    "families": [
      "Alliance"
    ],
    "cost": 2,
    "health": 300,
    "damage": 35,
    "dps": 14.9,
    "speed": "Medium",
    "traits": [
      "Healer",
      "Elemental",
      "Cycle",
      "Ranged",
      "One-Target"
    ],
    "img": "./r/m/93.png",
    "tiers": {
      "pvp": "S",
      "pvpChange": "up",
      "pve": "S",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Power Word: Shield",
        "nameZh": "真言术：盾",
        "desc": "Periodically apply a shield to an ally, absorbing all damage for 2 seconds.",
        "descZh": "周期性为一名盟友施加护盾，吸收所有伤害，持续2秒。",
        "icon": "./r/t/93-0.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Empowered Renew",
        "nameZh": "恢复增效",
        "desc": "Casting Renew on an ally also heals them for 10% of their total health instantly.",
        "descZh": "对盟友施放复苏（持续治疗），同时立即为其恢复其总生命值的10%。",
        "icon": "./r/t/93-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Spirit of Redemption",
        "nameZh": "救赎之魂",
        "desc": "On death, summon a Spirit of Redemption who heals nearby allies for 5 seconds.",
        "descZh": "死亡时，召唤一个救赎之魂治疗附近的盟友，持续5秒。",
        "icon": "./r/t/93-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "单次治疗",
        "value": "110点生命"
      },
      {
        "label": "治疗间隔",
        "value": "1.5秒"
      },
      {
        "label": "辅助射程",
        "value": "8.0码"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "极强 2 费低费奶妈。全模式首选【真言术：盾】：关键 2 秒全额免伤足已颠覆交战结果；配合重型大肉体系次选【强化恢复】按目标 10% 最大生命回血；【救赎之魂】排最后。",
    "officialQuote": "虔诚引导圣光的联盟修女，温暖的治愈之手总能让负伤的勇士在死线边缘重新站稳脚跟。",
    "skill": {
      "nameZh": "强效治疗术与圣光护盾",
      "descZh": "纯粹的后排治疗核心。持续引导神圣光芒为前方受伤的前排坦克恢复生命值，赋予整个推进编队惊人的持久推进力。"
    }
  },
  {
    "slug": "prowler",
    "shortId": 69,
    "name": "Prowler",
    "nameZh": "觅食的灰狼",
    "type": "Troop",
    "families": [
      "Beast"
    ],
    "cost": 3,
    "health": 840,
    "damage": 130,
    "dps": 144.4,
    "speed": "Fast",
    "traits": [
      "Tank",
      "Fast",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/69.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "down",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Pack Leader",
        "nameZh": "族群领袖",
        "desc": "Grants nearby Beast allies 30% additional damage.",
        "descZh": "使附近的野兽盟友额外造成30%伤害。",
        "icon": "./r/t/69-0.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "On The Prowl",
        "nameZh": "潜行狩猎",
        "desc": "Gain Stealth, and stun the target when attacking from Stealth.",
        "descZh": "获得潜行，并在潜行现身攻击时击晕目标。",
        "icon": "./r/t/69-1.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Predatory Instincts",
        "nameZh": "掠食本能",
        "desc": "Deal double damage to enemies who are at more than 75% health.",
        "descZh": "对生命值高于75%的敌人造成双倍伤害。",
        "icon": "./r/t/69-2.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "冲锋撞击",
        "value": "远距离瞬发突进"
      },
      {
        "label": "眩晕控制",
        "value": "扑咬短暂昏迷"
      },
      {
        "label": "护甲减免",
        "value": "物理免伤50%"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "PvP 主流首选【捕食本能】前两扑爆发秒后排，或者【潜行中】先手隐身扑脸附带 1 秒强晕；若主打纯野兽体系且走 PvE 长线可用【群兽领袖】光环。",
    "officialQuote": "在灌木中潜伏已久的阴影猎豹，一旦锁定目标，破空而出的利爪将撕碎猎物的咽喉！",
    "skill": {
      "nameZh": "破空扑咬冲锋",
      "descZh": "凶猛的高速野兽捕食者。遇敌时从远距离发起高速扑咬冲锋造成范围眩晕与爆发伤害，天生具备护甲减伤。"
    }
  },
  {
    "slug": "pyromancer",
    "shortId": 70,
    "name": "Pyromancer",
    "nameZh": "炎术士",
    "type": "Troop",
    "families": [
      "Blackrock"
    ],
    "cost": 3,
    "health": 220,
    "damage": 170,
    "dps": 113.3,
    "speed": "",
    "traits": [
      "Elemental",
      "Slow",
      "Ranged",
      "AoE"
    ],
    "img": "./r/m/70.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "",
      "pve": "B",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Conflagrate",
        "nameZh": "燃烧",
        "desc": "Splash area is doubled.",
        "descZh": "伤害范围翻倍。",
        "icon": "./r/t/70-0.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Pyroblast",
        "nameZh": "炎爆术",
        "desc": "Deal triple damage on the first attack.",
        "descZh": "第一次攻击会造成三倍伤害。",
        "icon": "./r/t/70-1.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Blaze of Glory",
        "nameZh": "荣耀烈焰",
        "desc": "Damage and Burn nearby enemies on death.",
        "descZh": "死亡时伤害并灼烧附近的敌人。",
        "icon": "./r/t/70-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "范围形状",
        "value": "着弹点大圆形爆破"
      },
      {
        "label": "伤害属性",
        "value": "纯元素火焰"
      },
      {
        "label": "射程",
        "value": "7.0码"
      }
    ],
    "talentNoteZh": "【炎爆术】首击高爆融化敌方关键脆皮/半血怪，【燃烧殆尽】直接翻倍溅射半径变群体清屏机，两选一按卡组需求拿；避免选【荣耀之火】（远程被贴脸才炸几乎浪费）。",
    "officialQuote": "沉迷于毁灭艺术的黑铁火法，在她的火焰面前，哪怕最厚重的盾牌也会化为滚烫铁水！",
    "skill": {
      "nameZh": "烈焰焚尽爆破",
      "descZh": "黑石王牌远程法师。射出极度炙热的火球，命中后产生大面积火焰爆炸，专克密集型地面部队和杂兵小队。"
    }
  },
  {
    "slug": "quilboar",
    "shortId": 71,
    "name": "Quilboar",
    "nameZh": "野猪人",
    "type": "Troop",
    "families": [
      "Beast"
    ],
    "cost": 2,
    "health": 700,
    "damage": 70,
    "dps": 38.9,
    "speed": "Medium",
    "traits": [
      "Cycle",
      "Resistant",
      "Unbound",
      "Tank",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/71.png",
    "tiers": {
      "pvp": "A",
      "pvpChange": "up",
      "pve": "S",
      "pveChange": "",
      "overall": "S",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Tunnel Vision",
        "nameZh": "兵贵神速",
        "desc": "Deploy much more quickly.",
        "descZh": "部署速度大幅加快。",
        "icon": "./r/t/71-0.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Bristleback",
        "nameZh": "棘背",
        "desc": "Deal a small amount of damage to Melee attackers.",
        "descZh": "对近战攻击者造成少量伤害。",
        "icon": "./r/t/71-1.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Bramble Burst",
        "nameZh": "荆棘爆发",
        "desc": "Inflict Poison on nearby enemies when emerging.",
        "descZh": "出现时对附近的敌人造成剧毒。",
        "icon": "./r/t/71-2.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "费用优势",
        "value": "2费极速空投"
      },
      {
        "label": "抗性特性",
        "value": "元素免伤50%"
      },
      {
        "label": "战术定位",
        "value": "背身拉塔仇恨/抢箱"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "万金油 2 费空投坦克/偷矿工/抢宝箱专家。首推【隧道视野】把钻地时间从 4 秒砍半至 2 秒完美抢箱抓时机；PvP 若需要破鱼人泡泡或碰上巨龙塔（慢钻地刚好在最远射程白吃满塔伤）改用【荆棘爆发】！",
    "officialQuote": "地下的泥土是他最好的伪装，无论敌人布防多么森严，野猪人的尖刺总能从后方狠狠扎入！",
    "skill": {
      "nameZh": "瞬发潜地空投",
      "descZh": "仅需 2 费的空投抗性坦克。可瞬间钻入地底并在全图任意位置破土而出，常用于吸引防御塔后背仇恨、抢宝箱或截杀远程。"
    }
  },
  {
    "slug": "ragnaros",
    "shortId": 72,
    "name": "Ragnaros",
    "nameZh": "拉格纳罗斯",
    "type": "Leader",
    "families": [
      "Blackrock"
    ],
    "cost": 5,
    "health": 1800,
    "damage": 150,
    "dps": 75,
    "speed": "Stationary",
    "traits": [
      "Elemental",
      "Resistant",
      "Tank",
      "Braze",
      "Blast Wave",
      "Melee",
      "AoE",
      "Burn"
    ],
    "img": "./r/m/72.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "up",
      "pve": "A",
      "pveChange": "up",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Concussive Blast",
        "nameZh": "震荡冲击",
        "desc": "Blast Wave leaves enemies stunned for 2 seconds.",
        "descZh": "冲击波使敌人昏迷2秒。",
        "icon": "./r/t/72-0.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Radiant Flames",
        "nameZh": "耀眼烈焰",
        "desc": "Buildings you control periodically damage nearby enemies.",
        "descZh": "你控制的建筑周期性对附近敌人造成火焰伤害。",
        "icon": "./r/t/72-1.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Son of Flame",
        "nameZh": "烈焰之子",
        "desc": "At 50% health, summon two Fire Elementals that last 15 seconds.",
        "descZh": "生命值降至50%时召唤两名持续15秒的火元素。",
        "icon": "./r/t/72-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Molten Armor",
      "nameZh": "熔火护甲",
      "descZh": "在场时，拉格纳罗斯与所有带有“护甲”特性的友方单位受到直接物理攻击时，都会向攻击者反弹 40 点元素伤害。"
    },
    "statsExtra": [
      {
        "label": "范围伤害",
        "value": "240"
      },
      {
        "label": "攻击间隔",
        "value": "3.0秒"
      },
      {
        "label": "反伤光环",
        "value": "受击反弹40元素伤"
      }
    ],
    "tierDelta": {
      "pvp": "up",
      "pve": "up"
    },
    "talentNoteZh": "首推【辐射烈焰】：对所有我方控制建筑周期灼烧（不只限主基地），全图防推与守塔极大减压；次选【烈焰之子】补近战爆发；【震荡冲击】把垃圾法术塞卡手最不推荐。",
    "officialQuote": "炎魔之王端坐于萨弗隆铁座，熔火烈焰将向每一个敢于靠近的敌人倾泻狂暴反噬。",
    "skill": {
      "nameZh": "熔火护甲",
      "descZh": "在场时，拉格纳罗斯与所有带有“护甲”特性的友方单位受到直接物理攻击时，都会向攻击者反弹 40 点元素伤害。"
    }
  },
  {
    "slug": "raptors",
    "shortId": 73,
    "name": "Raptors",
    "nameZh": "迅猛龙",
    "type": "Troop",
    "families": [
      "Beast"
    ],
    "cost": 3,
    "health": 350,
    "damage": 120,
    "dps": 92.3,
    "speed": "Fast",
    "traits": [
      "Cycle",
      "Fast",
      "Melee",
      "Squad"
    ],
    "img": "./r/m/73.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "",
      "pve": "C",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Strength In Numbers",
        "nameZh": "数量优势",
        "desc": "Deal 10% more damage for each other Raptor nearby.",
        "descZh": "附近每有一个迅猛龙，就会额外造成10%的伤害。",
        "icon": "./r/t/73-0.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Fast Food",
        "nameZh": "快速进食",
        "desc": "On kill, heal a small amount of damage.",
        "descZh": "消灭时恢复相当于少量伤害的生命值。",
        "icon": "./r/t/73-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Motivation",
        "nameZh": "动机",
        "desc": "Gain Bloodlust for 10 seconds when coming within range of a chest or gold vein.",
        "descZh": "靠近宝箱或金脉时获得嗜血，持续10秒。",
        "icon": "./r/t/73-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "递增机制",
        "value": "每次打出数量递增"
      },
      {
        "label": "移动速度",
        "value": "超高速狂奔"
      },
      {
        "label": "攻击间隔",
        "value": "1.1秒"
      }
    ],
    "talentNoteZh": "三者均不算强，首选【人多势众】在满编召唤时直接大幅抬升迅猛龙群体秒伤；另两个受限于击杀或站位条件难以稳定收益。",
    "officialQuote": "来自安戈洛环形山的敏捷恐龙，一只迅猛龙尚可招架，成群的恐龙冲锋则是灭顶之灾！",
    "skill": {
      "nameZh": "饥渴恐龙群猎",
      "descZh": "随着打出次数不断增加同伴的群猎迅猛龙。速度极快、近身撕咬极高，小队成规模冲锋时具有撕裂一切前排的破坏力。"
    }
  },
  {
    "slug": "rend-blackhand",
    "shortId": 74,
    "name": "Rend Blackhand",
    "nameZh": "雷德·黑手",
    "type": "Leader",
    "families": [
      "Blackrock"
    ],
    "cost": 6,
    "health": 1720,
    "damage": 460,
    "dps": 82.3,
    "speed": "",
    "traits": [
      "Elemental",
      "Dismounts",
      "Flying",
      "AoE"
    ],
    "img": "./r/m/74.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Scale and Steel",
        "nameZh": "龙鳞与钢铁",
        "desc": "Gain Resistant while flying and Armored while dismounted.",
        "descZh": "飞行时获得抗性，下马后获得护甲。",
        "icon": "./r/t/74-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Flaming Soul",
        "nameZh": "烈焰之魂",
        "desc": "Cast Living Bomb upon dismounting, damaging nearby enemies.",
        "descZh": "下马时自动施放活动炸弹，伤害附近敌人。",
        "icon": "./r/t/74-1.png",
        "pvpRec": "silver",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Legionnaire",
        "nameZh": "军团勇士",
        "desc": "Dismount when first taking damage. The Drake continues fighting.",
        "descZh": "首次受到伤害便立刻下马，幼龙继续独立作战。",
        "icon": "./r/t/74-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Blacken the Skies",
      "nameZh": "遮天蔽日",
      "descZh": "在场时，你牌库中的所有飞行棋子黄金消耗降低 1 点（最低降至 2 费）；阵亡后盖斯被击杀，雷德下马以重装步兵形态继续作战。"
    },
    "statsExtra": [
      {
        "label": "下马机制",
        "value": "飞龙死后雷德下马"
      },
      {
        "label": "飞行降费",
        "value": "-1费(最低2费)"
      },
      {
        "label": "盖斯DPS",
        "value": "114"
      }
    ],
    "talentNoteZh": "雷德必须活着在场才能持续给飞行棋子减 1 费！因此首推【鳞与钢】：空中拿抗性、落地变护甲，极大延长双形态总坦度（下马单吃女猎手及一般防御塔）；【炽热灵魂】次之；【军团】双单位同框极易被一锅端！",
    "officialQuote": "骑乘幼龙盖斯的伪酋长，统治黑石天空，让黑石飞行编队以雷霆万钧之势倾巢出动。",
    "skill": {
      "nameZh": "遮天蔽日",
      "descZh": "在场时，你牌库中的所有飞行棋子黄金消耗降低 1 点（最低降至 2 费）；阵亡后盖斯被击杀，雷德下马以重装步兵形态继续作战。"
    }
  },
  {
    "slug": "s-a-f-e-pilot",
    "shortId": 46,
    "name": "S.A.F.E. Pilot",
    "nameZh": "侏儒飞行员",
    "type": "Troop",
    "families": [
      "Alliance"
    ],
    "cost": 3,
    "health": 210,
    "damage": 170,
    "dps": 70.8,
    "speed": "Medium",
    "traits": [
      "Elemental",
      "Unbound",
      "Ranged",
      "AoE",
      "Burn"
    ],
    "img": "./r/m/46.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "down",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Gnomish Cloaking Device",
        "nameZh": "侏儒隐形装置",
        "desc": "Deploy from the explosion with Stealth.",
        "descZh": "部署爆炸后获得潜行。",
        "icon": "./r/t/46-0.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Comin' In Hot!",
        "nameZh": "火力全开",
        "desc": "Deploy twice as fast and Burn nearby enemies.",
        "descZh": "部署速度翻倍，并灼烧附近的敌人，但造成的撞击伤害减少33%。",
        "icon": "./r/t/46-1.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Gnomish Muttonizer",
        "nameZh": "侏儒变羊器",
        "desc": "Polymorph the first blaster target.",
        "descZh": "将首次射击命中的目标变形为绵羊。",
        "icon": "./r/t/46-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "坠机伤害",
        "value": "进场瞬间范围元素爆破"
      },
      {
        "label": "弹射射程",
        "value": "7.0码后排射击"
      },
      {
        "label": "部署方式",
        "value": "全图空投"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "【侏儒隐形装置】（隐身首击偷秒关键远程）与【火热登场】（极快落地+持续燃烧收杂）同为一流，常规首选隐形，缺快攻反制选火热登场；【侏儒变羊器】随机太不稳定排末位。",
    "officialQuote": "侏儒工程学最骄傲的特技飞行员，迫降不仅是一门艺术，更是一次毁灭性的范围轰炸！",
    "skill": {
      "nameZh": "迫降坠毁俯冲",
      "descZh": "空投王牌。选定全图任意点以飞机俯冲轰炸着陆，对区域内敌人造成巨额范围元素伤害，飞行员弹射出舱继续远程射击。"
    }
  },
  {
    "slug": "skeleton-party",
    "shortId": 76,
    "name": "Skeleton Party",
    "nameZh": "髅髅小队",
    "type": "Troop",
    "families": [
      "Undead"
    ],
    "cost": 4,
    "health": 200,
    "damage": 46,
    "dps": 32.9,
    "speed": "Medium",
    "traits": [
      "Elemental",
      "Frost",
      "Unbound",
      "Melee",
      "Squad"
    ],
    "img": "./r/m/76.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "down",
      "pve": "B",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "5-Man",
        "nameZh": "五人成行",
        "desc": "Summons a Skeleton Tank, Rogue, Priest, and 2 Mages.",
        "descZh": "召唤1个髅髅坦克，1个髅髅潜行者，1个髅髅牧师和2个髅髅法师。",
        "icon": "./r/t/76-0.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Corpse Run",
        "nameZh": "前赴后继",
        "desc": "Gain +1 level for each deploy after the first. (Maximum +3 levels)",
        "descZh": "第一次部署之后的每次部署会获得+1等级（最多+3等级）。",
        "icon": "./r/t/76-1.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Ritual of Rime",
        "nameZh": "守护仪式",
        "desc": "Summon 5 Skeleton Mages who guard the deploy location.",
        "descZh": "召唤5个髅髅法师守住部署点。",
        "icon": "./r/t/76-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "编制数量",
        "value": "5名骷髅小队"
      },
      {
        "label": "部署方式",
        "value": "全图空投"
      },
      {
        "label": "兵种构成",
        "value": "骷髅近战+骷髅法师"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "首推【尸体狂奔】：随着出牌次数叠加等级，越到后期偷家和蹭塔越凶；【五人小队】把 4 费牌变为有坦有奶有输出的副本五人小队可玩性高；【霜冻仪式】仅限奥妮克希亚等极少数死守基地套路。",
    "officialQuote": "墓地里最喧闹的亡灵聚会，破土而出的骷髅小分队会以狂欢之势包抄毫无防备的后方阵线！",
    "skill": {
      "nameZh": "全图空投骷髅连",
      "descZh": "消耗 4 费在战场任意指定区域同时召唤 5 名骷髅战士（含骷髅法师），用于全图偷家、占领集合石或包抄后排。"
    }
  },
  {
    "slug": "skeletons",
    "shortId": 77,
    "name": "Skeletons",
    "nameZh": "髅髅",
    "type": "Troop",
    "families": [
      "Undead"
    ],
    "cost": 2,
    "health": 200,
    "damage": 46,
    "dps": 32.9,
    "speed": "Medium",
    "traits": [
      "Cycle",
      "Unbound",
      "Melee",
      "Squad"
    ],
    "img": "./r/m/77.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "down",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Questing Buddies",
        "nameZh": "各怀绝技",
        "desc": "One Skeleton gains Armor, one gains Resist, and one gains Stealth.",
        "descZh": "一个骷髅获得护甲，一个获得抗性，还有一个获得潜行。",
        "icon": "./r/t/77-0.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Exhume",
        "nameZh": "破土而出",
        "desc": "If deployed near a Tower or Meeting Stone, deploy +2 additional Skeletons.",
        "descZh": "如果部署在防御塔或集合石附近，会额外部署2个髅髅。",
        "icon": "./r/t/77-1.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Cackle",
        "nameZh": "喋喋不休",
        "desc": "Gain Taunt.",
        "descZh": "获得嘲讽。",
        "icon": "./r/t/77-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "费用优势",
        "value": "2费轻量空投"
      },
      {
        "label": "编制数量",
        "value": "2名骷髅"
      },
      {
        "label": "战术定位",
        "value": "截杀后排/占领集合石"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "首推【掘墓】：2 费空投直接在敌塔下或 Boss 脸前召唤 5 只骷髅（配野猪人能直接偷塔，或帮单攻 Boss 吃满 5 次普攻），性价比炸裂；次选【任务伙伴】，【咯咯笑】最弱。",
    "officialQuote": "两具脆落却烦人的骷髅架子，从你脚下的泥土里爬出，专挑最关键的时刻打乱你的计划。",
    "skill": {
      "nameZh": "潜伏破土骚扰",
      "descZh": "仅需 2 费的 2 人空投小骷髅。可直接丢在矿脉、集合石或敌方远程身后偷袭，极具机动骚扰与阻截价值。"
    }
  },
  {
    "slug": "smoke-bomb",
    "shortId": 13,
    "name": "Smoke Bomb",
    "nameZh": "烟雾弹",
    "type": "Spell",
    "families": [
      "Blackrock"
    ],
    "cost": 1,
    "health": 0,
    "damage": 0,
    "dps": 0,
    "speed": "",
    "traits": [
      "Cycle",
      "Spell",
      "AoE"
    ],
    "img": "./r/m/13.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "up",
      "pve": "B",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Through The Shadows",
        "nameZh": "暗影穿行",
        "desc": "Affected minis move 50% faster until unstealthed.",
        "descZh": "受影响的棋子移动速度提高50%，直到脱离潜行状态。",
        "icon": "./r/t/13-0.png",
        "pvpRec": "silver",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Band Of Thieves",
        "nameZh": "成群结队",
        "desc": "Grant +2 levels to Cycle minis within.",
        "descZh": "使其中的刷新棋子等级+1。",
        "icon": "./r/t/13-1.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      },
      {
        "name": "Smoke Bomb's Ambush",
        "nameZh": "烟雾伏击",
        "desc": "Allies deal 50% additional damage on their next hit.",
        "descZh": "盟友下次攻击时额外造成50%伤害。",
        "icon": "./r/t/13-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "潜行时长",
        "value": "8.0秒"
      },
      {
        "label": "消耗费用",
        "value": "1费极致循环"
      },
      {
        "label": "联动特性",
        "value": "配合伏击造成双倍暴击"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "核心搭配工兵隐身冲塔或重置徘徊者/玛维再次潜行。唯一核心选【穿过阴影】提供急需的高额加速保证在显形前摸到目标；【盗贼帮】加 2 级虽美但工兵没加速根本跑不到塔前；【夜行陌生人】极偏门。",
    "officialQuote": "浓烈的刺鼻迷雾遮蔽战场视线，刺客的利刃将在隐蔽之中悄然出鞘。",
    "skill": {
      "nameZh": "隐蔽烟幕",
      "descZh": "仅消耗 1 费在目标区域散布浓烟。覆盖区域内的所有友方棋子立即进入潜行状态，持续 8 秒或直到发动攻击（破隐一击可触发伏击双倍伤害）。"
    }
  },
  {
    "slug": "sneed",
    "shortId": 78,
    "name": "Sneed",
    "nameZh": "斯尼德",
    "type": "Leader",
    "families": [
      "Horde"
    ],
    "cost": 5,
    "health": 1352,
    "damage": 360,
    "dps": 120,
    "speed": "Medium",
    "traits": [
      "Tank",
      "Armored",
      "Siege Damage",
      "Melee",
      "AoE"
    ],
    "img": "./r/m/78.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "up",
      "pve": "A",
      "pveChange": "up",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Mine Is Money, Friend!",
        "nameZh": "矿就是钱，朋友！",
        "desc": "Gain the Miner trait.",
        "descZh": "获得“采矿”特性。",
        "icon": "./r/t/78-0.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Lead With Greed",
        "nameZh": "贪婪先行",
        "desc": "Gain an additional +2 Gold when Sneed triggers Sneed Before Greed.",
        "descZh": "触发“贪婪为先”时额外多获得+2金币。",
        "icon": "./r/t/78-1.png",
        "pvpRec": "bronze",
        "pveRec": "gold",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Land Grab",
        "nameZh": "圈地狂魔",
        "desc": "Gain 2 levels whenever Sneed Before Greed triggers.",
        "descZh": "每当触发“贪婪为先”时，斯尼德等级+2。",
        "icon": "./r/t/78-2.png",
        "pvpRec": "",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Sneed Before Greed",
      "nameZh": "贪婪为先",
      "descZh": "每当带有“攻城伤害”特性的友方棋子摧毁防御塔、开启宝箱或夺取集合石时，为你额外提供 +2 点黄金收入。"
    },
    "statsExtra": [
      {
        "label": "攻击间隔",
        "value": "2.2秒"
      },
      {
        "label": "攻击范围",
        "value": "近战攻城"
      },
      {
        "label": "掠夺金币",
        "value": "+2黄金/拆迁"
      }
    ],
    "tierDelta": {
      "pvp": "up",
      "pve": "up"
    },
    "talentNoteZh": "围绕被动“贪婪开箱拿 +2 金”构筑的攻城领主。必首选【以贪制贪】：把每次被动触发赏金直接翻倍至 +4 金爆发式拉开经济；【圈地】buff 后升至多+10级仅 PvE 偶用；【朋友，钱归我了】使慢速斯尼德去挖矿得不偿失。",
    "officialQuote": "死亡矿井的贪婪伐木机工程师，对一切能够拆解换取黄金的防御工事抱有极高热情。",
    "skill": {
      "nameZh": "贪婪为先",
      "descZh": "每当带有“攻城伤害”特性的友方棋子摧毁防御塔、开启宝箱或夺取集合石时，为你额外提供 +2 点黄金收入。"
    }
  },
  {
    "slug": "spiderlings",
    "shortId": 79,
    "name": "Spiderlings",
    "nameZh": "小蜘蛛",
    "type": "Troop",
    "families": [
      "Beast"
    ],
    "cost": 2,
    "health": 380,
    "damage": 40,
    "dps": 66.5,
    "speed": "Fast",
    "traits": [
      "Cycle",
      "Poisonous",
      "Vulnerable",
      "Melee",
      "Squad"
    ],
    "img": "./r/m/79.png",
    "tiers": {
      "pvp": "A",
      "pvpChange": "",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Cave Dwellers",
        "nameZh": "穴居人",
        "desc": "Gain Stealth & Frost.",
        "descZh": "获得潜行和冰霜。",
        "icon": "",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Bloated Carapace",
        "nameZh": "浮肿外壳",
        "desc": "Explode on death, Poisoning and Stunning nearby enemies (1s stun).",
        "descZh": "死亡时会爆炸，使附近的敌人中毒和昏迷。",
        "icon": "./r/t/79-1.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Envenom",
        "nameZh": "毒伤",
        "desc": "Deal twice as much Poison damage.",
        "descZh": "造成两倍的剧毒伤害。",
        "icon": "./r/t/79-2.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "编制数量",
        "value": "4只蜘蛛"
      },
      {
        "label": "毒伤机制",
        "value": "无限叠加剧毒层数"
      },
      {
        "label": "攻击间隔",
        "value": "1.0秒"
      }
    ],
    "talentNoteZh": "重做后非常强力！首推【臃肿甲壳】：阵亡自爆附带伤害、眩晕且连空中部队一起炸并上毒；追求必定贴脸可次选【洞穴居民】潜行加冰霜减速；【涂毒】仅 PvE 长线叠满毒可用。",
    "officialQuote": "成群爬行的小毒蛛，细小的毒牙看似微弱，但层层叠加的剧毒足以让最庞大的巨人轰然倒地！",
    "skill": {
      "nameZh": "剧毒连环注射",
      "descZh": "2 费 4 只一组的剧毒突击小蜘蛛。近身咬击每次都附加可无限叠加的剧毒层数，数秒内即可将巨型重坦毒蚀瓦解。"
    }
  },
  {
    "slug": "stonehoof-tauren",
    "shortId": 80,
    "name": "Stonehoof Tauren",
    "nameZh": "石蹄牛头人",
    "type": "Troop",
    "families": [
      "Horde"
    ],
    "cost": 4,
    "health": 1720,
    "damage": 150,
    "dps": 83.3,
    "speed": "Medium",
    "traits": [
      "Tank",
      "Charge",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/80.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "",
      "pve": "B",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Momentum",
        "nameZh": "势如破竹",
        "desc": "After connecting a charge, immediately charge a second time if possible.",
        "descZh": "冲锋命中后，如果可以会立即再冲锋一次。",
        "icon": "./r/t/80-0.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Pummel",
        "nameZh": "拳击",
        "desc": "After connecting a charge, Stun the target for 3 seconds.",
        "descZh": "冲锋命中后，击晕目标3秒。",
        "icon": "./r/t/80-1.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Provoke",
        "nameZh": "横行霸道",
        "desc": "After connecting a charge, Taunt nearby enemies.",
        "descZh": "在进行一次冲锋后，嘲讽附近的敌人。",
        "icon": "./r/t/80-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "冲锋爆发",
        "value": "双倍伤害重击"
      },
      {
        "label": "控制特性",
        "value": "命中击飞眩晕"
      },
      {
        "label": "护甲特性",
        "value": "物理免伤50%"
      }
    ],
    "talentNoteZh": "上场专为冲锋切死敌方后排女猎手、大仙等脆皮。因此首选【势头】击杀前排后立刻二次冲锋直捣后排；次选【猛击】打满 1v1 伤害；【挑衅】性价比极低。",
    "officialQuote": "雷霆崖的勇敢战士，低头冲撞的沉重铁蹄会让整条行军通道上的敌军全部倒地！",
    "skill": {
      "nameZh": "势不可挡野蛮冲撞",
      "descZh": "极具威慑力的高甲部落前排坦克。发现目标后发起长距离低头冲锋，命中首个目标造成双倍重击并将其击飞击晕。"
    }
  },
  {
    "slug": "swole-troll",
    "shortId": 81,
    "name": "Swole Troll",
    "nameZh": "强壮巨魔",
    "type": "Troop",
    "families": [
      "Horde"
    ],
    "cost": 4,
    "health": 2600,
    "damage": 250,
    "dps": 125,
    "speed": "Slow",
    "traits": [
      "Siege Damage",
      "Unstoppable",
      "Tank",
      "Slow",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/81.png",
    "tiers": {
      "pvp": "A",
      "pvpChange": "down",
      "pve": "B",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Trollnado",
        "nameZh": "巨魔飓风",
        "desc": "Uses a spinning attack to knock nearby enemy Minis far away every 7 seconds.",
        "descZh": "使用旋转攻击，每隔7秒将附近的敌方棋子击飞。",
        "icon": "./r/t/81-0.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Troll Train",
        "nameZh": "巨魔冲车",
        "desc": "Dashes to an enemy Mini to stun them along his path.",
        "descZh": "冲向敌方棋子，使沿途目标昏迷。",
        "icon": "./r/t/81-1.png",
        "pvpRec": "gold",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Meatier Elbow",
        "nameZh": "筋肉肘击",
        "desc": "Now targets enemy Minis with a large damaging AOE.",
        "descZh": "现在能够在大范围内对敌方棋子造成伤害。",
        "icon": "./r/t/81-2.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "攻击范围",
        "value": "扇形横扫AOE"
      },
      {
        "label": "狂暴状态",
        "value": "残血激怒提速"
      },
      {
        "label": "攻击间隔",
        "value": "1.9秒"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "当前热门攻城巨头！【巨魔列车】全速冲锋直扑建筑兼晕沿途守军极其恐怖，但极怕奥格瑞姆决斗强制停步；因此高频对抗奥格瑞姆与 PvE 时改带【更厚实的手肘】化身强力清兵格斗坦；【巨魔旋风】最差。",
    "officialQuote": "体型异乎寻常庞大的巨魔莽夫，抡圆的沉重图腾柱会把面前的一切敌人都扫出十步之外！",
    "skill": {
      "nameZh": "蛮力横扫与厚实重皮",
      "descZh": "体型巨大的狂暴巨魔近战前排。挥舞巨锤扫击前方扇形所有目标，并在低血量时激发更强攻击欲望与自愈能力。"
    }
  },
  {
    "slug": "sylvanas-windrunner",
    "shortId": 82,
    "name": "Sylvanas Windrunner",
    "nameZh": "希尔瓦娜斯·风行者",
    "type": "Leader",
    "families": [
      "Horde",
      "Undead"
    ],
    "cost": 6,
    "health": 500,
    "damage": 190,
    "dps": 146,
    "speed": "Medium",
    "traits": [
      "Haunt",
      "Ranged",
      "One-Target"
    ],
    "img": "./r/m/82.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "down",
      "pve": "S",
      "pveChange": "",
      "overall": "S",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Queen's Reach",
        "nameZh": "女王射程",
        "desc": "Black Arrow travels 20% farther, but attack speed is 10% slower.",
        "descZh": "黑箭射程延长20%，但攻击速度降低10%。",
        "icon": "./r/t/82-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Banshee's Wail",
        "nameZh": "女妖之嚎",
        "desc": "Scream on Death, Stunning nearby enemies for 3 seconds.",
        "descZh": "死亡时发出尖啸，击晕附近敌人3秒。",
        "icon": "./r/t/82-1.png",
        "pvpRec": "gold",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Forsaken Fury",
        "nameZh": "被遗忘者之怒",
        "desc": "Windrunner Aura also grants Fury to Horde and Undead Allies.",
        "descZh": "风行者光环同时为部落和亡灵友军提供狂暴。",
        "icon": "./r/t/82-2.png",
        "pvpRec": "silver",
        "pveRec": "gold",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Windrunner Warchief",
      "nameZh": "风行者大酋长",
      "descZh": "在场时，周围所有部落与亡灵阵营棋子移动速度永久提高 30%；自身阵亡时会发出一记女妖哀嚎，直接附身接管身边一名敌兵。"
    },
    "statsExtra": [
      {
        "label": "射程",
        "value": "8.5码"
      },
      {
        "label": "攻击间隔",
        "value": "1.7秒"
      },
      {
        "label": "阵亡遗言",
        "value": "召唤女妖附身"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "双族重做后黑箭变为固有被动。【女王之触】拉长黑箭超远穿透射程，站在防御塔射程外白点摧毁防线，PvP/综合最稳；PvE（配巨魔/蝙蝠骑士/投石车/牛头人）和石像鬼流必带【被遗忘者的狂怒】全局赋予部落与亡灵狂暴；【女妖之嚎】仅淘金热奇效。",
    "officialQuote": "被遗忘者的黑暗女王，统御女妖与亡灵军势，以极速冲锋在阵亡之际化作夺魂哀歌。",
    "skill": {
      "nameZh": "风行者大酋长",
      "descZh": "在场时，周围所有部落与亡灵阵营棋子移动速度永久提高 30%；自身阵亡时会发出一记女妖哀嚎，直接附身接管身边一名敌兵。"
    }
  },
  {
    "slug": "thrall",
    "shortId": 95,
    "name": "Thrall",
    "nameZh": "萨尔",
    "type": "Leader",
    "families": [
      "Horde"
    ],
    "cost": 5,
    "health": 1500,
    "damage": 305,
    "dps": 174,
    "speed": "Medium",
    "traits": [
      "Detect",
      "Elemental",
      "Tank",
      "Ranged",
      "One-Target"
    ],
    "img": "./r/m/95.png",
    "tiers": {
      "pvp": "S",
      "pvpChange": "",
      "pve": "S",
      "pveChange": "up",
      "overall": "S",
      "overallChange": "up"
    },
    "talents": [
      {
        "name": "Call of the Horde",
        "nameZh": "部落的召唤",
        "desc": "Gain Bloodlust for 5 seconds and pulses lightning whenever a Horde ally is deployed.",
        "descZh": "每部署一名部落友军时，萨尔获得5秒嗜血并释放闪电脉冲。",
        "icon": "./r/t/95-0.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      },
      {
        "name": "Feral Spirit",
        "nameZh": "野性狼魂",
        "desc": "When Thrall's health drops to 50%, he summons 2 Spirit Wolves to fight by his side. This can trigger once per deploy.",
        "descZh": "生命值降至50%时召唤2只幽灵狼并肩作战（每次部署触发1次）。",
        "icon": "./r/t/95-1.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Totemic Mastery",
        "nameZh": "图腾掌握",
        "desc": "When deployed Thrall summons a totem as his location and a new one every 10 seconds. Each totem lasts for 10 seconds.",
        "descZh": "部署时及此后每10秒在原地召唤一座图腾，每座持续10秒。",
        "icon": "./r/t/95-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": true
      }
    ],
    "leaderAbility": {
      "name": "Warchief's Presence",
      "nameZh": "大酋长的威严",
      "descZh": "在场时，周围半径 6 码内的友方部落与元素单位获得 +20% 伤害加成，并获得额外抗性保护。"
    },
    "statsExtra": [
      {
        "label": "闪电链伤害",
        "value": "140"
      },
      {
        "label": "攻击间隔",
        "value": "1.8秒"
      },
      {
        "label": "强化光环",
        "value": "+20%伤害与抗性"
      }
    ],
    "talentNoteZh": "首选【幽灵狼】（PvP 最强）：50% 血召唤 2 只 700 血快移速狼魂（100 元素伤 + 6 码冲锋 + 10 秒嘲讽），注意变羊期间不触发、变回后受击仍可触发；次选【图腾掌控】：每 10 秒按风怒(+25%全图攻速)/灼热/治疗(25/秒)/地缚(-25%全图移速)轮换插图腾，双萨尔在场可同时叠多种全图图腾；末选【部落的召唤】：打任意部落牌给萨尔挂 5 秒嗜血并迸发 200 元素闪电，需要大量低费部落卡支撑。",
    "officialQuote": "大地之环的萨满大酋长，倾听风暴与雷霆的呼唤，将元素之力灌注进战士的躯体。",
    "skill": {
      "nameZh": "大酋长的威严",
      "descZh": "在场时，周围半径 6 码内的友方部落与元素单位获得 +20% 伤害加成，并获得额外抗性保护。"
    }
  },
  {
    "slug": "tirion-fordring",
    "shortId": 83,
    "name": "Tirion Fordring",
    "nameZh": "提里奥·弗丁",
    "type": "Leader",
    "families": [
      "Alliance"
    ],
    "cost": 4,
    "health": 700,
    "damage": 120,
    "dps": 66.7,
    "speed": "Medium",
    "traits": [
      "Tank",
      "Armored",
      "Healer",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/83.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "up",
      "pve": "A",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Divine Shield",
        "nameZh": "圣盾术",
        "desc": "Gain a magical shield at 30% health, absorbing all damage for 5 seconds.",
        "descZh": "生命值降至30%时获得无敌护盾，吸收所有伤害5秒。",
        "icon": "./r/t/83-0.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "By The Light",
        "nameZh": "圣光之名",
        "desc": "Heal the primary target for twice as much.",
        "descZh": "对主治疗目标的治疗量翻倍。",
        "icon": "./r/t/83-1.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Consecrate",
        "nameZh": "奉献",
        "desc": "Regularly consecrate the ground, damaging enemies within.",
        "descZh": "定期奉献脚下地面，伤害范围内的敌人。",
        "icon": "./r/t/83-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Holy Light",
      "nameZh": "神圣光环",
      "descZh": "周期性（每 2.5 秒）引导圣光治疗周围生命值最低的友方单位（每次恢复 100 点生命值），形成强大的推进续航。"
    },
    "statsExtra": [
      {
        "label": "单次治疗",
        "value": "100"
      },
      {
        "label": "治疗间隔",
        "value": "2.5秒"
      },
      {
        "label": "攻击间隔",
        "value": "1.5秒"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "类似黑龙将军主打滚雪球双提里奥奶阵！必选【圣盾术】半血触发 3 秒无敌避免被秒，给队友奶回血线；【圣光庇佑】加单次治疗适合配多前排，【奉献】伤害太低排末位。",
    "officialQuote": "白银之手的虔诚大领主，圣光从不抛弃忠诚的勇士，无尽愈合将构筑出坚如磐石的永恒防线。",
    "skill": {
      "nameZh": "神圣光环",
      "descZh": "周期性（每 2.5 秒）引导圣光治疗周围生命值最低的友方单位（每次恢复 100 点生命值），形成强大的推进续航。"
    }
  },
  {
    "slug": "treant",
    "shortId": 84,
    "name": "Treant",
    "nameZh": "树人",
    "type": "Troop",
    "families": [
      "Cenarion"
    ],
    "cost": 1,
    "health": 225,
    "damage": 90,
    "dps": 36,
    "speed": "Slow",
    "traits": [
      "Surge",
      "Armored",
      "Slow",
      "Melee",
      "Squad"
    ],
    "img": "./r/m/84.png",
    "tiers": {
      "pvp": "D",
      "pvpChange": "",
      "pve": "D",
      "pveChange": "",
      "overall": "D",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Composting",
        "nameZh": "堆肥",
        "desc": "On death, Heal nearby allied minis immediately and over time.",
        "descZh": "阵亡时会立即并持续治疗附近的友方棋子。",
        "icon": "./r/t/84-0.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Propagation",
        "nameZh": "增殖",
        "desc": "Summon two extra Treants at your base for every 3 Gold spent on deploy.",
        "descZh": "部署时每多花费3黄金，就会额外召唤两个树人。",
        "icon": "./r/t/84-1.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Uproot",
        "nameZh": "拔根而起",
        "desc": "On death, Root the target for 3 seconds.",
        "descZh": "死亡时会使目标定身3秒。",
        "icon": "./r/t/84-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "护甲特性",
        "value": "物理免伤50%"
      },
      {
        "label": "顺劈范围",
        "value": "近身小范围AOE"
      },
      {
        "label": "攻击间隔",
        "value": "1.8秒"
      }
    ],
    "talentNoteZh": "虽带护甲但血量极低怕一切 AOE。真要用首推【繁殖】凑数当 3 费 5 只小树防线（但远不如 1 费迪菲亚强盗实用）；【堆肥】回血过低，【连根拔起】太慢。",
    "officialQuote": "被大自然赋予生命的活树，坚韧的粗糙树皮是他守护塞纳里奥幼苗的天然甲胄。",
    "skill": {
      "nameZh": "活化树木根须",
      "descZh": "塞纳里奥林地守卫。受到大自然滋养，攻击具备近战顺劈与高额护甲，为脆弱的塞纳里奥法师构筑坚固前线掩护。"
    }
  },
  {
    "slug": "vultures",
    "shortId": 85,
    "name": "Vultures",
    "nameZh": "秃鹫",
    "type": "Troop",
    "families": [
      "Beast"
    ],
    "cost": 1,
    "health": 25,
    "damage": 70,
    "dps": 43.8,
    "speed": "Med-Fast",
    "traits": [
      "Cycle",
      "Carrion",
      "Flying",
      "Squad"
    ],
    "img": "./r/m/85.png",
    "tiers": {
      "pvp": "S",
      "pvpChange": "up",
      "pve": "B",
      "pveChange": "",
      "overall": "B",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Feeding Frenzy",
        "nameZh": "吞食狂乱",
        "desc": "The flock gains Bloodlust for 5 seconds when spawning a new Vulture.",
        "descZh": "生成1个新秃鹫时，所有秃鹫获得嗜血，持续5秒。",
        "icon": "./r/t/85-0.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Migration",
        "nameZh": "迁徙",
        "desc": "All additional Vultures spawn at your base.",
        "descZh": "所有额外的秃鹫会出生在你基地周围。",
        "icon": "./r/t/85-1.png",
        "pvpRec": "silver",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": true
      },
      {
        "name": "Tendon Rip",
        "nameZh": "肌腱撕裂",
        "desc": "Attacks Daze enemies for 3 seconds.",
        "descZh": "攻击会使敌人眩晕3秒。",
        "icon": "./r/t/85-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "繁殖机制",
        "value": "周围敌死分裂1只新秃鹫"
      },
      {
        "label": "费用属性",
        "value": "1费极致轮转"
      },
      {
        "label": "攻击间隔",
        "value": "1.2秒"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "1 费神卡，三者按需可选但首推【迁徙】：让被动食腐分裂的秃鹫分散站位避免被火球/巫医一发团灭；想要嗜血爆推选【狂食】，补小减速控场选【撕裂肌腱】。",
    "officialQuote": "天空中盘旋的饥饿死神，战场的每一次杀戮都将化作催生更多秃鹫孵化的食粮！",
    "skill": {
      "nameZh": "食腐分裂繁殖",
      "descZh": "仅需 1 费的 2 只飞行食腐鸟。每当周围有敌方单位阵亡时，秃鹫会食腐残骸并立刻分裂繁衍出一只新的秃鹫！"
    }
  },
  {
    "slug": "warsong-grunts",
    "shortId": 86,
    "name": "Warsong Grunts",
    "nameZh": "战歌步兵",
    "type": "Troop",
    "families": [
      "Horde"
    ],
    "cost": 5,
    "health": 1720,
    "damage": 95,
    "dps": 59.4,
    "speed": "Medium",
    "traits": [
      "Tank",
      "Fury",
      "Melee",
      "Squad"
    ],
    "img": "./r/m/86.png",
    "tiers": {
      "pvp": "B",
      "pvpChange": "up",
      "pve": "B",
      "pveChange": "",
      "overall": "B",
      "overallChange": "up"
    },
    "talents": [
      {
        "name": "Blood Pact",
        "nameZh": "血契",
        "desc": "When a Grunt dies, the other gain Bloodlust and fully heals.",
        "descZh": "当一个步兵阵亡时，另一个获得狂热并完全恢复生命值。",
        "icon": "./r/t/86-0.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Command",
        "nameZh": "统率",
        "desc": "While deployed, Beast allies deal 30% additional damage.",
        "descZh": "部署后，野兽盟友额外造成30%的伤害。",
        "icon": "./r/t/86-1.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      },
      {
        "name": "Guard Duty",
        "nameZh": "保持警戒",
        "desc": "Remain at deploy location until entering combat, gain Armored and reduce Gold cost by 1.",
        "descZh": "留在部署位置，直到进入战斗，获得“护甲”且消耗的黄金减少1。",
        "icon": "./r/t/86-2.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 1,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "编制数量",
        "value": "2名兽人步兵"
      },
      {
        "label": "护甲减免",
        "value": "物理免伤50%"
      },
      {
        "label": "攻击间隔",
        "value": "1.6秒"
      }
    ],
    "tierDelta": {
      "pvp": "up",
      "overall": "up"
    },
    "talentNoteZh": "【守卫职责】大幅强化后让 5 费降为 4 费并获护甲（仅守塔时生效更需看地形），终于拥有 PvE 一战之力；【血契】6 费过于沉重；【指挥】仅限纯野兽卡组。",
    "officialQuote": "“洛克塔·欧加！”战歌氏族的精锐兽人步兵，两柄战斧在嗜血战吼下将劈碎一切坚固防线！",
    "skill": {
      "nameZh": "战歌血怒近战组",
      "descZh": "2 名一组手持巨斧的重装部落战士。具备高额护甲，以刚猛斧击劈斩正面防线，受到嗜血加持时输出成倍爆发。"
    }
  },
  {
    "slug": "warsong-raider",
    "shortId": 87,
    "name": "Warsong Raider",
    "nameZh": "战歌掠夺者",
    "type": "Troop",
    "families": [
      "Horde"
    ],
    "cost": 4,
    "health": 1340,
    "damage": 180,
    "dps": 105.9,
    "speed": "Fast",
    "traits": [
      "Tank",
      "Fast",
      "Siege Damage",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/87.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "",
      "pve": "C",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Razing Focus",
        "nameZh": "拆除专家",
        "desc": "Become a Siege unit, ignoring enemy Minis.",
        "descZh": "变成攻城单位，无视敌方棋子。",
        "icon": "./r/t/87-0.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Saboteur",
        "nameZh": "破坏专家",
        "desc": "Damaging a tower reduces its damage dealt by 50% for 3 seconds.",
        "descZh": "攻击一座防御塔，使其造成的伤害降低50%，持续3秒。",
        "icon": "./r/t/87-1.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Sunder Armor",
        "nameZh": "破甲攻击",
        "desc": "Damaging an Armored enemy removes their Armor.",
        "descZh": "伤害一个有护甲的敌人，并移除其护甲。",
        "icon": "./r/t/87-2.png",
        "pvpRec": "",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "攻城专精",
        "value": "双倍拆迁破坏"
      },
      {
        "label": "突击移速",
        "value": "全游最快梯队"
      },
      {
        "label": "攻击间隔",
        "value": "1.8秒"
      }
    ],
    "talentNoteZh": "上场专打偷塔与攻城，首选【毁灭专注】专注拆建筑大幅提效；面对喷火巨龙塔等强力防御塔时【破坏者】减攻效果极佳；【破甲】偏废。",
    "officialQuote": "骑乘嗜血座狼的战歌骑兵，狂风般的掠夺者根本不屑与杂兵纠缠，眼中只有敌方的要塞大门！",
    "skill": {
      "nameZh": "嗜血狼骑攻城突刺",
      "descZh": "骑乘巨狼的极速攻城先锋。无视途中所有地面杂兵，以极高速度全速奔袭敌方防御塔和基地，造成双倍攻城伤害。"
    }
  },
  {
    "slug": "whelp-eggs",
    "shortId": 88,
    "name": "Whelp Eggs",
    "nameZh": "雏龙蛋",
    "type": "Troop",
    "families": [
      "Blackrock"
    ],
    "cost": 3,
    "health": 130,
    "damage": 110,
    "dps": 61.1,
    "speed": "Med-Fast",
    "traits": [
      "Elemental",
      "Unbound",
      "Hatching",
      "Flying",
      "Squad"
    ],
    "img": "./r/m/88.png",
    "tiers": {
      "pvp": "A",
      "pvpChange": "",
      "pve": "S",
      "pveChange": "",
      "overall": "A",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Flame Burst",
        "nameZh": "烈焰爆发",
        "desc": "Damage nearby enemies when hatching.",
        "descZh": "孵化时会伤害附近的敌人。",
        "icon": "./r/t/88-0.png",
        "pvpRec": "gold",
        "pveRec": "gold",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Rookery",
        "nameZh": "龙巢",
        "desc": "When one egg hatches, the others hatch immediately.",
        "descZh": "当其中1个蛋孵化时，其它蛋也会立即孵化。",
        "icon": "./r/t/88-1.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Chromatic Plating",
        "nameZh": "多彩渐层",
        "desc": "Eggs gain Taunt.",
        "descZh": "雏龙蛋获得嘲讽。",
        "icon": "./r/t/88-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "编制数量",
        "value": "3枚龙蛋"
      },
      {
        "label": "孵化形态",
        "value": "3只喷火飞行雏龙"
      },
      {
        "label": "部署方式",
        "value": "全图空投"
      }
    ],
    "talentNoteZh": "即便历经削弱，【爆裂烈焰】依然是全模式唯一首选：破蛋瞬间范围爆伤直接清光周边低血杂兵兼蹭塔血；【孵蛋场】反而让龙崽扎堆更易被 AoE 秒杀，【多彩护甲】次要。",
    "officialQuote": "沉睡在黑龙巢穴的坚硬龙蛋，一旦被鲁莽的外力惊扰，破壳而出的烈焰将焚尽一切！",
    "skill": {
      "nameZh": "孵化破壳吐息",
      "descZh": "空投部署 3 枚黑龙蛋。受到敌方攻击或被外力踩碎时立刻破壳孵化为 3 只飞行雏龙，向地面敌人喷吐炙热龙息。"
    }
  },
  {
    "slug": "witch-doctor",
    "shortId": 89,
    "name": "Witch Doctor",
    "nameZh": "巫医",
    "type": "Troop",
    "families": [
      "Horde"
    ],
    "cost": 2,
    "health": 300,
    "damage": 118,
    "dps": 90,
    "speed": "Medium",
    "traits": [
      "Cycle",
      "Elemental",
      "Ranged",
      "AoE"
    ],
    "img": "./r/m/89.png",
    "tiers": {
      "pvp": "A",
      "pvpChange": "down",
      "pve": "S",
      "pveChange": "",
      "overall": "S",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Alchemist",
        "nameZh": "炼金师",
        "desc": "Periodically drop a potion, granting Bloodlust to the first ally who touches it.",
        "descZh": "周期性掉落一瓶药水，使第一个触碰到的盟友获得狂热。",
        "icon": "./r/t/89-0.png",
        "pvpRec": "bronze",
        "pveRec": "",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Amplify Curse",
        "nameZh": "增效诅咒",
        "desc": "Enemies killed by the Curse explosion also explode.",
        "descZh": "被诅咒爆炸消灭的敌人也会爆炸。",
        "icon": "./r/t/89-1.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": false
      },
      {
        "name": "Spirit Ward",
        "nameZh": "灵魂结界",
        "desc": "On kill, grant a shield to nearby allies, absorbing the next hit against them.",
        "descZh": "消灭时会为附近的盟友施加一个护盾，吸收其受到的下一次攻击。",
        "icon": "./r/t/89-2.png",
        "pvpRec": "gold",
        "pveRec": "silver",
        "codeIndex": 2,
        "codeVerified": true
      }
    ],
    "statsExtra": [
      {
        "label": "尸爆特性",
        "value": "被杀目标自爆伤周围"
      },
      {
        "label": "攻击射程",
        "value": "7.5码"
      },
      {
        "label": "攻击间隔",
        "value": "1.4秒"
      }
    ],
    "tierDelta": {
      "pvp": "down"
    },
    "talentNoteZh": "当前百搭 2 费神卡！必先选【精神结界】：击杀小兵即刻为周围全部友军套上一层挡伤护盾，团战保核神技；PvE 海量怪波次可考虑【诅咒增效】；【炼金术士】不如结界泛用。",
    "officialQuote": "挥舞仪式骨杖的巨魔暗影医者，致命的引渡光束会让垂死的敌人成为炸裂全场的死亡炸弹！",
    "skill": {
      "nameZh": "诅咒光束与剧毒护盾",
      "descZh": "极低消耗（2 费）的远程法术大师。持续向敌人引导诅咒光束，被诅咒击杀的敌兵会发生剧烈尸爆波及周围同伴。"
    }
  },
  {
    "slug": "worgen",
    "shortId": 90,
    "name": "Worgen",
    "nameZh": "狼人",
    "type": "Troop",
    "families": [
      "Alliance"
    ],
    "cost": 3,
    "health": 340,
    "damage": 130,
    "dps": 162.5,
    "speed": "Med-Fast",
    "traits": [
      "Unbound",
      "Stealth",
      "Ambush",
      "Melee",
      "One-Target"
    ],
    "img": "./r/m/90.png",
    "tiers": {
      "pvp": "C",
      "pvpChange": "up",
      "pve": "B",
      "pveChange": "",
      "overall": "C",
      "overallChange": ""
    },
    "talents": [
      {
        "name": "Premeditation",
        "nameZh": "预谋",
        "desc": "Increase Ambush damage by 50%.",
        "descZh": "伏击伤害提高50%。",
        "icon": "./r/t/90-0.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Lone Wolf",
        "nameZh": "孤狼",
        "desc": "On deploy, grant +1 gold if no allies are nearby.",
        "descZh": "部署时如果附近没有盟友，获得+1黄金。",
        "icon": "./r/t/90-1.png",
        "pvpRec": "bronze",
        "pveRec": "bronze",
        "codeIndex": 0,
        "codeVerified": false
      },
      {
        "name": "Frenzy",
        "nameZh": "狂乱",
        "desc": "On kill, gain Bloodlust for 10 seconds.",
        "descZh": "死亡时获得嗜血，持续10秒。",
        "icon": "./r/t/90-2.png",
        "pvpRec": "",
        "pveRec": "",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "statsExtra": [
      {
        "label": "伏击机制",
        "value": "破隐一击双倍暴伤"
      },
      {
        "label": "部署方式",
        "value": "全图空投"
      },
      {
        "label": "隐身特性",
        "value": "脱战保持潜行"
      }
    ],
    "tierDelta": {
      "pvp": "up"
    },
    "talentNoteZh": "空投后排刺客。首推【预谋】潜行伏击打出毁灭第一刀秒后排；【独狼】仅用于单吃宝箱与抓矿工；【狂暴】往往打出一杀后便阵亡很难叠起来。",
    "officialQuote": "潜藏在暗夜阴影中的吉尔尼斯孤狼，一旦破隐暴起，撕咬利爪足以在弹指间让施法者身首异处！",
    "skill": {
      "nameZh": "暗影伏击利爪",
      "descZh": "具备“空投”与“潜行”特性的致命刺客。从虚空中破隐而出对首个目标施展伏击双倍暴击，瞬间秒杀敌方脆弱后排。"
    }
  },
  {
    "slug": "ysera",
    "shortId": 91,
    "name": "Ysera",
    "nameZh": "伊瑟拉",
    "type": "Leader",
    "families": [
      "Cenarion"
    ],
    "cost": 3,
    "health": 0,
    "damage": 0,
    "dps": 0,
    "speed": "",
    "traits": [
      "Elemental",
      "Cycle",
      "Poisonous",
      "Flying",
      "AoE"
    ],
    "img": "./r/m/91.png",
    "tiers": {
      "pvp": "S",
      "pvpChange": "up",
      "pve": "A",
      "pveChange": "",
      "overall": "A",
      "overallChange": "up"
    },
    "talents": [
      {
        "name": "Recurring Dream",
        "nameZh": "重现之梦",
        "desc": "Ysera Minis are twice as likely to show up in hand.",
        "descZh": "伊瑟拉专属梦境卡出现在手牌中的概率翻倍。",
        "icon": "./r/t/91-0.png",
        "pvpRec": "silver",
        "pveRec": "silver",
        "codeIndex": 0,
        "codeVerified": true
      },
      {
        "name": "Corrupted Dream",
        "nameZh": "腐化之梦",
        "desc": "Emerald Whelps and Emerald Drake apply twice as much poison.",
        "descZh": "翡翠雏龙与翡翠幼龙施加双倍层数的中毒。",
        "icon": "./r/t/91-1.png",
        "pvpRec": "bronze",
        "pveRec": "silver",
        "codeIndex": 1,
        "codeVerified": true
      },
      {
        "name": "Shared Dream",
        "nameZh": "共入梦境",
        "desc": "Hibernate applies to all enemies on the board.",
        "descZh": "休眠效果同时作用于场上的所有敌人。",
        "icon": "./r/t/91-2.png",
        "pvpRec": "silver",
        "pveRec": "bronze",
        "codeIndex": 2,
        "codeVerified": false
      }
    ],
    "leaderAbility": {
      "name": "Stuck in the Emerald Dream, Ysera cannot be played, but adds unique Emerald Minis into your army.",
      "nameZh": "翡翠梦境",
      "descZh": "伊瑟拉自身无法直接上场，但会向你的手牌库注入 4 张强力梦境卡牌：激活（回费）、翡翠雏龙群、休眠与翡翠幼龙。"
    },
    "tierDelta": {
      "pvp": "up",
      "overall": "up"
    },
    "talentNoteZh": "必先买【重现梦境】：让伊瑟拉强力翡翠法术的登场循环频次直接翻倍；PvP 推进/攻城向带【共享梦境】群体催眠守卫让石像鬼或大巨魔直接拆主基地；PvE 纯叠毒爆发（雏龙普攻叠 2 层毒）则选【腐化梦境】。",
    "officialQuote": "沉睡的绿龙女王于翡翠梦境中俯瞰凡世，虽不直接登场，却源源不断向手牌输送梦境秘宝。",
    "skill": {
      "nameZh": "翡翠梦境",
      "descZh": "伊瑟拉自身无法直接上场，但会向你的手牌库注入 4 张强力梦境卡牌：激活（回费）、翡翠雏龙群、休眠与翡翠幼龙。"
    },
    "statsExtra": [
      {
        "label": "登场机制",
        "value": "不登场，置入梦境卡"
      },
      {
        "label": "梦境卡池",
        "value": "激活/幼龙/雏龙/休眠"
      },
      {
        "label": "抽卡增益",
        "value": "轮转自动补充"
      }
    ]
  }
];
