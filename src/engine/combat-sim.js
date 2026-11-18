import { createRng, shuffleWithRng } from './rng.js';
import {
  INITIAL_CHESTS,
  INITIAL_MINES,
  INITIAL_STRUCTURES,
  INITIAL_SWITCHES,
  MAP_HEIGHT,
  MAP_WIDTH,
  WAYPOINT_NODES,
  clampToArena,
  dist2D,
  isValidDeployPosition,
  pickInitialNodeId,
  resolveNextNodeId,
} from './onyxia-map.js';
import { getLevelMultiplier, getUnitCombatSpec, resolveMiniSprite } from './unit-stats.js';
import {
  applyDeployEffects,
  canAttackTarget,
  castSpell,
  computeDamage,
  handleAttackHitEffects,
  tickUnitSpecialsAndAuras,
} from './unit-behaviors.js';
import { createOnyxiaBoss, getNextEggCountdown, tickOnyxiaBoss } from './onyxia-boss.js';
import { createOnyxiaAiState, tickOnyxiaAi } from './onyxia-ai.js';

export const TICK_DT = 0.05; // 20 Hz deterministic simulation
export const REGULATION_DURATION = 360; // 6:00
export const OVERTIME_DURATION = 120; // 2:00
export const TOTAL_MATCH_DURATION = REGULATION_DURATION + OVERTIME_DURATION;

export class CombatSimulation {
  constructor(options = {}) {
    const {
      deck,
      playerLevelDelta = 0,
      enemyLevelDelta = 0,
      seed = 20261118,
    } = options;

    if (!deck || !deck.leader || !Array.isArray(deck.troops) || deck.troops.length !== 6) {
      throw new Error('CombatSimulation requires a valid deck with 1 leader and 6 troops.');
    }

    this.seed = seed;
    this.rng = createRng(seed);
    this.playerLevelDelta = playerLevelDelta;
    this.enemyLevelDelta = enemyLevelDelta;
    this._nextEntityId = 1;

    this.elapsedTime = 0;
    this.inOvertime = false;
    this.finished = false;
    this.victory = false;
    this.defeatReason = '';

    this.playerGold = 4.0;
    this.maxGold = 10.0;
    this.baseGoldPerSec = 0.65;

    // 8-card cycle: 1 leader + 6 troops + 1 kobold-miner
    const rawCards = [
      { slug: deck.leader.slug, talentIndex: deck.leader.talentIndex ?? 0 },
      ...deck.troops.map((t) => ({ slug: t.slug, talentIndex: t.talentIndex ?? 0 })),
      { slug: 'kobold-miner', talentIndex: 0 },
    ];
    const shuffled = shuffleWithRng(rawCards, this.rng);
    this.hand = shuffled.slice(0, 4);
    this.nextCard = shuffled[4];
    this.deckQueue = shuffled.slice(5);

    this.structures = INITIAL_STRUCTURES.map((s) => ({
      ...s,
      hp: s.maxHp,
      alive: true,
      isStructure: true,
      rebuilding: false,
      rebuildTimer: 0,
      attackCooldown: 0.5,
      ragnarosShield: 0,
      ragnarosMaxShield: 0,
    }));

    this.mines = INITIAL_MINES.map((m) => ({ ...m }));
    this.chests = INITIAL_CHESTS.map((c) => ({ ...c, isChest: true }));
    this.switches = structuredClone(INITIAL_SWITCHES);

    this.boss = createOnyxiaBoss(enemyLevelDelta);
    this.ai = createOnyxiaAiState();

    this.units = [];
    this.projectiles = [];
    this.totems = [];
    this.activeSpells = [];
    this.fx = [];
    this.floatingTexts = [];
    this.audioQueue = [];

    this.banner = { text: '奥妮克希亚的巢穴 · 战斗开始！抢占中塔与金矿！', timer: 3.5 };
    this.shakeTimer = 0;
    this.shakeIntensity = 0;

    this.damageStats = new Map(); // slug -> { slug, nameZh, sprite, totalDamage }
    this.cardsPlayed = 0;
  }

  nextId() {
    return this._nextEntityId++;
  }

  getLevelDelta(team) {
    return team === 'player' ? this.playerLevelDelta : this.enemyLevelDelta;
  }

  getLevelMultiplier(team) {
    return getLevelMultiplier(this.getLevelDelta(team));
  }

  emitAudio(eventName) {
    this.audioQueue.push(eventName);
    if (this.audioQueue.length > 16) this.audioQueue.shift();
  }

  addFx(fx) {
    this.fx.push({
      id: `fx-${this.nextId()}`,
      age: 0,
      duration: fx.duration || 0.4,
      ...fx,
    });
  }

  addFloatingText(x, y, text, color = '#fde047') {
    this.floatingTexts.push({
      id: `txt-${this.nextId()}`,
      x,
      y,
      text,
      color,
      age: 0,
      duration: 0.9,
    });
  }

