import { MINIS } from '../data/minis.js';

const BY_ID = new Map(MINIS.filter((m) => m.shortId != null).map((m) => [m.shortId, m]));
const BY_SLUG = new Map(MINIS.map((m) => [m.slug, m]));

function writeVarint(num, out) {
  let n = num >>> 0;
  while (n > 127) {
    out.push((n & 127) | 128);
    n >>>= 7;
  }
  out.push(n);
}

function readVarint(bytes, pos) {
  let value = 0;
  for (let shift = 0; shift < 35; shift += 7) {
    if (pos >= bytes.length) throw new Error('分享码数据截断');
    const b = bytes[pos++];
    value |= (b & 127) << shift;
    if ((b & 128) === 0) return [value >>> 0, pos];
  }
  throw new Error('分享码 Varint 格式异常');
}

function encodeMini(shortId, talentIndex) {
  const bytes = [];
  bytes.push(8);
  writeVarint(shortId, bytes);
  if (talentIndex !== null && talentIndex !== undefined) {
    bytes.push(16);
    writeVarint(talentIndex, bytes);
  }
  return bytes;
}

export function encodeRumblo({ leader, troops }) {
  const ld = BY_SLUG.get(leader?.slug);
  if (!ld || ld.type !== 'Leader' || ld.shortId == null) {
    throw new Error('请选择有效的 1 名主将');
  }
  if (!Array.isArray(troops) || troops.length !== 6) {
    throw new Error('卡组必须包含 6 名士兵或法术');
  }
  const seen = new Set();
  const out = [...encodeMini(ld.shortId, leader.talentIndex)];
  for (const item of troops) {
    const u = BY_SLUG.get(item?.slug);
    if (!u || u.type === 'Leader' || u.shortId == null) {
      throw new Error('存在无效的士兵或法术槽位');
    }
    if (seen.has(u.shortId)) {
      throw new Error(`卡组中存在重复棋子：${u.nameZh}`);
    }
    seen.add(u.shortId);
    const chunk = encodeMini(u.shortId, item.talentIndex);
    out.push(26);
    writeVarint(chunk.length, out);
    for (const b of chunk) out.push(b);
  }
  let bin = '';
  for (const b of out) bin += String.fromCharCode(b);
  return 'rumblo:' + btoa(bin);
}

export function decodeRumblo(rawCode) {
  const trimmed = String(rawCode || '').trim();
  if (!trimmed.startsWith('rumblo:')) {
    throw new Error('分享码必须以 rumblo: 开头');
  }
  const b64 = trimmed.slice(7).trim();
  if (!b64) throw new Error('分享码内容为空');
  let bin;
  try {
    bin = atob(b64);
  } catch {
    throw new Error('Base64 解码失败，请检查分享码是否完整');
  }
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

  let pos = 0;
  let leaderId = null;
  let leaderTalent = null;
  const troops = [];

  while (pos < bytes.length) {
    const [tag, p1] = readVarint(bytes, pos);
    pos = p1;
    if (tag === 8) {
      [leaderId, pos] = readVarint(bytes, pos);
    } else if (tag === 16) {
      [leaderTalent, pos] = readVarint(bytes, pos);
    } else if (tag === 26) {
      const [len, p2] = readVarint(bytes, pos);
      pos = p2;
      const end = pos + len;
      if (end > bytes.length) throw new Error('棋子字段长度越界');
      let mId = null;
      let mTalent = null;
      while (pos < end) {
        const [st, sp] = readVarint(bytes, pos);
        pos = sp;
        if (st === 8) [mId, pos] = readVarint(bytes, pos);
        else if (st === 16) [mTalent, pos] = readVarint(bytes, pos);
        else throw new Error('不支持的嵌套字段');
      }
      if (mId == null) throw new Error('缺少棋子 ID');
      const mini = BY_ID.get(mId);
      if (!mini) throw new Error(`未知棋子 ID: ${mId}`);
      troops.push({ slug: mini.slug, talentIndex: mTalent ?? 0 });
    } else {
      throw new Error('未知协议字段');
    }
  }

  const leaderMini = BY_ID.get(leaderId);
  if (!leaderMini) throw new Error(`未知主将 ID: ${leaderId}`);
  if (troops.length !== 6) throw new Error(`期望 6 名棋子，实际解码到 ${troops.length} 名`);

  const costs = [leaderMini.cost, ...troops.map((t) => BY_SLUG.get(t.slug)?.cost || 0)];
  const avgCost = Math.round((costs.reduce((a, b) => a + b, 0) / costs.length) * 10) / 10;

  return {
    leader: { slug: leaderMini.slug, talentIndex: leaderTalent ?? 0 },
    troops,
    avgCost,
  };
}
