// 奥妮克希亚巢穴终极首领攻略
export const ONYXIA_METHOD_GUIDE = {
  "title": "奥妮克希亚巢穴 (Onyxia's Lair)",
  "subtitle": "黑石之巅 · 终局终极挑战",
  "summary": "《魔兽大作战》单人固定终局首领战：奥妮克希亚 1 级基准生命 18,000（满级随出战等级缩放突破 100,000+），具备 12 码 180° 半场火焰吐息（2.5 秒间隔）与 70% / 40% 转阶段全图清场击退机制。",
  "mapImage": "./r/onyxia/onyxia-map.webp",
  "mapTitle": "奥妮克希亚巢穴作战行军地图",
  "mapHighlights": [
    "左右各有一座防御塔与高台，中路为开阔龙巢，直面黑龙公主本体；转阶段洞穴刷新【龙兽守卫（奥妮克希亚守卫）】与群聚龙蛋。",
    "奥妮克希亚射程 12 码、攻速 2.5 秒、180° 广角顺劈，仅携带射程天赋的绞肉车可在 12 码外安全输出。",
    "生命值降至 70% 与 40% 时触发全图击退并重置顶部防御塔，先后获得【抗性】与【护甲】特性。"
  ],
  "stats": {
    "name": "奥妮克希亚 (Onyxia)",
    "hp": "18,000（1 级基准，满级随等级突破 100,000+）",
    "damage": "火焰元素范围伤害（375 点 / 12 码 180° 扇形）",
    "range": "12.0 码（180° 半场吐息）",
    "attackSpeed": "2.5 秒",
    "traits": [
      "不可阻挡",
      "对空",
      "范围伤害",
      "P2抗性",
      "P3护甲"
    ]
  },
  "skills": [
    {
      "name": "烈焰龙息",
      "desc": "左、右双头交替向 12 码内 180° 半场扇形喷吐火焰吐息，1 级基准造成 375 点元素伤害，攻击间隔 2.5 秒。"
    },
    {
      "name": "洞穴落石",
      "desc": "70% 与 40% 转阶段及战斗期间引发 100 码落石轰击，对落点范围内建筑与单位造成 70 点攻城物理伤害。"
    },
    {
      "name": "全图深呼吸与巢穴护甲切换",
      "desc": "70% 进入 P2 获得【抗性】并从侧洞增援龙兽守卫与龙蛋；40% 进入 P3 获得【护甲】并强化高台全线反扑。"
    }
  ],
  "specialUnits": [
    {
      "name": "龙兽守卫",
      "hp": "2,800",
      "traits": [
        "抗性",
        "重击"
      ],
      "desc": "奥妮克希亚转阶段由两侧洞穴出战的黑石龙人精英（亦称奥妮克希亚守卫）：1 级基准生命 2,800，射程 9.0 码、攻击间隔 1.2 秒喷吐 120 点火焰溅射并附带击退。"
    },
    {
      "name": "守卫土元素",
      "hp": "1,175",
      "traits": [
        "护甲",
        "攻城伤害"
      ],
      "desc": "攻城向高护甲单位（1 级基准 1,175 生命值），只锁定防御塔与主基地发起 200% 攻城冲击。"
    },
    {
      "name": "雏龙蛋",
      "hp": "10（孵出雏龙群）",
      "traits": [
        "飞行",
        "孵化",
        "元素伤害"
      ],
      "desc": "奥妮克希亚定时在场地四周产下的龙蛋阵，受击或倒计时结束后孵出飞行雏龙围攻防线。"
    }
  ],
  "army": [
    {
      "slug": "drake",
      "nameZh": "幼龙",
      "talentNameZh": "龙母",
      "talentDescZh": "周期性召唤1枚雏龙蛋。"
    },
    {
      "slug": "gargoyle",
      "nameZh": "石像兽",
      "talentNameZh": "石翼雕像",
      "talentDescZh": "在空中受到伤害时化为石像恢复生命。"
    },
    {
      "slug": "gryphon-rider",
      "nameZh": "狮鹫骑士",
      "talentNameZh": "风暴之锤",
      "talentDescZh": "射程增加+3码。"
    },
    {
      "slug": "necromancer",
      "nameZh": "亡灵巫师",
      "talentNameZh": "死神之息",
      "talentDescZh": "死亡时召唤5只骷髅。"
    },
    {
      "slug": "spiderlings",
      "nameZh": "小蜘蛛",
      "talentNameZh": "涂毒",
      "talentDescZh": "造成的中毒伤害翻倍。"
    },
    {
      "slug": "warsong-grunts",
      "nameZh": "战歌步兵",
      "talentNameZh": "保持警戒",
      "talentDescZh": "留在部署位置，直到进入战斗，获得“护甲”且消耗的黄金减少1。"
    }
  ],
  "phases": [
    {
      "name": "第一阶段 (Phase 1: 100% → 70%)",
      "points": [
        "手牌控制机制：魔兽大作战的开局手牌随机种子与卡槽槽位绑定而非棋子本身。若起手卡手，可通过调整兵营中棋子槽位来更换完美起手手牌！",
        "雏龙蛋刷新时间表：第一波于 5:40 准时在左右路刷新，随后每 90 秒刷新一波（4:10, 2:40, 1:10，加时赛 1:40, 0:10）。若在刷新后 30 秒内未消灭，龙蛋将自动破壳孵化为成群雏龙！",
        "清蛋核心棋子：25级巫医可单清右路，26级可单清双路；育母幼龙和炎术师（带燃烧天赋）同样能瞬间清理大批龙蛋。",
        "控金稳推：用迪菲亚盗贼拿宝箱（+2金币），占领左右两座防御塔并控制金矿，将黑龙血量稳稳压至71%停手整备。"
      ]
    },
    {
      "name": "第二阶段 (Phase 2: 70% → 40%)",
      "points": [
        "全场清场与击退：转阶段瞬间奥妮克希亚击退所有棋子，并毁灭地图上半部分的所有单位，同时摧毁顶部两座防御塔！",
        "轻型棋子幸存技巧：击退距离由棋子重量决定。轻型棋子（如带寒冰仪式的骷髅小队、野猪人）会被击退到安全线外幸存，随后自动走回夺取防御塔！",
        "预埋龙蛋反抢塔：幼龙在塔下留下的龙蛋在转阶段时破壳，孵化出的雏龙可在塔未完全建立时立刻秒抢防御塔！",
        "首领抗性激活：黑龙公主获得【抗性】特性，受到的所有元素伤害降低50%。",
        "塌方机制：开局及每 50 秒刷新 4 只土元素全图突袭，派炎术师与防守主力定点清除。",
        "金币加速：黑龙金币收入提升至 0.3 金/秒（+50%）。务必将血量控制在接近加时赛（Overtime）前夕再压进P3！"
      ]
    },
    {
      "name": "第三阶段 (Phase 3: 40% → 0%)",
      "points": [
        "二次清场与双抗并存：再次触发全图清场并摧毁顶部双塔！奥妮克希亚获得【护甲】特性，同时保留P2的【抗性】（双抗并存，全伤害降低50%）！",
        "奥妮克希亚守卫降临：首领身旁召唤两名强大的【奥妮克希亚守卫】（2800基础生命值，抗性，120范围元素伤害，9码射程，1.4秒攻速）。",
        "守卫严禁会合：绝不能让两只守卫会合在中央防御塔造成范围伤害叠加！必须在左右两路分别拦截击杀。",
        "加时赛全力斩杀：黑龙收入翻倍至 0.4 金/秒。我方同样获得双倍金币，夺回顶部双塔后，利用瘟疫农夫南瓜毒素或暗矛巨魔高射速全力抢杀黑龙公主！"
      ]
    }
  ],
  "builds": [
    {
      "id": "onyxia-recommended-1",
      "nameZh": "达基萨斯将军 - 多彩龙鳞抗性推进流",
      "name": "达基萨斯将军 - 多彩龙鳞抗性推进流",
      "subCategory": "奥妮克希亚巢穴",
      "author": "首领推荐战队",
      "tier": "S",
      "avgCost": 3.3,
      "code": "rumblo:CCEQABoECCAQABoECEYQARoECEwQAhoECFkQAhoECB0QARoECEsQAg==",
      "leader": {
        "slug": "general-drakkisath",
        "nameZh": "达基萨斯将军",
        "talentNameZh": "多彩龙鳞",
        "talentDescZh": "赋予附近所有友军“抗性”特性。",
        "talentIndex": 0
      },
      "troops": [
        {
          "slug": "drake",
          "nameZh": "幼龙",
          "talentNameZh": "育母幼龙",
          "talentDescZh": "周期性在地面产下一枚龙蛋。",
          "talentIndex": 0
        },
        {
          "slug": "pyromancer",
          "nameZh": "炎术师",
          "talentNameZh": "燃烧",
          "talentDescZh": "火球溅射范围翻倍。",
          "talentIndex": 1
        },
        {
          "slug": "skeleton-party",
          "nameZh": "骷髅小队",
          "talentNameZh": "寒冰仪式",
          "talentDescZh": "召唤5名骷髅法师原地驻守部署位置。",
          "talentIndex": 2
        },
        {
          "slug": "witch-doctor",
          "nameZh": "巫医",
          "talentNameZh": "灵魂结界",
          "talentDescZh": "击杀敌人后为附近友军施加护盾，吸收下一次受到的攻击。",
          "talentIndex": 2
        },
        {
          "slug": "defias-bandits",
          "nameZh": "迪菲亚盗贼",
          "talentNameZh": "开锁大师",
          "talentDescZh": "开启宝箱时额外获得+2金币。",
          "talentIndex": 1
        },
        {
          "slug": "frostwolf-shaman",
          "nameZh": "霜狼萨满祭司",
          "talentNameZh": "大地之盾",
          "talentDescZh": "赋予附近一名友军护甲（拥有1次充能）。",
          "talentIndex": 2
        }
      ],
      "importantTalents": [
        "达基萨斯将军：【多彩龙鳞】赋予周围所有友军“抗性”，本场战斗充斥巨量元素伤害，抗性光环价值连城。",
        "幼龙：【育母幼龙】定期在顶部塔楼产下龙蛋，在P2和P3转阶段顶部清场后立刻破壳秒抢防御塔！",
        "炎术师：【燃烧】大幅增加火球溅射范围，能有效覆盖成群雏龙并穿透打击后排通灵师。",
        "骷髅小队：【寒冰仪式】召唤5名骷髅法师原地固守，是抵挡石像鬼与保护侧翼防线的核心。",
        "巫医：【灵魂结界】击杀敌人后为周围友军施加护盾，大幅提高前排与萨满的存活率。",
        "迪菲亚盗贼：【开锁大师】开启宝箱时额外获得+2金币，全场经济拉满的发动机。",
        "霜狼萨满祭司：【大地之盾】为达基萨斯将军套上物理护甲，形成同时拥有“护甲+抗性”的绝对免伤坦克！"
      ],
      "strategy": [
        "第一阶段 (P1)：抢下中央宝箱与左右金矿，迅速占领左右防御塔。幼龙在顶部塔产蛋备用。牢记雏龙蛋生成计时器（5:40, 4:10, 2:40, 1:10），用巫医或炎术师提前就位清蛋。",
        "第二阶段 (P2)：转阶段时顶部清场，预留的龙蛋破壳立刻夺回顶部防御塔。黑龙公主获得【抗性】，每50秒刷新4只土元素，派炎术师与防守部队就位。控血在加时赛（Overtime）前夕或刚进加时赛时压进P3！",
        "第三阶段 (P3)：再次清场夺塔，黑龙公主获得【护甲】并保留【抗性】（双抗降低50%伤害）。两侧各刷新一名奥妮克希亚守卫，绝不能让两名守卫在中路会合！分派达基萨斯带队在两侧分别击杀守卫，最后全军在加时赛双倍金币下全力斩杀黑龙公主！"
      ]
    },
    {
      "id": "onyxia-recommended-2",
      "nameZh": "拉格纳罗斯 - 熔核巨人护甲反伤流",
      "name": "拉格纳罗斯 - 熔核巨人护甲反伤流",
      "subCategory": "奥妮克希亚巢穴",
      "author": "首领推荐战队",
      "tier": "S",
      "avgCost": 3,
      "code": "rumblo:CEgQABoECEYQARoECB0QARoECFkQAhoECDEQABoECF0QARoECDsQAg==",
      "leader": {
        "slug": "ragnaros",
        "nameZh": "拉格纳罗斯",
        "talentNameZh": "耀眼烈焰",
        "talentDescZh": "你控制的建筑周期性对附近敌人造成火焰伤害。",
        "talentIndex": 0
      },
      "troops": [
        {
          "slug": "pyromancer",
          "nameZh": "炎术师",
          "talentNameZh": "燃烧",
          "talentDescZh": "火球溅射范围翻倍。",
          "talentIndex": 1
        },
        {
          "slug": "defias-bandits",
          "nameZh": "迪菲亚盗贼",
          "talentNameZh": "开锁大师",
          "talentDescZh": "开启宝箱时额外获得+2金币。",
          "talentIndex": 1
        },
        {
          "slug": "witch-doctor",
          "nameZh": "巫医",
          "talentNameZh": "灵魂结界",
          "talentDescZh": "击杀敌人后为附近友军施加护盾，吸收下一次受到的攻击。",
          "talentIndex": 2
        },
        {
          "slug": "gryphon-rider",
          "nameZh": "狮鹫骑士",
          "talentNameZh": "空投补给",
          "talentDescZh": "周期性空投药水，使首个触碰的友军等级+1。",
          "talentIndex": 0
        },
        {
          "slug": "priestess",
          "nameZh": "艾露恩女祭司",
          "talentNameZh": "强化恢复",
          "talentDescZh": "对友军施放恢复时，立即为其恢复10%最大生命值。",
          "talentIndex": 1
        },
        {
          "slug": "molten-giant",
          "nameZh": "熔核巨人",
          "talentNameZh": "振奋",
          "talentDescZh": "摧毁防御塔时恢复生命值并获得1金币。",
          "talentIndex": 2
        }
      ],
      "importantTalents": [
        "拉格纳罗斯：主将特效为主基地提供反伤护甲，主要起到防守托底作用。",
        "熔核巨人：【振奋】或【山岭之躯】是承受黑龙顺劈的主坦，配合萨满护甲极其肉。",
        "炎术师：【燃烧】火球大范围清场，对付塌方土元素与空中龙群。",
        "巫医：【灵魂结界】提供关键护盾吸收致命攻击。",
        "狮鹫骑士：【风暴之锤】+3射程让其在安全距离外输出黑龙与大型随从。",
        "艾露恩女祭司：【暗影之拥】隐形高额爆发，提供持续远程物理伤害。",
        "迪菲亚盗贼：【开锁大师】开箱控金。"
      ],
      "strategy": [
        "第一阶段 (P1)：控制双塔与宝箱，熔核巨人和萨满稳步推进，用巫医防守龙蛋刷新点。",
        "第二阶段 (P2)：双塔重置后立刻派空投部队夺回，利用熔核巨人吸收黑龙与土元素伤害，女祭司和狮鹫远程输出。",
        "第三阶段 (P3)：分兵处理两侧守卫，利用拉格纳罗斯的要塞反击防守漏怪，主力集中火力将黑龙击杀。"
      ]
    },
    {
      "id": "onyxia-recommended-3",
      "nameZh": "阿尔萨斯 - 霜冻仪式寒冰控场流",
      "name": "阿尔萨斯 - 霜冻仪式寒冰控场流",
      "subCategory": "奥妮克希亚巢穴",
      "author": "首领推荐战队",
      "tier": "S",
      "avgCost": 2.9,
      "code": "rumblo:CF4QAhoECEwQAhoECB0QARoECEYQABoECEQQAhoECFkQAhoECBwQAQ==",
      "leader": {
        "slug": "arthas",
        "nameZh": "阿尔萨斯",
        "talentNameZh": "炼狱",
        "talentDescZh": "死亡时进入3秒无敌；若复活后攻击的首个目标在此期间死亡，则以25%生命值重返战场。",
        "talentIndex": 2
      },
      "troops": [
        {
          "slug": "skeleton-party",
          "nameZh": "骷髅小队",
          "talentNameZh": "寒冰仪式",
          "talentDescZh": "召唤5名骷髅法师原地驻守部署位置。",
          "talentIndex": 2
        },
        {
          "slug": "defias-bandits",
          "nameZh": "迪菲亚盗贼",
          "talentNameZh": "开锁大师",
          "talentDescZh": "开启宝箱时额外获得+2金币。",
          "talentIndex": 1
        },
        {
          "slug": "pyromancer",
          "nameZh": "炎术师",
          "talentNameZh": "炎爆术",
          "talentDescZh": "首次攻击造成三倍伤害。",
          "talentIndex": 0
        },
        {
          "slug": "plague-farmer",
          "nameZh": "瘟疫农夫",
          "talentNameZh": "飞溅南瓜",
          "talentDescZh": "射程+1且溅射范围翻倍。",
          "talentIndex": 2
        },
        {
          "slug": "witch-doctor",
          "nameZh": "巫医",
          "talentNameZh": "灵魂结界",
          "talentDescZh": "击杀敌人后为附近友军施加护盾，吸收下一次受到的攻击。",
          "talentIndex": 2
        },
        {
          "slug": "darkspear-troll",
          "nameZh": "暗矛巨魔",
          "talentNameZh": "猎头者",
          "talentDescZh": "击杀敌人后攻击速度与移动速度提升10%，最多叠加至50%。",
          "talentIndex": 1
        }
      ],
      "importantTalents": [
        "阿尔萨斯：【死亡之握】将远程随从拉入近战并眩晕2秒，配合死疽瘟疫快速斩杀敌军。",
        "骷髅小队：【寒冰仪式】原地5名骷髅法师，转阶段前部署在顶部塔下，由于重量轻被击退后幸存走回夺塔！",
        "瘟疫农夫：【溅射南瓜】超远射程在安全距离外给黑龙公主叠满剧毒，毒素是削减其巨额血量的核心输出源。",
        "暗矛巨魔：【巫医毒药】或【快速射击】提供高额单体持续对空/对首领伤害。",
        "巫医：【灵魂结界】防空与清理雏龙群。",
        "炎术师：【燃烧】化解地面小怪与土元素。",
        "迪菲亚盗贼：【开锁大师】控金。"
      ],
      "strategy": [
        "第一阶段 (P1)：阿尔萨斯带队主攻一侧，骷髅小队带【寒冰仪式】守住另一侧塔，盗贼开箱。将黑龙控在76%血量，准备好部署骷髅小队。",
        "第二阶段 (P2)：转阶段清场前将骷髅小队部署在顶部塔正下方，击退后幸存走回重新占领双塔！农夫在塔后不断向黑龙投掷南瓜叠满剧毒。",
        "第三阶段 (P3)：两名守卫刷新，右侧派阿尔萨斯拦截，中塔派巨魔与农夫拦截左侧守卫。保持黑龙身上的毒素不断刷新，迅速击杀！"
      ]
    },
    {
      "id": "onyxia-recommended-4",
      "nameZh": "阿尔萨斯 - 纯毒素爆发速推流",
      "name": "阿尔萨斯 - 纯毒素爆发速推流",
      "subCategory": "奥妮克希亚巢穴",
      "author": "首领推荐战队",
      "tier": "S",
      "avgCost": 2.6,
      "code": "rumblo:CF4QAhoECEQQAhoECB0QARoECEYQABoECF0QAhoECFkQAhoECBwQAg==",
      "leader": {
        "slug": "arthas",
        "nameZh": "阿尔萨斯",
        "talentNameZh": "炼狱",
        "talentDescZh": "死亡时进入3秒无敌；若复活后攻击的首个目标在此期间死亡，则以25%生命值重返战场。",
        "talentIndex": 2
      },
      "troops": [
        {
          "slug": "plague-farmer",
          "nameZh": "瘟疫农夫",
          "talentNameZh": "飞溅南瓜",
          "talentDescZh": "射程+1且溅射范围翻倍。",
          "talentIndex": 2
        },
        {
          "slug": "defias-bandits",
          "nameZh": "迪菲亚盗贼",
          "talentNameZh": "开锁大师",
          "talentDescZh": "开启宝箱时额外获得+2金币。",
          "talentIndex": 1
        },
        {
          "slug": "pyromancer",
          "nameZh": "炎术师",
          "talentNameZh": "炎爆术",
          "talentDescZh": "首次攻击造成三倍伤害。",
          "talentIndex": 0
        },
        {
          "slug": "priestess",
          "nameZh": "艾露恩女祭司",
          "talentNameZh": "真言术：盾",
          "talentDescZh": "周期性为友军施加护盾，在2秒内吸收所有伤害。",
          "talentIndex": 2
        },
        {
          "slug": "witch-doctor",
          "nameZh": "巫医",
          "talentNameZh": "灵魂结界",
          "talentDescZh": "击杀敌人后为附近友军施加护盾，吸收下一次受到的攻击。",
          "talentIndex": 2
        },
        {
          "slug": "darkspear-troll",
          "nameZh": "暗矛巨魔",
          "talentNameZh": "毒蛇钉刺",
          "talentDescZh": "攻击获得“剧毒”特性。",
          "talentIndex": 2
        }
      ],
      "importantTalents": [
        "阿尔萨斯：【死亡之握】拉扯核心随从并集火。",
        "瘟疫农夫：【溅射南瓜】持续堆叠毒素伤害。",
        "艾露恩女祭司：提供强大的远程物理持续伤害。",
        "暗矛巨魔：核心单体输出，配合前排保护输出黑龙公主。",
        "炎术师：【燃烧】AOE清场。",
        "巫医：【灵魂结界】护盾保后排。",
        "迪菲亚盗贼：【开锁大师】经济核心。"
      ],
      "strategy": [
        "第一阶段 (P1)：稳扎稳打占领全图，控金并在塔下建立防御阵地。",
        "第二阶段 (P2)：依靠阿尔萨斯肉盾+女祭司+农夫稳健夺回双塔，清理土元素波次。",
        "第三阶段 (P3)：加时赛爆发大量金币，双路同时出兵牵制守卫，农夫和巨魔全力轰杀黑龙公主。"
      ]
    }
  ]
};
export const ONYXIA_GUIDE_DATA = ONYXIA_METHOD_GUIDE;