  setBanner(text, duration = 3.0) {
    this.banner = { text, timer: duration };
  }

  triggerShake(duration = 0.6, intensity = 0.5) {
    this.shakeTimer = Math.max(this.shakeTimer, duration);
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
  }

  recordDamage(sourceSlug, sourceTeam, amount) {
    if (sourceTeam !== 'player' || amount <= 0 || !sourceSlug) return;
    let entry = this.damageStats.get(sourceSlug);
    if (!entry) {
      let nameZh = sourceSlug;
      try {
        nameZh = getUnitCombatSpec(sourceSlug, 0, 0).nameZh;
      } catch {
        // fallback
      }
      entry = {
        slug: sourceSlug,
        nameZh,
        sprite: resolveMiniSprite(sourceSlug),
        totalDamage: 0,
      };
      this.damageStats.set(sourceSlug, entry);
    }
    entry.totalDamage += Math.round(amount);
  }

  toggleSwitch(switchId) {
    const sw = this.switches[switchId];
    if (!sw) return null;
    sw.dir = sw.dir === 'left' ? 'right' : 'left';
    this.emitAudio('switch');
    return sw.dir;
  }

  getHandCardSpec(slotIndex) {
    const card = this.hand[slotIndex];
    if (!card) return null;
    return getUnitCombatSpec(card.slug, card.talentIndex, this.playerLevelDelta);
  }

  canDeployCard(slotIndex, x, y) {
    if (this.finished) return { valid: false, reason: '战斗已结束' };
    const spec = this.getHandCardSpec(slotIndex);
    if (!spec) return { valid: false, reason: '无效手牌槽位' };
    if (this.playerGold < spec.cost) return { valid: false, reason: `黄金不足（需要 ${spec.cost} 金）` };
    return isValidDeployPosition(x, y, spec, this);
  }

  deployCard(slotIndex, x, y) {
    const check = this.canDeployCard(slotIndex, x, y);
    if (!check.valid) return { ok: false, reason: check.reason };

    const card = this.hand[slotIndex];
    const spec = this.getHandCardSpec(slotIndex);

    this.playerGold = Math.max(0, this.playerGold - spec.cost);
    this.cardsPlayed += 1;

    // Cycle hand slot -> nextCard -> deckQueue
    this.deckQueue.push(card);
    this.hand[slotIndex] = this.nextCard;
    this.nextCard = this.deckQueue.shift();

    this.emitAudio('deploy');

    if (spec.isSpell) {
      castSpell(this, 'player', spec, x, y);
      return { ok: true, slug: spec.slug };
    }

    if (spec.slug === 'whelp-eggs') {
      const offsets = [
        { ox: -0.9, oy: 0.4 },
        { ox: 0.9, oy: 0.4 },
        { ox: 0, oy: -0.8 },
      ];
      for (const { ox, oy } of offsets) {
        const p = clampToArena(x + ox, y + oy);
        this.spawnFriendlyEgg('player', p.x, p.y, spec.hp);
      }
      return { ok: true, slug: spec.slug };
    }

    if (spec.slug === 'mountaineer' && spec.squad?.members) {
      const scale = this.getLevelMultiplier('player');
      const [bear, hunter] = spec.squad.members;
      const bearSpec = {
        ...spec,
        nameZh: bear.nameZh,
        hp: Math.round(bear.hp * scale),
        damage: Math.round(bear.dmg * scale),
        range: bear.range,
        attackInterval: bear.attackInterval,
        isArmored: true,
        isRanged: false,
      };
      const hunterSpec = {
        ...spec,
        nameZh: hunter.nameZh,
        hp: Math.round(hunter.hp * scale),
        damage: Math.round(hunter.dmg * scale),
        range: hunter.range,
        attackInterval: hunter.attackInterval,
        isArmored: false,
        isRanged: true,
      };
      this.spawnUnitFromSpec(bearSpec, 'player', x, y - 0.6);
      this.spawnUnitFromSpec(hunterSpec, 'player', x, y + 0.9);
      return { ok: true, slug: spec.slug };
    }

    const count = spec.count || 1;
    for (let i = 0; i < count; i++) {
      const angle = (i / Math.max(1, count)) * Math.PI * 2;
      const ox = count > 1 ? Math.cos(angle) * 0.95 : 0;
      const oy = count > 1 ? Math.sin(angle) * 0.75 : 0;
      const pos = clampToArena(x + ox, y + oy);
      this.spawnUnitFromSpec(spec, 'player', pos.x, pos.y);
    }
    return { ok: true, slug: spec.slug };
  }

  spawnFriendlyEgg(team, x, y, hp = 35) {
    const eggSpec = getUnitCombatSpec('whelp-eggs', 0, this.getLevelDelta(team));
    return this.spawnUnitFromSpec(eggSpec, team, x, y, {
      hp,
      maxHp: hp,
      stationary: true,
      isEgg: true,
      hatchTimer: 9.0,
      hatchOnHit: true,
      hatchCount: 1,
      hatchSlug: 'player-whelp',
    });
  }

