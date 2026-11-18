import { ONYXIA_METHOD_GUIDE } from './onyxia-guide.js';

export const USER_DEFAULT_THRALL_CODE = 'rumblo:CF8QABoECBwQABoECFUQAhoECEYQABoECEQQAhoECE8QABoECDEQAg==';

export const PRESET_DECKS = [
  {
    id: 'preset-thrall-default',
    nameZh: '萨尔 · 部落元素强力默认队',
    badge: '默认强推',
    author: '玩家指定主力',
    code: USER_DEFAULT_THRALL_CODE,
    descZh: '萨尔（图腾掌握）领衔，暗矛巨魔对空点杀、炎术师+染病农夫超远AOE叠毒清蛋、秃鹫+小蜘蛛极速轮转。',
  },
  {
    id: 'preset-onyxia-drakkisath',
    nameZh: ONYXIA_METHOD_GUIDE.builds[0].nameZh,
    badge: 'S级开荒',
    author: '奥妮推荐 #1',
    code: ONYXIA_METHOD_GUIDE.builds[0].code,
    descZh: '达基萨斯多彩龙鳞赋予全队元素抗性，幼龙塔下埋蛋转阶段秒抢塔，迪菲亚盗贼控宝箱拉满经济。',
  },
  {
    id: 'preset-onyxia-ragnaros',
    nameZh: ONYXIA_METHOD_GUIDE.builds[1].nameZh,
    badge: 'S级守塔',
    author: '奥妮推荐 #2',
    code: ONYXIA_METHOD_GUIDE.builds[1].code,
    descZh: '拉格纳罗斯附体要塞与防御塔提供护甲和烈焰脉冲，熔核巨人顶前线，狮鹫骑士与女祭司远程收割。',
  },
  {
    id: 'preset-onyxia-arthas-ice',
    nameZh: ONYXIA_METHOD_GUIDE.builds[2].nameZh,
    badge: 'S级控场',
    author: '奥妮推荐 #3',
    code: ONYXIA_METHOD_GUIDE.builds[2].code,
    descZh: '阿尔萨斯死亡之握+冰霜光环控场，骷髅小队守护仪式转阶段击退幸存夺塔，农夫南瓜剧毒稳削Boss血量。',
  },
  {
    id: 'preset-onyxia-arthas-poison',
    nameZh: ONYXIA_METHOD_GUIDE.builds[3].nameZh,
    badge: 'S级速推',
    author: '奥妮推荐 #4',
    code: ONYXIA_METHOD_GUIDE.builds[3].code,
    descZh: '低费高效循环，农夫飞溅南瓜与剧毒巨魔叠加海量剧毒，配合女祭司真言术护盾与巫医结界强斩杀黑龙。',
  },
];

export const DIFFICULTY_LEVELS = [
  {
    id: 'practice',
    nameZh: '练习模式',
    subtitle: '我方 +2 级压制 (×1.21)',
    playerLevelDelta: 2,
    enemyLevelDelta: 0,
    badge: '轻松体验',
  },
  {
    id: 'standard',
    nameZh: '标准同级',
    subtitle: '双方公平 1 级基准 (×1.00)',
    playerLevelDelta: 0,
    enemyLevelDelta: 0,
    badge: '原汁原味',
  },
  {
    id: 'mythic',
    nameZh: '终局越级',
    subtitle: '黑龙 +2 级压迫 (×1.21)',
    playerLevelDelta: 0,
    enemyLevelDelta: 2,
    badge: '极限开荒',
  },
];

export function getDifficultyById(id) {
  return DIFFICULTY_LEVELS.find((d) => d.id === id) || DIFFICULTY_LEVELS[1];
}
