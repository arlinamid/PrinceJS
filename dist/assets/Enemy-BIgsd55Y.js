PrinceJS.Enemy = function (t, e, i, s, h, r, o, n, a) {
  (this.baseCharName = n),
    n === "guard" && (n = "guard-" + o),
    PrinceJS.Fighter.call(this, t, e, i, s, h, n, n === "shadow" ? "shadow" : "fighter"),
    (this.id = a),
    (this.charX += s * 7),
    (this.strikeProbability = PrinceJS.Utils.applyStrength(PrinceJS.Enemy.STRIKE_PROBABILITY[r])),
    (this.restrikeProbability = PrinceJS.Utils.applyStrength(PrinceJS.Enemy.RESTRIKE_PROBABILITY[r])),
    (this.blockProbability = PrinceJS.Utils.applyStrength(PrinceJS.Enemy.BLOCK_PROBABILITY[r])),
    (this.impairblockProbability = PrinceJS.Utils.applyStrength(PrinceJS.Enemy.IMPAIRBLOCK_PROBABILITY[r])),
    (this.advanceProbability = PrinceJS.Utils.applyStrength(PrinceJS.Enemy.ADVANCE_PROBABILITY[r])),
    (this.refracTimer = 0),
    (this.blockTimer = 0),
    (this.strikeTimer = 0),
    (this.lookBelow = !1),
    (this.startFight = !1),
    (this.health = PrinceJS.Enemy.EXTRA_STRENGTH[r] + PrinceJS.Enemy.STRENGTH[this.level.number]),
    (this.charSkill = r),
    (this.charColor = o),
    this.onDamageLife.add(this.resetRefracTimer, this),
    this.onStrikeBlocked.add(this.resetBlockTimer, this),
    this.onEnemyStrike.add(this.resetStrikeTimer, this),
    this.charColor > 0 && this.tintSplash(PrinceJS.Enemy.COLOR[this.charColor - 1]);
};
PrinceJS.Enemy.STRIKE_PROBABILITY = [61, 100, 61, 61, 61, 40, 100, 150, 0, 48, 32, 48];
PrinceJS.Enemy.RESTRIKE_PROBABILITY = [0, 0, 0, 5, 5, 175, 16, 8, 0, 255, 255, 150];
PrinceJS.Enemy.BLOCK_PROBABILITY = [0, 150, 150, 200, 200, 255, 200, 250, 0, 255, 255, 255];
PrinceJS.Enemy.IMPAIRBLOCK_PROBABILITY = [0, 61, 61, 100, 100, 145, 100, 250, 0, 145, 255, 175];
PrinceJS.Enemy.ADVANCE_PROBABILITY = [255, 200, 200, 200, 255, 255, 200, 0, 0, 255, 100, 100];
PrinceJS.Enemy.REFRAC_TIMER = [16, 16, 16, 16, 8, 8, 8, 8, 0, 8, 0, 0];
PrinceJS.Enemy.EXTRA_STRENGTH = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
PrinceJS.Enemy.STRENGTH = [4, 3, 3, 3, 3, 4, 5, 4, 4, 5, 5, 5, 4, 6, 10, 0];
PrinceJS.Enemy.COLOR = [4755708, 11022336, 16535552, 823296, 5898492, 13129980, 16579584];
PrinceJS.Enemy.prototype = Object.create(PrinceJS.Fighter.prototype);
PrinceJS.Enemy.prototype.constructor = PrinceJS.Enemy;
PrinceJS.Enemy.prototype.updateActor = function () {
  this.updateSplash(),
    this.updateBehaviour(),
    this.processCommand(),
    this.updateAcceleration(),
    this.updateVelocity(),
    this.checkFight(),
    this.checkSpikes(),
    this.checkChoppers(),
    this.checkBarrier(),
    this.checkButton(),
    this.checkFloor(),
    this.checkRoomChange(),
    this.updateCharPosition(),
    this.updateSwordPosition(),
    this.maskAndCrop();
};
PrinceJS.Enemy.prototype.CMD_TAP = function (t) {
  this.charName !== "shadow" ||
    !this.visible ||
    ["softLand"].includes(this.action) ||
    (t.p1 === 1 ? this.game.sound.play("Footsteps") : t.p1 === 2 && this.game.sound.play("BumpIntoWallHard"));
};
PrinceJS.Enemy.prototype.updateBehaviour = function () {
  if (
    this.opponent === null ||
    !this.alive ||
    !this.opponent.alive ||
    (this.willStartFight() &&
      PrinceJS.Utils.delayed(
        () => {
          this.willStartFight() && (this.startFight = !0);
        },
        this.baseCharName === "jaffar" ? 2300 : 500
      ),
    this.refracTimer > 0 && this.refracTimer--,
    this.blockTimer > 0 && this.blockTimer--,
    this.strikeTimer > 0 && this.strikeTimer--,
    this.action === "stabbed" || this.action === "stabkill" || this.action === "dropdead" || this.action === "stepfall")
  )
    return;
  let t = this.opponentDistance();
  t !== -999 &&
    (this.swordDrawn
      ? t >= 35
        ? this.oppTooFar(t)
        : t < -20
        ? this.turnengarde()
        : t < 12
        ? this.oppTooClose(t)
        : this.oppInRange(t)
      : (this.canReachOpponent(this.lookBelow) || this.canSeeOpponent(this.lookBelow)) &&
        (!this.sneakUp || this.facingOpponent()) &&
        this.engarde());
};
PrinceJS.Enemy.prototype.willStartFight = function () {
  return (
    this.active &&
    !this.startFight &&
    (this.opponentCloseRoom(this.opponent, this.room) || Math.abs(this.opponentDistance()) < 35)
  );
};
PrinceJS.Enemy.prototype.enemyAdvance = function () {
  if (!this.startFight) return;
  if (!this.canReachOpponent(this.lookBelow) && !this.canSeeOpponent(this.lookBelow)) {
    (this.swordDrawn = !1), this.stand();
    return;
  }
  if (
    this.level.getTileAt(this.charBlockX, this.charBlockY, this.room).isSpace() &&
    !["advance", "retreat", "strike"].includes(this.action)
  ) {
    this.startFall();
    return;
  }
  let e = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room),
    i = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY, this.room);
  this.canWalkSafely(e, !0) ? this.advance() : this.canWalkSafely(i) && this.retreat();
};
PrinceJS.Enemy.prototype.canWalkSafely = function (t, e = !1) {
  return t.isSafeWalkable()
    ? !0
    : e && t.isSpace() && t.roomY < 2 && this.opponent.charBlockY === t.roomY + 1
    ? ((t = this.level.getTileAt(t.roomX, t.roomY + 1, t.room)), t.isSafeWalkable())
    : !1;
};
PrinceJS.Enemy.prototype.engarde = function () {
  this.hasSword && this.startFight && ((this.lookBelow = !0), PrinceJS.Fighter.prototype.engarde.call(this));
};
PrinceJS.Enemy.prototype.retreat = function () {
  if (!this.canReachOpponent(this.lookBelow) || this.nearBarrier(this.charBlockX, this.charBlockY, !0)) return;
  if (
    (this.opponent.opponent || (this.opponent.opponent = this),
    !this.action.includes("turn") &&
      !this.opponent.action.includes("turn") &&
      !this.facingOpponent() &&
      this.charFace === this.opponent.charFace &&
      this.opponentOnSameLevel())
  ) {
    this.turnengarde();
    return;
  }
  let t = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY, this.room);
  this.canWalkSafely(t) && PrinceJS.Fighter.prototype.retreat.call(this);
};
PrinceJS.Enemy.prototype.advance = function () {
  if (!this.canReachOpponent(this.lookBelow) || this.nearBarrier(this.charBlockX, this.charBlockY, !0)) return;
  this.opponent.opponent || (this.opponent.opponent = this);
  let t = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room),
    e = this.level.getTileAt(this.charBlockX + 2 * this.charFace, this.charBlockY, this.room);
  this.canWalkSafely(t, !0) &&
    (!this.opponent.isHanging() || this.canWalkSafely(e, !0)) &&
    PrinceJS.Fighter.prototype.advance.call(this);
};
PrinceJS.Enemy.prototype.oppTooFar = function (t) {
  if (this.refracTimer === 0) {
    if (this.opponent.action === "running" && t < 40) {
      this.strike();
      return;
    }
    if (this.opponent.action === "runjump" && t < 50) {
      this.strike();
      return;
    }
    this.enemyAdvance();
  }
};
PrinceJS.Enemy.prototype.oppTooClose = function () {
  this.charFace === this.opponent.charFace || !["engarde", "advance", "retreat"].includes(this.opponent.action)
    ? this.retreat()
    : this.advance();
};
PrinceJS.Enemy.prototype.oppInRange = function (t) {
  this.opponent.swordDrawn
    ? this.oppInRangeArmed(t)
    : this.refracTimer === 0 && (t <= 25 ? this.strike() : this.advance());
};
PrinceJS.Enemy.prototype.oppInRangeArmed = function (t) {
  this.opponentOnSameLevel() &&
    (t < 10 || t >= 28
      ? this.tryAdvance()
      : (this.tryBlock(), this.refracTimer === 0 && (t < 12 ? this.tryAdvance() : this.tryStrike())));
};
PrinceJS.Enemy.prototype.tryAdvance = function () {
  (this.charSkill === 0 || this.strikeTimer === 0) &&
    this.advanceProbability > this.game.rnd.between(0, 254) &&
    this.advance();
};
PrinceJS.Enemy.prototype.tryBlock = function () {
  (this.opponent.frameID(152, 153) ||
    this.opponent.frameID(162) ||
    this.opponent.frameID(2, 3) ||
    this.opponent.frameID(12)) &&
    (this.blockTimer !== 0
      ? this.impairblockProbability > this.game.rnd.between(0, 254) && this.block()
      : this.blockProbability > this.game.rnd.between(0, 254) && this.block());
};
PrinceJS.Enemy.prototype.tryStrike = function () {
  this.opponent.frameID(169) ||
    this.opponent.frameID(151) ||
    this.opponent.frameID(19) ||
    this.opponent.frameID(1) ||
    (this.frameID(150)
      ? this.restrikeProbability > this.game.rnd.between(0, 254) && this.strike()
      : this.strikeProbability > this.game.rnd.between(0, 254) && this.strike());
};
PrinceJS.Enemy.prototype.resetRefracTimer = function () {
  this.refracTimer = PrinceJS.Enemy.REFRAC_TIMER[this.charSkill];
};
PrinceJS.Enemy.prototype.resetBlockTimer = function () {
  this.blockTimer = 4;
};
PrinceJS.Enemy.prototype.resetStrikeTimer = function () {
  this.strikeTimer = 15;
};
PrinceJS.Enemy.prototype.fastsheathe = function () {
  this.charName === "shadow" && (this.setInactive(), (this.action = "fastsheathe"), (this.swordDrawn = !1));
};
PrinceJS.Enemy.prototype.setVisible = function () {
  (this.visible = !0), (this.sword.visible = !0);
};
PrinceJS.Enemy.prototype.setInvisible = function () {
  (this.visible = !1), (this.sword.visible = !1);
};
PrinceJS.Enemy.prototype.setActive = function () {
  this.setVisible(), (this.active = !0), this.charName === "skeleton" && (this.action = "arise");
};
PrinceJS.Enemy.prototype.setInactive = function () {
  (this.active = !1), (this.startFight = !1), this.charName === "skeleton" && (this.action = "laydown");
};
PrinceJS.Enemy.prototype.checkBarrier = function () {
  if (!this.alive || this.charName === "shadow" || ["stand", "turn", "stepfall", "freefall"].includes(this.action))
    return;
  let t = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
  if (this.moveR() && t.isBarrier()) t.intersects(this.getCharBounds()) && this.bump(t);
  else {
    let e = PrinceJS.Utils.convertXtoBlockX(this.charX + this.charFdx * this.charFace - 12),
      i = this.level.getTileAt(e, this.charBlockY, this.room);
    if (i.isBarrier())
      switch (i.element) {
        case PrinceJS.Level.TILE_WALL:
          this.bump(i);
          break;
        case PrinceJS.Level.TILE_GATE:
        case PrinceJS.Level.TILE_TAPESTRY:
        case PrinceJS.Level.TILE_TAPESTRY_TOP:
          i.intersects(this.getCharBounds()) && this.bump(i);
          break;
      }
  }
};
PrinceJS.Enemy.prototype.bump = function (t) {
  this.moveR()
    ? (this.charX -= 2)
    : this.moveL()
    ? (this.charX += 10)
    : (this.charX += 5 * (this.centerX > t.centerX ? 1 : -1)),
    this.updateBlockXY(),
    (this.action = "bump");
};
PrinceJS.Enemy.prototype.appearOutOfMirror = function (t) {
  (this.charX = PrinceJS.Utils.convertBlockXtoX(t.roomX) + 20),
    (this.charY = PrinceJS.Utils.convertBlockYtoY(t.roomY) - 14),
    (this.action = "runjumpdown"),
    (this.charFrame = 42),
    this.updateBlockXY(),
    this.updateCharPosition(),
    this.processCommand(),
    this.setVisible();
};