  spawnUnitFromSpec(spec, team, x, y, overrides = {}) {
    const pos = clampToArena(x, y);
    const unit = {
      id: `u-${this.nextId()}`,
      slug: spec.slug,
      spec,
      team,
      talentIndex: spec.talentIndex ?? 0,
      x: pos.x,
      y: pos.y,
      radius: spec.isLeader ? 0.95 : spec.weight === 'heavy' ? 0.9 : 0.65,
      hp: overrides.hp ?? spec.hp,
      maxHp: overrides.maxHp ?? spec.hp,
      damage: overrides.damage ?? spec.damage,
      range: overrides.range ?? spec.range,
      attackInterval: spec.attackInterval || 1.5,
      attackCooldown: 0.2,
      splashRadius: spec.splashRadius || 0,
      speed: overrides.stationary ? 0 : spec.speed,
      stationary: Boolean(overrides.stationary ?? spec.stationary),
      weight: spec.weight || 'medium',
      alive: true,
      isFlying: Boolean(spec.isFlying),
      isRanged: Boolean(spec.isRanged),
      isBombard: Boolean(spec.isBombard),
      isSiegeOnly: Boolean(spec.isSiegeOnly),
      isSiegeDamage: Boolean(spec.isSiegeDamage),
      isDetect: Boolean(spec.isDetect),
      isUnstoppable: Boolean(spec.isUnstoppable),
      isNullify: Boolean(spec.traits?.includes('Nullify')),
      hasVulnerable: Boolean(spec.traits?.includes('Vulnerable')),
      baseArmored: Boolean(spec.isArmored),
      baseResistant: Boolean(spec.isResistant),
      hasArmored: Boolean(spec.isArmored),
      hasResistant: Boolean(spec.isResistant),
      stealthActive: Boolean(spec.isStealth),
      nodeId: overrides.nodeId ?? pickInitialNodeId(pos.x, pos.y, team),
      isEgg: Boolean(overrides.isEgg),
      hatchTimer: overrides.hatchTimer ?? 0,
      hatchOnHit: Boolean(overrides.hatchOnHit),
      hatchCount: overrides.hatchCount ?? 1,
      hatchSlug: overrides.hatchSlug ?? null,
      hatchNow: false,
      miningTargetId: null,
      miningProgress: 0,
      outOfCombatTimer: 0,
      poisonStacks: 0,
      poisonTimer: 0,
      burnTimer: 0,
      frostTimer: 0,
      stunTimer: 0,
      polymorphTimer: 0,
      bloodlustTimer: 0,
      cheatDeathTimer: 0,
      invulnTimer: 0,
      elementalVulnTimer: 0,
      shieldOneHit: false,
      auraDamageMult: 1.0,
      auraAtkSpeedMult: 1.0,
      auraMoveSpeedMult: 1.0,
      hitFlashTimer: 0,
      rebirthUsed: false,
      firstStrikeDone: false,
    };

    this.units.push(unit);
    applyDeployEffects(unit, this);
    return unit;
  }

  getAllAttackableTargets(attackerTeam) {
    const list = [];
    for (const u of this.units) {
      if (u.alive && u.team !== attackerTeam) list.push(u);
    }
    for (const s of this.structures) {
      if (s.team !== attackerTeam && s.hp > 0 && !s.rebuilding) list.push(s);
    }
    if (attackerTeam === 'player' && this.boss && this.boss.alive) {
      list.push(this.boss);
    }
    return list;
  }

  findClosestTarget(x, y, attackerTeam, maxRange = Infinity, canHitFlying = true) {
    let best = null;
    let bestDist = maxRange;
    for (const u of this.units) {
      if (!u.alive || u.team === attackerTeam) continue;
      if (!canHitFlying && u.isFlying) continue;
      const d = dist2D(x, y, u.x, u.y);
      if (d <= bestDist) {
        bestDist = d;
        best = u;
      }
    }
    return best;
  }

  healUnit(unit, amount) {
    if (!unit || !unit.alive || amount <= 0) return;
    unit.hp = Math.min(unit.maxHp, unit.hp + amount);
  }

  applyDamage(target, rawDamage, options = {}) {
    if (!target || (target.hp <= 0 && !target.isStructure && !target.isBoss)) return 0;
    if (target.isStructure && (target.hp <= 0 || target.rebuilding)) return 0;
    if (target.isBoss && !target.alive) return 0;

    // One-hit Shield (Witch Doctor Spirit Ward)
    if (target.shieldOneHit) {
      target.shieldOneHit = false;
      this.addFloatingText(target.x, target.y - 1.0, '护盾吸收', '#93c5fd');
      return 0;
    }

    const dmg = computeDamage(rawDamage, options, target);
    if (dmg <= 0) return 0;

    // Friendly egg hatches immediately when hit (do not die without hatching!)
    if (target.isEgg && target.hatchOnHit && target.team === 'player') {
      target.hatchNow = true;
      target.hitFlashTimer = 0.14;
      return 0;
    }

    target.hitFlashTimer = 0.14;
    if (target.outOfCombatTimer !== undefined) target.outOfCombatTimer = 0;

    // Structure Ragnaros shield absorbs first
    let remainingDmg = dmg;
    if (target.isStructure && target.ragnarosShield > 0) {
      const absorbed = Math.min(target.ragnarosShield, remainingDmg);
      target.ragnarosShield -= absorbed;
      remainingDmg -= absorbed;
    }

    target.hp -= remainingDmg;
    this.recordDamage(options.sourceSlug, options.sourceTeam, dmg);

    if (target.isBoss || dmg >= 140) {
      this.addFloatingText(target.x + this.rng.range(-0.6, 0.6), target.y - 1.2, `-${dmg}`, options.damageKind === 'elemental' ? '#38bdf8' : '#fca5a5');
    }

    if (target.hp <= 0) {
      if (target.isChest) {
        target.hp = 0;
        target.alive = false;
        target.respawnTimer = target.respawnInterval;
        const killerBonus = options.sourceSlug === 'defias-bandits' ? 2 : 0;
        const totalReward = target.reward + killerBonus;
        if (options.sourceTeam === 'player') {
          this.playerGold = Math.min(this.maxGold, this.playerGold + totalReward);
          this.addFloatingText(target.x, target.y - 1.0, `+${totalReward} 金币`, '#facc15');
          this.emitAudio('gold');
        } else if (options.sourceTeam === 'enemy' && this.boss) {
          this.boss.gold = Math.min(10, this.boss.gold + totalReward);
        }
        return dmg;
      }

      if (target.isBoss) {
        target.hp = 0;
        target.alive = false;
        this.finished = true;
        this.victory = true;
        this.addFx({ kind: 'explosion', x: target.x, y: target.y, radius: 7.5, color: '#facc15', duration: 1.2 });
        this.emitAudio('victory');
        return dmg;
      }

      if (target.isStructure) {
        if (target.id === 'player-base') {
          target.hp = 0;
          target.alive = false;
          this.finished = true;
          this.victory = false;
          this.defeatReason = '联盟主基地被摧毁';
          this.emitAudio('defeat');
          return dmg;
        }
        // Tower flips ownership after 2.5s rebuild
        target.hp = 0;
        target.rebuilding = true;
        target.rebuildTimer = 2.5;
        target.team = options.sourceTeam === 'player' ? 'player' : 'enemy';
        this.addFx({ kind: 'explosion', x: target.x, y: target.y, radius: 4.5, color: target.team === 'player' ? '#38bdf8' : '#ef4444', duration: 0.7 });
        this.emitAudio('tower');
        return dmg;
      }

      // Cheat Death / Arthas Purgatory / Harvest Golem / Cairne Rebirth
      if (target.cheatDeathTimer > 0) {
        target.hp = 1;
        return dmg;
      }
      if (target.spec?.slug === 'arthas' && target.talentIndex === 2 && !target.rebirthUsed) {
        target.rebirthUsed = true;
        target.hp = Math.max(1, Math.round(target.maxHp * 0.25));
        target.invulnTimer = 3.0;
        this.addFx({ kind: 'ring', x: target.x, y: target.y, radius: 2.5, color: '#60a5fa', duration: 0.5 });
        return dmg;
      }
      if ((target.spec?.slug === 'harvest-golem' || target.spec?.slug === 'cairne-bloodhoof') && !target.rebirthUsed) {
        target.rebirthUsed = true;
        target.hp = Math.round(target.maxHp * 0.5);
        this.addFx({ kind: 'ring', x: target.x, y: target.y, radius: 2.2, color: '#a3e635', duration: 0.45 });
        return dmg;
      }

      target.hp = 0;
      target.alive = false;

      // Vultures Carrion split on nearby enemy death
      for (const v of this.units) {
        if (v.alive && v.team !== target.team && v.spec?.slug === 'vultures' && dist2D(v.x, v.y, target.x, target.y) <= 5.5) {
          if (!v.carrionUsedCount || v.carrionUsedCount < 2) {
            v.carrionUsedCount = (v.carrionUsedCount || 0) + 1;
            this.spawnUnitFromSpec(v.spec, v.team, target.x, target.y, { nodeId: v.nodeId });
            break;
          }
        }
      }
    }

    return dmg;
  }

  dealAreaDamage(x, y, radius, baseDamage, options = {}) {
    const {
      team = 'player',
      damageKind = 'elemental',
      isSiege = false,
      sourceSlug = 'aoe',
      canHitFlying = true,
      applyBurn = false,
      customFilter = null,
    } = options;

    for (const u of this.units) {
      if (!u.alive || u.team === team) continue;
      if (!canHitFlying && u.isFlying) continue;
      if (customFilter && !customFilter(u)) continue;
      if (dist2D(x, y, u.x, u.y) <= radius + (u.radius || 0.5)) {
        const d = this.applyDamage(u, baseDamage, { damageKind, isSiege, sourceSlug, sourceTeam: team });
        if (applyBurn && d > 0 && u.alive && !u.isNullify) {
          u.burnTimer = 6.0;
          u.burnSourceSlug = sourceSlug;
          u.burnSourceTeam = team;
        }
      }
    }
    for (const s of this.structures) {
      if (s.team === team || s.hp <= 0 || s.rebuilding) continue;
      if (dist2D(x, y, s.x, s.y) <= radius + s.radius) {
        this.applyDamage(s, baseDamage, { damageKind, isSiege, sourceSlug, sourceTeam: team });
      }
    }
    if (team === 'player' && this.boss && this.boss.alive) {
      if (dist2D(x, y, this.boss.x, this.boss.y) <= radius + this.boss.radius) {
        this.applyDamage(this.boss, baseDamage, { damageKind, isSiege, sourceSlug, sourceTeam: team });
      }
    }
  }

  spawnProjectile(opts) {
    this.projectiles.push({
      id: `proj-${this.nextId()}`,
      x: opts.x,
      y: opts.y,
      target: opts.target,
      team: opts.team,
      damage: opts.damage,
      damageKind: opts.damageKind || 'physical',
      isSiege: Boolean(opts.isSiege),
      splashRadius: opts.splashRadius || 0,
      sourceSlug: opts.sourceSlug,
      attacker: opts.attacker || null,
      color: opts.color || '#fbbf24',
      speed: opts.speed || 15.0,
      knockback: opts.knockback || 0,
    });
  }

  step(dt = TICK_DT) {
    if (this.finished) return;

    this.elapsedTime += dt;
    if (!this.inOvertime && this.elapsedTime >= REGULATION_DURATION) {
      this.inOvertime = true;
      this.setBanner('加时赛（Overtime）开启：双方自然回金翻倍！全力斩杀！', 3.5);
      this.emitAudio('alert');
    }

    if (this.elapsedTime >= TOTAL_MATCH_DURATION) {
      this.finished = true;
      this.victory = false;
      this.defeatReason = '时间耗尽，未能击败奥妮克希亚';
      this.emitAudio('defeat');
      return;
    }

    // Gold regen
    const goldMult = this.inOvertime ? 2.0 : 1.0;
    this.playerGold = Math.min(this.maxGold, this.playerGold + this.baseGoldPerSec * goldMult * dt);

    // UI banners & shake decay
    if (this.banner.timer > 0) this.banner.timer = Math.max(0, this.banner.timer - dt);
    if (this.shakeTimer > 0) this.shakeTimer = Math.max(0, this.shakeTimer - dt);

    // Mines & Chests regeneration
    for (const m of this.mines) {
      if (m.gold < m.maxGold) {
        m.regenTimer += dt;
        if (m.regenTimer >= m.regenInterval) {
          m.regenTimer = 0;
          m.gold += 1;
        }
      }
    }
    for (const c of this.chests) {
      if (!c.alive) {
        c.respawnTimer -= dt;
        if (c.respawnTimer <= 0) {
          c.alive = true;
          c.hp = c.maxHp;
        }
      }
    }

    // Active continuous spells (e.g. Blizzard)
    for (let i = this.activeSpells.length - 1; i >= 0; i--) {
      const sp = this.activeSpells[i];
      sp.remaining -= dt;
      sp.tickTimer -= dt;
      if (sp.tickTimer <= 0) {
        sp.tickTimer = 0.5;
        for (const u of this.units) {
          if (u.alive && u.team !== sp.team && dist2D(sp.x, sp.y, u.x, u.y) <= sp.radius) {
            this.applyDamage(u, sp.dmgPerTick, { damageKind: 'elemental', sourceSlug: sp.slug, sourceTeam: sp.team });
            if (!u.isUnstoppable) u.frostTimer = Math.max(u.frostTimer || 0, 1.5);
          }
        }
        if (sp.team === 'player' && this.boss && this.boss.alive && dist2D(sp.x, sp.y, this.boss.x, this.boss.y) <= sp.radius + this.boss.radius) {
          this.applyDamage(this.boss, sp.dmgPerTick, { damageKind: 'elemental', sourceSlug: sp.slug, sourceTeam: sp.team });
        }
      }
      if (sp.remaining <= 0) this.activeSpells.splice(i, 1);
    }

    // Structures rebuild & attack
    for (const s of this.structures) {
      if (s.hitFlashTimer > 0) s.hitFlashTimer = Math.max(0, s.hitFlashTimer - dt);
      if (s.rebuilding) {
        s.rebuildTimer -= dt;
        if (s.rebuildTimer <= 0) {
          s.rebuilding = false;
          s.hp = s.maxHp;
          this.addFx({ kind: 'ring', x: s.x, y: s.y, radius: 4.5, color: s.team === 'player' ? '#38bdf8' : '#ef4444', duration: 0.5 });
        }
        continue;
      }
      if (s.hp <= 0) continue;
      s.attackCooldown -= dt;
      if (s.attackCooldown <= 0) {
        const target = this.findClosestTarget(s.x, s.y, s.team, s.range, true);
        if (target) {
          s.attackCooldown = s.attackInterval;
          this.spawnProjectile({
            x: s.x,
            y: s.y,
            target,
            team: s.team,
            damage: s.damage,
            damageKind: 'physical',
            splashRadius: s.splashRadius || 0,
            sourceSlug: s.team === 'player' ? 'player-tower' : 'enemy-tower',
            color: s.team === 'player' ? '#60a5fa' : '#f97316',
            speed: 17,
          });
        } else {
          s.attackCooldown = 0.2;
        }
      }
    }

    // Unit specials, auras, and Boss / AI
    tickUnitSpecialsAndAuras(this, dt);
    tickOnyxiaBoss(this, dt);
    tickOnyxiaAi(this, dt);

    // Tick status DoTs on units + boss
    this._tickStatuses(dt);

    // Update all units (eggs, miners, combat/movement)
    this._tickUnits(dt);

    // Update projectiles
    this._tickProjectiles(dt);

    // Cleanup dead units
    this.units = this.units.filter((u) => u.alive);

    // Decay FX & floating texts
    for (let i = this.fx.length - 1; i >= 0; i--) {
      this.fx[i].age += dt;
      if (this.fx[i].age >= this.fx[i].duration) this.fx.splice(i, 1);
    }
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      this.floatingTexts[i].age += dt;
      if (this.floatingTexts[i].age >= this.floatingTexts[i].duration) this.floatingTexts.splice(i, 1);
    }
  }

  _tickStatuses(dt) {
    const entities = [...this.units];
    if (this.boss && this.boss.alive) entities.push(this.boss);

    for (const e of entities) {
      if (!e.alive) continue;
      if (e.hitFlashTimer > 0) e.hitFlashTimer = Math.max(0, e.hitFlashTimer - dt);
      if (e.frostTimer > 0) e.frostTimer = Math.max(0, e.frostTimer - dt);
      if (e.stunTimer > 0) e.stunTimer = Math.max(0, e.stunTimer - dt);
      if (e.polymorphTimer > 0) e.polymorphTimer = Math.max(0, e.polymorphTimer - dt);
      if (e.bloodlustTimer > 0) e.bloodlustTimer = Math.max(0, e.bloodlustTimer - dt);
      if (e.cheatDeathTimer > 0) e.cheatDeathTimer = Math.max(0, e.cheatDeathTimer - dt);
      if (e.invulnTimer > 0) e.invulnTimer = Math.max(0, e.invulnTimer - dt);
      if (e.elementalVulnTimer > 0) e.elementalVulnTimer = Math.max(0, e.elementalVulnTimer - dt);

      if (e.poisonTimer > 0 && e.poisonStacks > 0) {
        e.poisonTimer -= dt;
        e.poisonTickAccum = (e.poisonTickAccum || 0) + dt;
        if (e.poisonTickAccum >= 0.5) {
          e.poisonTickAccum -= 0.5;
          const pDmg = e.poisonStacks * (e.poisonTickDmg || 12);
          this.applyDamage(e, pDmg, {
            damageKind: 'elemental',
            sourceSlug: e.poisonSourceSlug || 'poison',
            sourceTeam: e.poisonSourceTeam || 'player',
          });
        }
        if (e.poisonTimer <= 0) e.poisonStacks = 0;
      }

      if (e.burnTimer > 0) {
        e.burnTimer -= dt;
        e.burnTickAccum = (e.burnTickAccum || 0) + dt;
        if (e.burnTickAccum >= 0.5) {
          e.burnTickAccum -= 0.5;
          this.applyDamage(e, e.burnTickDmg || 22, {
            damageKind: 'elemental',
            sourceSlug: e.burnSourceSlug || 'burn',
            sourceTeam: e.burnSourceTeam || 'player',
          });
        }
      }
    }
  }

  _tickUnits(dt) {
    // Snapshot array because egg hatches can append units
    const snapshot = [...this.units];
    for (const u of snapshot) {
      if (!u.alive) continue;

      // Egg hatching logic
      if (u.isEgg) {
        u.hatchTimer -= dt;
        if (u.hatchNow || u.hatchTimer <= 0) {
          u.alive = false;
          u.hp = 0;
          const whelpSpec = getUnitCombatSpec(u.hatchSlug || 'onyxia-whelp', 0, this.getLevelDelta(u.team));
          for (let k = 0; k < (u.hatchCount || 1); k++) {
            const ox = (k - (u.hatchCount - 1) / 2) * 0.8;
            this.spawnUnitFromSpec(whelpSpec, u.team, u.x + ox, u.y);
          }
          this.addFx({ kind: 'ring', x: u.x, y: u.y, radius: 1.8, color: u.team === 'player' ? '#4ade80' : '#f97316', duration: 0.4 });
        }
        continue;
      }

      if (u.stunTimer > 0) continue;

      u.outOfCombatTimer = (u.outOfCombatTimer || 0) + dt;

      // Miner behavior
      if (u.spec?.isMiner) {
        const richMines = this.mines.filter((m) => m.gold > 0).sort((a, b) => dist2D(u.x, u.y, a.x, a.y) - dist2D(u.x, u.y, b.x, b.y));
        if (richMines.length > 0) {
          const mine = richMines[0];
          const d = dist2D(u.x, u.y, mine.x, mine.y);
          if (d <= 1.7) {
            u.miningProgress += dt;
            if (u.miningProgress >= 1.2) {
              u.miningProgress = 0;
              mine.gold = Math.max(0, mine.gold - 1);
              if (u.team === 'player') {
                this.playerGold = Math.min(this.maxGold, this.playerGold + 1);
                this.addFloatingText(mine.x, mine.y - 1.0, '+1 金币', '#facc15');
                this.emitAudio('gold');
              } else if (this.boss) {
                this.boss.gold = Math.min(10, this.boss.gold + 1);
              }
            }
            continue;
          } else {
            this._moveToward(u, mine.x, mine.y, dt);
            continue;
          }
        }
      }

      // Polymorphed units wander without attacking
      if (u.polymorphTimer > 0) {
        this._advanceAlongWaypoints(u, dt * 0.5);
        continue;
      }

      // Find best attack target
      const target = this._selectBestTarget(u);
      const effectiveRange = u.range + (target?.radius || 0.5);
      const dist = target ? dist2D(u.x, u.y, target.x, target.y) : Infinity;

      const atkSpeedMult = (u.frostTimer > 0 ? 0.65 : 1.0) * (u.bloodlustTimer > 0 ? 1.35 : 1.0) * (u.auraAtkSpeedMult || 1.0);
      u.attackCooldown = Math.max(0, u.attackCooldown - dt * atkSpeedMult);

      if (target && dist <= effectiveRange) {
        u.outOfCombatTimer = 0;
        if (u.attackCooldown <= 0) {
          u.attackCooldown = u.attackInterval;
          let rawDmg = Math.round(u.damage * (u.auraDamageMult || 1.0));
          if (u.stealthActive) rawDmg *= 2;
          if (u.spec?.slug === 'pyromancer' && u.talentIndex === 0 && !u.firstStrikeDone) rawDmg *= 3;
          if (u.spec?.slug === 'arthas' && target.frostTimer > 0) rawDmg = Math.round(rawDmg * 1.25);

          const damageKind = u.spec?.isElemental ? 'elemental' : 'physical';

          if (u.isRanged && u.range >= 3.2) {
            this.spawnProjectile({
              x: u.x,
              y: u.y,
              target,
              team: u.team,
              damage: rawDmg,
              damageKind,
              isSiege: u.isSiegeDamage,
              splashRadius: u.splashRadius,
              sourceSlug: u.slug,
              attacker: u,
              color: u.spec?.isPoisonous ? '#84cc16' : damageKind === 'elemental' ? '#38bdf8' : '#fde047',
              speed: 14.5,
              knockback: u.spec?.knockback || 0,
            });
          } else {
            if (u.splashRadius > 0) {
              this.dealAreaDamage(target.x, target.y, u.splashRadius, rawDmg, {
                team: u.team,
                damageKind,
                isSiege: u.isSiegeDamage,
                sourceSlug: u.slug,
                canHitFlying: u.isFlying,
              });
              this.addFx({ kind: 'ring', x: target.x, y: target.y, radius: u.splashRadius, color: damageKind === 'elemental' ? '#fb923c' : '#e2e8f0', duration: 0.25 });
            } else {
              const dealt = this.applyDamage(target, rawDmg, {
                damageKind,
                isSiege: u.isSiegeDamage,
                sourceSlug: u.slug,
                sourceTeam: u.team,
              });
              handleAttackHitEffects(this, u, target, dealt);
            }
          }
        }
      } else if (target && dist <= Math.max(6.8, effectiveRange + 2.5) && !u.stationary) {
        // Chase nearby aggro target
        this._moveToward(u, target.x, target.y, dt);
      } else if (!u.stationary) {
        this._advanceAlongWaypoints(u, dt);
      }
    }
  }

  _selectBestTarget(attacker) {
    const candidates = this.getAllAttackableTargets(attacker.team);
    // Ground non-flying, non-siege-only units can also break chests
    if (!attacker.isFlying && !attacker.isSiegeOnly) {
      for (const c of this.chests) {
        if (c.alive) candidates.push(c);
      }
    }

    let best = null;
    let bestScore = Infinity;
    for (const t of candidates) {
      if (!t.isChest && !canAttackTarget(attacker, t)) continue;
      if (t.isChest && (attacker.isFlying || attacker.isSiegeOnly)) continue;
      const d = dist2D(attacker.x, attacker.y, t.x, t.y) - (t.radius || 0.5);
      // Slight priority to units/chests right in front over distant structures
      const priorityBias = t.isChest ? -1.5 : 0;
      const score = d + priorityBias;
      if (score < bestScore) {
        bestScore = score;
        best = t;
      }
    }
    return best;
  }

  _moveToward(u, tx, ty, dt) {
    if (u.stationary || u.speed <= 0) return;
    const dx = tx - u.x;
    const dy = ty - u.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.05) return;

    const moveMult = (u.frostTimer > 0 ? 0.65 : 1.0) * (u.bloodlustTimer > 0 ? 1.35 : 1.0) * (u.auraMoveSpeedMult || 1.0);
    const stepDist = Math.min(dist, u.speed * moveMult * dt);
    const next = clampToArena(u.x + (dx / dist) * stepDist, u.y + (dy / dist) * stepDist);
    u.x = next.x;
    u.y = next.y;
  }

  _advanceAlongWaypoints(u, dt) {
    if (!u.nodeId) {
      u.nodeId = pickInitialNodeId(u.x, u.y, u.team);
    }
    const targetNode = WAYPOINT_NODES[u.nodeId];
    if (!targetNode) return;

    const d = dist2D(u.x, u.y, targetNode.x, targetNode.y);
    if (d <= 1.1) {
      const nextId = resolveNextNodeId(u.nodeId, u.team, this.switches);
      if (nextId) {
        u.nodeId = nextId;
      }
    }
    const node = WAYPOINT_NODES[u.nodeId];
    if (node) {
      this._moveToward(u, node.x, node.y, dt);
    }
  }

  _tickProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const tx = p.target?.x ?? p.x;
      const ty = p.target?.y ?? p.y;
      const dx = tx - p.x;
      const dy = ty - p.y;
      const dist = Math.hypot(dx, dy);
      const move = p.speed * dt;

      if (dist <= move + 0.45) {
        if (p.splashRadius > 0) {
          this.dealAreaDamage(tx, ty, p.splashRadius, p.damage, {
            team: p.team,
            damageKind: p.damageKind,
            isSiege: p.isSiege,
            sourceSlug: p.sourceSlug,
            canHitFlying: true,
          });
          this.addFx({ kind: 'explosion', x: tx, y: ty, radius: p.splashRadius, color: p.color, duration: 0.3 });
          if (p.target && p.attacker) {
            handleAttackHitEffects(this, p.attacker, p.target, p.damage);
          }
        } else if (p.target) {
          const dealt = this.applyDamage(p.target, p.damage, {
            damageKind: p.damageKind,
            isSiege: p.isSiege,
            sourceSlug: p.sourceSlug,
            sourceTeam: p.team,
          });
          if (p.knockback > 0 && p.target.alive && !p.target.isBoss && !p.target.isStructure) {
            const kDir = p.team === 'enemy' ? 1 : -1;
            const shifted = clampToArena(p.target.x, p.target.y + kDir * p.knockback);
            p.target.y = shifted.y;
          }
          if (p.attacker) {
            handleAttackHitEffects(this, p.attacker, p.target, dealt);
          }
        }
        this.projectiles.splice(i, 1);
      } else {
        p.x += (dx / dist) * move;
        p.y += (dy / dist) * move;
      }
    }
  }

  getHudSnapshot() {
    const remainingSec = this.inOvertime
      ? Math.max(0, TOTAL_MATCH_DURATION - this.elapsedTime)
      : Math.max(0, REGULATION_DURATION - this.elapsedTime);

    return {
      elapsedTime: this.elapsedTime,
      remainingSec,
      inOvertime: this.inOvertime,
      finished: this.finished,
      victory: this.victory,
      defeatReason: this.defeatReason,
      playerGold: this.playerGold,
      maxGold: this.maxGold,
      bossHp: this.boss.hp,
      bossMaxHp: this.boss.maxHp,
      bossHpPct: (this.boss.hp / this.boss.maxHp) * 100,
      bossPhase: this.boss.phase,
      bossResistant: this.boss.hasResistant,
      bossArmored: this.boss.hasArmored,
      nextEggSec: getNextEggCountdown(this.boss, this.elapsedTime),
      damageStats: Array.from(this.damageStats.values()).sort((a, b) => b.totalDamage - a.totalDamage),
    };
  }
}
