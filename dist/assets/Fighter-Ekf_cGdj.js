PrinceJS.Fighter = function (t, e, i, s, h, o, r) {
  (this.level = e), (this.room = h), (this.charBlockX = i % 10), (this.charBlockY = Math.floor(i / 10));
  let n = PrinceJS.Utils.convertBlockXtoX(this.charBlockX),
    a = PrinceJS.Utils.convertBlockYtoY(this.charBlockY);
  PrinceJS.Actor.call(this, t, n, a, s, o, r),
    (this.charXVel = 0),
    (this.charYVel = 0),
    (this.actionCode = 1),
    (this.charSword = !0),
    (this.flee = !1),
    (this.allowAdvance = !0),
    (this.allowRetreat = !0),
    (this.allowBlock = !0),
    (this.allowStrike = !0),
    (this.inJumpUp = !1),
    (this.inFallDown = !1),
    (this.inFloat = !1),
    (this.inFloatTimeoutCancel = null),
    (this.fallingBlocks = 0),
    (this.swordFrame = 0),
    (this.swordDx = 0),
    (this.swordDy = 0),
    this.charName !== "skeleton" &&
      ((this.splash = this.game.make.sprite(0, 0, "general", (this.baseCharName || this.charName) + "-splash")),
      this.splash.anchor.set(0, 1),
      (this.splash.x = -6),
      (this.splash.y = -15),
      (this.splash.visible = !1),
      this.addChild(this.splash),
      (this.splashTimer = 0)),
    this.charName === "skeleton"
      ? (this.sword = this.game.make.sprite(0, 0, "sword"))
      : (this.sword = this.game.make.sprite(0, 0, "general")),
    (this.sword.scale.x *= -this.charFace),
    this.sword.anchor.setTo(0, 1),
    this.game.add.existing(this.sword),
    (this.hasSword = !0),
    (this.sword.z = 21),
    this.updateBase(),
    (this.swordAnims = this.game.cache.getJSON("sword-anims")),
    this.registerCommand(248, this.CMD_SETFALL),
    this.registerCommand(249, this.CMD_ACT),
    this.registerCommand(246, this.CMD_DIE),
    (this.opponent = null),
    (this.active = !0),
    (this.startFight = !0),
    (this.health = 3),
    (this.alive = !0),
    (this.swordDrawn = !1),
    (this.blocked = !1),
    (this.sneakUp = !0),
    (this.onInitLife = new Phaser.Signal()),
    (this.onDamageLife = new Phaser.Signal()),
    (this.onDead = new Phaser.Signal()),
    (this.onStrikeBlocked = new Phaser.Signal()),
    (this.onEnemyStrike = new Phaser.Signal()),
    (this.onChangeRoom = new Phaser.Signal());
};
PrinceJS.Fighter.GRAVITY = 3;
PrinceJS.Fighter.GRAVITY_FLOAT = 1;
PrinceJS.Fighter.TOP_SPEED = 33;
PrinceJS.Fighter.TOP_SPEED_FLOAT = 4;
PrinceJS.Fighter.prototype = Object.create(PrinceJS.Actor.prototype);
PrinceJS.Fighter.prototype.constructor = PrinceJS.Fighter;
PrinceJS.Fighter.prototype.CMD_SETFALL = function (t) {
  (this.charXVel = t.p1 * this.charFace), (this.charYVel = t.p2);
};
PrinceJS.Fighter.prototype.CMD_DIE = function (t) {
  (this.alive = !1),
    (this.swordDrawn = !1),
    this.showSplash(),
    this.proceedOnDead(),
    this.charName !== "kid" &&
      PrinceJS.Utils.delayed(() => {
        this.baseCharName === "jaffar"
          ? (this.game.sound.play("JaffarDead"), PrinceJS.Utils.flashWhiteVizierVictory(this.game))
          : this.baseCharName !== "shadow" && this.game.sound.play("Victory");
      }, 200);
};
PrinceJS.Fighter.prototype.CMD_ACT = function (t) {
  (this.actionCode = t.p1), t.p1 === 1 && ((this.charXVel = 0), (this.charYVel = 0));
};
PrinceJS.Fighter.prototype.CMD_FRAME = function (t) {
  (this.charFrame = t.p1),
    this.updateCharFrame(),
    this.updateSwordFrame(),
    this.updateBlockXY(),
    (this.processing = !1);
};
PrinceJS.Fighter.prototype.changeFace = function () {
  (this.charFace *= -1),
    (this.scale.x *= -1),
    (this.sword.scale.x *= -1),
    this.delegate && this.delegate.syncFace(this);
};
PrinceJS.Fighter.prototype.updateBase = function () {
  this.level.rooms[this.room] &&
    ((this.baseX = this.level.rooms[this.room].x * PrinceJS.ROOM_WIDTH),
    (this.baseY = this.level.rooms[this.room].y * PrinceJS.ROOM_HEIGHT + 3));
};
PrinceJS.Fighter.prototype.updateSwordFrame = function () {
  let t = this.anims.framedef[this.charFrame];
  if (((this.charSword = typeof t.fsword < "u"), this.charSword)) {
    let e = this.swordAnims.swordtab[t.fsword - 1];
    (this.swordFrame = e.id), (this.swordDx = e.dx), (this.swordDy = e.dy);
  }
};
PrinceJS.Fighter.prototype.updateBlockXY = function () {
  let t = this.charX + this.charFdx * this.charFace - this.charFfoot * this.charFace,
    e = this.charY + this.charFdy;
  this.charBlockX = PrinceJS.Utils.convertXtoBlockX(t);
  let i = this.charBlockY;
  if (
    ((this.charBlockY = Math.min(PrinceJS.Utils.convertYtoBlockY(e), 2)),
    this.updateFallingBlocks(this.charBlockY, i),
    !["climbup", "climbdown"].includes(this.action))
  ) {
    if (this.charBlockX < 0) {
      if (this.action === "highjump" && this.faceR()) return;
      if (this.level.rooms[this.room]) {
        let s = this.level.rooms[this.room].links.left;
        s > 0 &&
          ((this.charX += 140),
          (this.baseX -= 320),
          (this.charBlockX = 9),
          (this.room = s),
          this.charName === "kid" && this.onChangeRoom.dispatch(this.room, 0));
      }
    } else if (this.charBlockX > 9) {
      if (this.action === "highjump" && this.faceL()) return;
      if (this.level.rooms[this.room]) {
        let s = this.level.rooms[this.room].links.right;
        s > 0 &&
          ((this.charX -= 140),
          (this.baseX += 320),
          (this.charBlockX = 0),
          (this.room = s),
          this.charName === "kid" && this.onChangeRoom.dispatch(this.room, 0));
      }
    }
  }
};
PrinceJS.Fighter.prototype.updateFallingBlocks = function (t, e) {
  this.inFallDown &&
    t !== e &&
    (this.fallingBlocks++,
    this.charName === "kid" && this.fallingBlocks === 5 && this.game.sound.play("FallingFloorLands"));
};
PrinceJS.Fighter.prototype.updateActor = function () {
  this.updateSplash(),
    this.processCommand(),
    this.updateAcceleration(),
    this.updateVelocity(),
    this.checkFight(),
    this.checkRoomChange(),
    this.updateCharPosition(),
    this.updateSwordPosition(),
    this.maskAndCrop();
};
PrinceJS.Fighter.prototype.checkFight = function () {
  if (
    this.opponent === null ||
    (this.charName !== "kid" &&
      this.active &&
      this.action === "stand" &&
      this.isOpponentInSameRoom() &&
      !this.facingOpponent() &&
      this.x > 0 &&
      this.opponent.x > 0 &&
      Math.abs(this.x - this.opponent.x) >= 20 &&
      !(this.sneakUp && this.opponent.sneaks()) &&
      this.turn(),
    !this.startFight)
  )
    return;
  if (this.blocked && this.action !== "strike") {
    this.retreat(), this.processCommand(), (this.blocked = !1);
    return;
  }
  let t = this.opponentDistance();
  if (t !== -999)
    switch (this.action) {
      case "engarde":
        this.opponent.alive
          ? t < -4 &&
            (this.facingOpponent() || this.turnengarde(),
            this.opponent.opponent !== null && !this.opponent.facingOpponent() && this.opponent.turnengarde())
          : (this.sheathe(), (this.opponent = null));
        break;
      case "strike":
        if (
          this.charBlockY !== this.opponent.charBlockY ||
          this.opponent.action === "climbstairs" ||
          (!this.frameID(153, 154) && !this.frameID(3, 4))
        )
          return;
        if (!this.opponent.frameID(150) && !this.opponent.frameID(0)) {
          if (this.frameID(154) || this.frameID(4)) {
            let e = this.opponent.swordDrawn ? 12 : 8,
              i = 29 + (this.opponent.baseCharName === "fatguard" ? 2 : 0);
            (t >= e || t <= 0) && t <= i && this.opponent.stabbed();
          }
        } else
          this.charFrame !== "kid" && this.game.sound.play("SwordClash"),
            (this.opponent.blocked = !0),
            (this.action = "blockedstrike"),
            this.processCommand(),
            this.onStrikeBlocked.dispatch();
        break;
    }
};
PrinceJS.Fighter.prototype.updateSwordPosition = function () {
  this.charSword &&
    ((this.sword.frameName = "sword" + this.swordFrame),
    (this.sword.x = this.x + this.swordDx * this.charFace),
    (this.sword.y = this.y + this.swordDy)),
    (this.sword.visible = this.active && this.charSword);
};
PrinceJS.Fighter.prototype.opponentOnSameLevel = function () {
  return this.opponent && this.opponent.charBlockY === this.charBlockY;
};
PrinceJS.Fighter.prototype.opponentOnSameTile = function () {
  return this.opponent && this.charBlockX === this.opponent.charBlockX && this.charBlockY === this.opponent.charBlockY;
};
PrinceJS.Fighter.prototype.opponentOnSameTileBelow = function () {
  return (
    this.opponent && this.charBlockX === this.opponent.charBlockX && this.charBlockY + 1 === this.opponent.charBlockY
  );
};
PrinceJS.Fighter.prototype.opponentOnNextTileBelow = function () {
  return (
    this.opponent &&
    this.charBlockX + 1 === this.opponent.charBlockX &&
    this.charBlockY + 1 === this.opponent.charBlockY
  );
};
PrinceJS.Fighter.prototype.opponentDistance = function () {
  if (!this.opponentOnSameLevel()) return 999 * (this.canWalkOnNextTile() ? 1 : -1);
  let t = this.opponentInSameRoom(this.opponent, this.room),
    e = this.opponentNearRoomLeft(this.opponent, this.room, !0),
    i = this.opponentNearRoomRight(this.opponent, this.room, !0);
  if (!(t || e || i)) return 999;
  let s = 0;
  t || (e ? (s = -150 * this.charFace) : i && (s = 150 * this.charFace));
  let h = (this.opponent.charX - this.charX) * this.charFace;
  return h >= 0 && this.charFace !== this.opponent.charFace && (h += 13), h + s;
};
PrinceJS.Fighter.prototype.updateVelocity = function () {
  (this.charX += this.charXVel), (this.charY += this.charYVel);
};
PrinceJS.Fighter.prototype.updateAcceleration = function () {
  this.actionCode === 4 &&
    (this.inFloat
      ? ((this.charYVel += PrinceJS.Fighter.GRAVITY_FLOAT),
        this.charYVel > PrinceJS.Fighter.TOP_SPEED_FLOAT && (this.charYVel = PrinceJS.Fighter.TOP_SPEED_FLOAT))
      : ((this.charYVel += PrinceJS.Fighter.GRAVITY),
        this.charYVel > PrinceJS.Fighter.TOP_SPEED && (this.charYVel = PrinceJS.Fighter.TOP_SPEED)));
};
PrinceJS.Fighter.prototype.alignToFloor = function () {};
PrinceJS.Fighter.prototype.stand = function () {
  (this.action = "stand"), this.processCommand();
};
PrinceJS.Fighter.prototype.turn = function () {
  (this.action = "turn"), (this.charX -= this.charFace * 12), this.processCommand();
};
PrinceJS.Fighter.prototype.engarde = function () {
  return !this.hasSword || this.nearBarrier()
    ? !1
    : ((this.action = "engarde"),
      (this.swordDrawn = !0),
      (this.flee = !1),
      this.alignToFloor(),
      this.charName === "kid" && this.game.sound.play("UnsheatheSword"),
      this.onInitLife && this.onInitLife.dispatch(this),
      !0);
};
PrinceJS.Fighter.prototype.turnengarde = function () {
  if (
    !this.hasSword ||
    this.flee ||
    ["turnengarde"].includes(this.action) ||
    !["stand", "engarde", "advance", "retreat"].includes(this.action) ||
    !this.opponentOnSameLevel()
  )
    return;
  let t = this.charName === "kid" && this.action === "stand" && Math.abs(this.opponentDistance()) > 10;
  (this.action = (t ? "begin" : "") + "turnengarde"),
    !this.swordDrawn && this.charName === "kid" && this.game.sound.play("UnsheatheSword"),
    (this.swordDrawn = !0),
    this.alignToFloor();
};
PrinceJS.Fighter.prototype.sheathe = function () {
  this.swordDrawn && ((this.action = "resheathe"), (this.swordDrawn = !1), (this.flee = !1));
};
PrinceJS.Fighter.prototype.retreat = function () {
  (this.frameID(158) || this.frameID(170) || this.frameID(8) || this.frameID(20, 21)) &&
    ((this.action = "retreat"), (this.allowRetreat = !1));
};
PrinceJS.Fighter.prototype.advance = function () {
  if (this.action === "stand") {
    this.engarde();
    return;
  }
  (this.frameID(158) || this.frameID(171) || this.frameID(8) || this.frameID(20, 21)) &&
    ((this.action = "advance"), (this.allowAdvance = !1));
};
PrinceJS.Fighter.prototype.strike = function () {
  (!this.opponentOnSameLevel() && this.charName !== "kid") ||
    (this.charName === "kid" && this.frameID(157, 158) && this.game.sound.play("StabAir"),
    this.frameID(157, 158) ||
    this.frameID(165) ||
    this.frameID(170, 171) ||
    this.frameID(7, 8) ||
    this.frameID(20, 21) ||
    this.frameID(15)
      ? ((this.action = "strike"), (this.allowStrike = !1))
      : (this.frameID(150) || this.frameID(161) || this.frameID(0) || this.blocked) &&
        ((this.action = "blocktostrike"), (this.allowStrike = !1), (this.blocked = !1)),
    this.opponent.onEnemyStrike.dispatch());
};
PrinceJS.Fighter.prototype.block = function () {
  if (this.opponentOnSameLevel()) {
    if (this.frameID(8) || this.frameID(20, 21) || this.frameID(18) || this.frameID(15)) {
      if (this.opponentDistance() >= 32) return this.retreat();
      if (!this.opponent.frameID(152) && !this.opponent.frameID(2)) return;
      this.action = "block";
    } else {
      if (!this.frameID(17)) return;
      this.action = "striketoblock";
    }
    this.allowBlock = !1;
  }
};
PrinceJS.Fighter.prototype.stabbed = function () {
  this.alive &&
    (this.charName === "kid" ? this.game.sound.play("StabbedByOpponent") : this.game.sound.play("StabOpponent"),
    this.health !== 0 &&
      ((this.charY = PrinceJS.Utils.convertBlockYtoY(this.charBlockY)),
      this.charName !== "skeleton" && (this.charName === "kid" && !this.swordDrawn ? this.die() : this.damageLife()),
      this.health === 0 ? (this.action = "stabkill") : (this.action = "stabbed"),
      this.showSplash()));
};
PrinceJS.Fighter.prototype.bringAboveOpponent = function () {
  if (!this.opponent) return;
  let t = this.game.world,
    e = t.getIndex(this.opponent);
  e >= 0 && t.getIndex(this) < e && (t.remove(this, !1, !0), t.add(this, !0, e));
};
PrinceJS.Fighter.prototype.opponentNextRoom = function (t, e) {
  return this.opponentInSameRoom(t, e) || this.opponentInRoomLeft(t, e) || this.opponentInRoomRight(t, e);
};
PrinceJS.Fighter.prototype.opponentInSameRoom = function (t, e) {
  return t && t.room === e;
};
PrinceJS.Fighter.prototype.opponentInRoomLeft = function (t, e) {
  return this.level.rooms[e] && this.level.rooms[e].links.left > 0 && t && t.room === this.level.rooms[e].links.left;
};
PrinceJS.Fighter.prototype.opponentInRoomRight = function (t, e) {
  return this.level.rooms[e] && this.level.rooms[e].links.right > 0 && t && t.room === this.level.rooms[e].links.right;
};
PrinceJS.Fighter.prototype.opponentCloseRoom = function (t, e) {
  return (t && t.room === e) || this.opponentCloseRoomLeft(t, e) || this.opponentCloseRoomRight(t, e);
};
PrinceJS.Fighter.prototype.opponentCloseRoomLeft = function (t, e) {
  return (
    this.level.rooms[e] &&
    this.level.rooms[e].links.left > 0 &&
    t &&
    t.room === this.level.rooms[e].links.left &&
    t.charBlockX >= 9
  );
};
PrinceJS.Fighter.prototype.opponentCloseRoomRight = function (t, e) {
  return (
    this.level.rooms[e] &&
    this.level.rooms[e].links.right > 0 &&
    t &&
    t.room === this.level.rooms[e].links.right &&
    this.charBlockX >= 9
  );
};
PrinceJS.Fighter.prototype.opponentNearRoom = function (t, e, i = !1) {
  return this.opponentInSameRoom(t, e) || this.opponentNearRoomLeft(t, e, i) || this.opponentNearRoomRight(t, e, i);
};
PrinceJS.Fighter.prototype.opponentNearRoomLeft = function (t, e, i = !1) {
  return (
    this.level.rooms[e] &&
    this.level.rooms[e].links.left > 0 &&
    this.canSeeRoomLeft(e) &&
    t &&
    t.room === this.level.rooms[e].links.left &&
    (i || t.charBlockX >= 8 || this.charBlockX <= 0)
  );
};
PrinceJS.Fighter.prototype.opponentNearRoomRight = function (t, e, i = !1) {
  return (
    this.level.rooms[e] &&
    this.level.rooms[e].links.right > 0 &&
    this.canSeeRoomRight(e) &&
    t &&
    t.room === this.level.rooms[e].links.right &&
    (i || t.charBlockX <= 0 || this.charBlockX >= 8)
  );
};
PrinceJS.Fighter.prototype.canSeeRoomRight = function (t) {
  let e = this.level.rooms[t] && this.level.rooms[t].links.right;
  if (e > 0) {
    let i = this.level.getTileAt(9, this.charBlockY, t),
      s = this.level.getTileAt(0, this.charBlockY, e);
    return !i.isSeeBarrier() && !s.isSeeBarrier();
  }
  return !1;
};
PrinceJS.Fighter.prototype.canSeeRoomLeft = function (t) {
  let e = this.level.rooms[t] && this.level.rooms[t].links.left;
  if (e > 0) {
    let i = this.level.getTileAt(0, this.charBlockY, t),
      s = this.level.getTileAt(9, this.charBlockY, e);
    return !i.isSeeBarrier() && !s.isSeeBarrier();
  }
  return !1;
};
PrinceJS.Fighter.prototype.facingOpponent = function () {
  return (this.faceL() && this.opponent.x <= this.x) || (this.faceR() && this.opponent.x >= this.x);
};
PrinceJS.Fighter.prototype.canSeeOpponent = function (t = !1) {
  return this.opponent === null ||
    !this.opponent.alive ||
    !this.opponent.active ||
    !(this.opponent.charBlockY === this.charBlockY || (t && this.opponent.charBlockY === this.charBlockY + 1)) ||
    !(this.x > 0 && this.opponent.x > 0)
    ? !1
    : this.opponentNearRoom(this.opponent, this.room) ||
        this.opponentNearRoom(this, this.opponent.room) ||
        (Math.abs(this.opponent.x - this.x) <= 160 && Math.abs(this.opponent.y - this.y) <= 70);
};
PrinceJS.Fighter.prototype.isOpponentInSameRoom = function () {
  return this.opponentInSameRoom(this.opponent, this.room);
};
PrinceJS.Fighter.prototype.nearBarrier = function (t, e, i = !1, s = !1) {
  (t = t || this.charBlockX), (e = e || this.charBlockY);
  let h = this.level.getTileAt(t, e, this.room),
    o = this.level.getTileAt(t + this.charFace, e, this.room);
  return (
    o.element === PrinceJS.Level.TILE_WALL ||
    !this.canCrossGate(h, i, s) ||
    (h.element === PrinceJS.Level.TILE_TAPESTRY && this.faceR()) ||
    (o.element === PrinceJS.Level.TILE_TAPESTRY && this.faceL()) ||
    (o.element === PrinceJS.Level.TILE_TAPESTRY_TOP && this.faceL())
  );
};
PrinceJS.Fighter.prototype.canCrossGate = function (t, e = !1, i = !1) {
  let s = this.level.getTileAt(t.roomX + this.charFace, t.roomY, this.room);
  return s
    ? !(
        (s.element === PrinceJS.Level.TILE_GATE &&
          ((!i && this.faceL()) || (i && this.faceR())) &&
          !s.canCross(this.height) &&
          (!e || this.centerX + 5 > t.centerX)) ||
        (t.element === PrinceJS.Level.TILE_GATE &&
          ((!i && this.faceR()) || (i && this.faceL())) &&
          !t.canCross(this.height) &&
          (!e || this.centerX - 5 < t.centerX))
      )
    : !1;
};
PrinceJS.Fighter.prototype.standsOnTile = function (t) {
  let e = this.level.getTileAt(t.roomX, t.roomY, t.room),
    i = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
  return e === i;
};
PrinceJS.Fighter.prototype.canWalkOnTile = function (t, e, i, s = !1) {
  let h = this.level.getTileAt(t, e, i);
  return this.canCrossGate(h, !0, s)
    ? h.element === PrinceJS.Level.TILE_CHOPPER
      ? this.faceR()
        ? this.x > h.x + 15 && this.opponent.x > h.x + 15
        : !1
      : h.isSafeWalkable() || this.standsOnTile(h)
    : !1;
};
PrinceJS.Fighter.prototype.canWalkOnNextTile = function () {
  let t = PrinceJS.Utils.convertXtoBlockX(this.charX + this.charFdx * this.charFace);
  return !!(
    this.level.getTileAt(t + this.charFace, this.charBlockY, this.room).isSafeWalkable() ||
    (this.charBlockY < 2 && this.level.getTileAt(t + this.charFace, this.charBlockY + 1, this.room).isSafeWalkable())
  );
};
PrinceJS.Fighter.prototype.canReachOpponent = function (t = !1, e = !1) {
  return this.canSeeOpponent(t)
    ? this.checkPathToOpponent(this.centerX, this.opponent, this.charBlockX, this.charBlockY, this.room, (s, h, o) => {
        let r = this.level.getTileAt(s, h, o),
          n = this.level.getTileAt(r.roomX + this.charFace * (e ? -1 : 1), r.roomY, this.room);
        return { value: this.canCrossGate(r, !0, e) && !(r.isBarrierWalk() || n.isBarrierWalk()) };
      }) && Math.abs(this.opponentDistance()) < 40
      ? !0
      : this.checkPathToOpponent(
          this.centerX,
          this.opponent,
          this.charBlockX,
          this.charBlockY,
          this.room,
          (s, h, o) => {
            if (this.canWalkOnTile(s, h, o, e)) return { value: !0 };
            let r = this.level.getTileAt(s, h, o);
            return t && r.isSpace() && h < 2 && this.opponent.charBlockY === h + 1
              ? {
                  value: this.checkPathToOpponent(r.centerX, this.opponent, s, h + 1, o, (n, a, c) => ({
                    value: this.canWalkOnTile(n, a, c, e)
                  })),
                  stop: !0
                }
              : { value: !1 };
          }
        )
    : !1;
};
PrinceJS.Fighter.prototype.checkPathToOpponent = function (t, e, i, s, h, o) {
  let r = { value: !1 },
    n = e.charBlockX + (h === e.room ? 0 : 10),
    a = e.charBlockX - (h === e.room ? 0 : 10);
  if ((e.isHanging() && (e.faceR() ? (n += 1) : e.faceL() && (a -= 1)), t <= e.centerX))
    for (i > n && (i = n); i <= n; ) {
      if (i === 10)
        if (this.level.rooms[h]) h = this.level.rooms[h].links.right;
        else return !1;
      if (((r = o(i % 10, s, h)), !r.value || r.stop)) return r.value;
      i++;
    }
  else
    for (i < a && (i = a); i >= a; ) {
      if (i === -1)
        if (this.level.rooms[h]) h = this.level.rooms[h].links.left;
        else return !1;
      if (((r = o((10 + i) % 10, s, h)), !r.value || r.stop)) return r.value;
      i--;
    }
  return r.value;
};
PrinceJS.Fighter.prototype.isHanging = function () {
  return ["hang", "hangstraight", "climbup", "climbdown", "hangdrop", "jumphanglong"].includes(this.action);
};
PrinceJS.Fighter.prototype.tintSplash = function (t) {
  this.charName !== "skeleton" && (this.splash.tint = t);
};
PrinceJS.Fighter.prototype.hideSplash = function () {
  this.charName !== "skeleton" && (this.splash.visible = !1);
};
PrinceJS.Fighter.prototype.showSplash = function () {
  this.charName !== "skeleton" &&
    (["dropdead", "falldead", "impale", "halve"].includes(this.action) ||
      ((this.splash.visible = !0), (this.splashTimer = 2)));
};
PrinceJS.Fighter.prototype.updateSplash = function () {
  this.charName !== "skeleton" &&
    this.splashTimer > 0 &&
    (this.splashTimer--, this.splashTimer === 0 && ((this.splash.visible = !1), (this.splash.y = -15)));
};
PrinceJS.Fighter.prototype.setSneakUp = function (t) {
  this.sneakUp = t;
};
PrinceJS.Fighter.prototype.checkButton = function () {
  if (this.charFcheck) {
    let t = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
    switch (t.element) {
      case PrinceJS.Level.TILE_RAISE_BUTTON:
      case PrinceJS.Level.TILE_DROP_BUTTON:
        t.push();
        break;
    }
  }
};
PrinceJS.Fighter.prototype.checkFloor = function () {
  if (!this.visible) return;
  let t = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room),
    e = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room),
    i = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY, this.room),
    s = this.charFcheck;
  switch (
    (["advance", "retreat"].includes(this.action) &&
      ((s = !0),
      ((this.action === "advance" && !e.isSpace()) || (this.action === "retreat" && !i.isSpace())) && (s = !1)),
    [PrinceJS.Level.TILE_WALL].includes(t.element) &&
      (t = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room)),
    this.actionCode)
  ) {
    case 0:
    case 1:
    case 5:
      if (((this.inFallDown = !1), s))
        switch (t.element) {
          case PrinceJS.Level.TILE_SPACE:
          case PrinceJS.Level.TILE_TOP_BIG_PILLAR:
          case PrinceJS.Level.TILE_TAPESTRY_TOP:
            if (!this.alive || this.actionCode === 5 || ["strike"].includes(this.action)) return;
            this.startFall();
            break;
          case PrinceJS.Level.TILE_LOOSE_BOARD:
            t.shake(!0);
            break;
          case PrinceJS.Level.TILE_SPIKES:
            t.raise();
            break;
        }
      break;
    case 4:
      (this.inFallDown = !0), this.checkFall(t);
      break;
  }
};
PrinceJS.Fighter.prototype.checkFall = function (t) {
  let e = this.charBlockY;
  this.charY + 6 >= PrinceJS.Utils.convertBlockYtoY(e) &&
    ((t = this.level.getTileAt(this.charBlockX, e, this.room)),
    t.isWalkable()
      ? this.land()
      : (this.level.maskTile(this.charBlockX + 1, e, this.room, this),
        t.isFreeFallBarrier() &&
          ((this.charX -= (t.isBarrierLeft() ? 10 : 5) * this.charFace),
          this.updateBlockXY(),
          (t = this.level.getTileAt(this.charBlockX, e, this.room)),
          t.isWalkable() && this.land())));
};
PrinceJS.Fighter.prototype.checkRoomChange = function () {
  this.charY > 192 &&
    ((this.charY -= 192),
    (this.baseY += 189),
    this.level.rooms[this.room] && (this.room = this.level.rooms[this.room].links.down));
};
PrinceJS.Fighter.prototype.startFall = function () {
  (this.fallingBlocks = 0), (this.inFallDown = !0);
  let t = "stepfall";
  ["retreat"].includes(this.action) || this.swordDrawn
    ? ((this.charX += 10 * this.charFace * (this.action === "advance" ? 1 : -1)),
      this.level.maskTile(this.charBlockX + this.charFace, this.charBlockY, this.room, this))
    : this.level.maskTile(this.charBlockX + 1, this.charBlockY, this.room, this),
    (this.swordDrawn = !1),
    (this.action = t),
    this.processCommand();
};
PrinceJS.Fighter.prototype.stopFall = function () {
  (this.fallingBlocks = 0), (this.inFallDown = !1), (this.swordDrawn = !1);
};
PrinceJS.Fighter.prototype.land = function () {
  (this.charY = PrinceJS.Utils.convertBlockYtoY(this.charBlockY)), (this.charXVel = 0), (this.charYVel = 0);
  let t = this.fallingBlocks;
  ["skeleton", "shadow"].includes(this.charName) && (t = 1), this.stopFall();
  let e = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
  if (e.element === PrinceJS.Level.TILE_SPIKES)
    this.game.sound.play("SpikedBySpikes"), this.alignToTile(e), this.dieSpikes();
  else if (this.alive)
    switch (t) {
      case 0:
      case 1:
        this.action = this.charName === "shadow" ? "softlandStandup" : "stand";
        break;
      default:
        this.game.sound.play("FreeFallLand"), this.die("falldead");
        break;
    }
  this.processCommand(),
    this.sneakUp &&
      ((this.sneakUp = !1),
      PrinceJS.Utils.delayed(() => {
        this.sneakUp = !0;
      }, 250));
};
PrinceJS.Fighter.prototype.distanceToEdge = function () {
  return this.faceR()
    ? PrinceJS.Utils.convertBlockXtoX(this.charBlockX + 1) - 1 - this.charX - this.charFdx + this.charFfoot
    : this.charX + this.charFdx + this.charFfoot - PrinceJS.Utils.convertBlockXtoX(this.charBlockX);
};
PrinceJS.Fighter.prototype.distanceToFloor = function () {
  return PrinceJS.Utils.convertBlockYtoY(this.charBlockY) - this.charY - this.charFdy;
};
PrinceJS.Fighter.prototype.distanceToTopFloor = function () {
  return PrinceJS.Utils.convertBlockYtoY(this.charBlockY - 1) - this.charY - this.charFdy;
};
PrinceJS.Fighter.prototype.checkSpikes = function () {
  this.distanceToEdge() < 5 && this.trySpikes(this.charBlockX + this.charFace, this.charBlockY),
    this.trySpikes(this.charBlockX, this.charBlockY);
};
PrinceJS.Fighter.prototype.inSpikeDistance = function (t) {
  return !0;
};
PrinceJS.Fighter.prototype.trySpikes = function (t, e) {
  for (; e < 3; ) {
    let i = this.level.getTileAt(t, e, this.room);
    if ((i.element === PrinceJS.Level.TILE_SPIKES && i.raise(), [PrinceJS.Level.TILE_WALL].includes(i.element))) return;
    e++;
  }
};
PrinceJS.Fighter.prototype.checkChoppers = function () {
  if (this.charName === "kid") {
    if ((this.level.activateChopper(-1, this.charBlockY, this.room), this.level.rooms[this.room])) {
      let t = this.level.rooms[this.room].links.right;
      this.charBlockX === 9 && this.charX > 130 && t > 0 && this.level.activateChopper(-1, this.charBlockY, t);
    }
    if (this.level.rooms[this.room]) {
      let t = this.level.rooms[this.room].links.left;
      this.charBlockX === 0 && this.charX < 5 && t > 0 && this.level.activateChopper(-1, this.charBlockY, t);
    }
  }
  this.tryChoppers(this.charBlockX, this.charBlockY);
};
PrinceJS.Fighter.prototype.chopDistance = function (t) {
  return t.centerX - this.centerX + -16;
};
PrinceJS.Fighter.prototype.inChopDistance = function (t) {
  return Math.abs(this.chopDistance(t)) < 6 + (this.swordDrawn ? 10 : 0);
};
PrinceJS.Fighter.prototype.nearChopDistance = function (t) {
  return Math.abs(this.chopDistance(t)) <= 16;
};
PrinceJS.Fighter.prototype.tryChoppers = function (t, e) {
  if (this.charName === "skeleton") return;
  let i = this.level.getTileAt(t, e, this.room);
  i.element === PrinceJS.Level.TILE_CHOPPER && this.tryChopperTile(t, e, i),
    (i = this.level.getTileAt(t + 1, e, this.room)),
    i.element === PrinceJS.Level.TILE_CHOPPER && this.tryChopperTile(t, e, i);
};
PrinceJS.Fighter.prototype.tryChopperTile = function (t, e, i) {
  i.element === PrinceJS.Level.TILE_CHOPPER &&
    i.step >= 1 &&
    i.step <= 3 &&
    this.inChopDistance(i) &&
    this.action !== "turn" &&
    (i.showBlood(),
    this.alive &&
      (this.dieChopper(),
      this.game.sound.play("HalvedByChopper"),
      this.alignToTile(i),
      (this.charX += this.faceL() ? -5 : -9),
      this.charName === "kid" && PrinceJS.Utils.flashRedDamage(this.game)));
};
PrinceJS.Fighter.prototype.chopperDistance = function (t, e) {
  if (this.charName === "skeleton") return;
  let i = this.level.getTileAt(t, e, this.room);
  return i.element === PrinceJS.Level.TILE_CHOPPER && this.nearChopDistance(i)
    ? this.chopDistance(i)
    : ((i = this.level.getTileAt(t + 1, e, this.room)),
      i.element === PrinceJS.Level.TILE_CHOPPER && this.nearChopDistance(i) ? this.chopDistance(i) : 999);
};
PrinceJS.Fighter.prototype.dodgeChoppers = function () {
  let t = this.chopperDistance(this.charBlockX, this.charBlockY);
  t >= 13 && t <= 16 ? (this.charX -= 16 - t) : t >= -16 && t <= -13 && (this.charX += t - -16),
    this.updateCharPosition();
};
PrinceJS.Fighter.prototype.dieSpikes = function () {
  !this.alive || this.charName === "skeleton" || (this.die(), (this.action = "impale"));
};
PrinceJS.Fighter.prototype.dieChopper = function () {
  !this.alive || this.charName === "skeleton" || (this.die(), (this.action = "halve"));
};
PrinceJS.Fighter.prototype.damageLife = function () {
  !this.alive ||
    this.charName === "skeleton" ||
    (this.charName === "shadow" && PrinceJS.Utils.flashRedDamage(this.game),
    this.showSplash(),
    this.health > 1
      ? ((this.health -= 1),
        this.onDamageLife.dispatch(1),
        this.active && this.charName === "shadow" && this.opponent && this.opponent.damageLife())
      : (this.die(), this.active && this.charName === "shadow" && this.opponent && this.opponent.die()));
};
PrinceJS.Fighter.prototype.die = function (t) {
  if (!this.alive) return;
  if (this.charName === "skeleton") {
    this.action = "stand";
    return;
  }
  let e = this.health;
  (this.health -= e),
    this.onDamageLife.dispatch(e),
    (this.action = t || "dropdead"),
    (this.alive = !1),
    (this.swordDrawn = !1),
    this.hideSplash(),
    this.bringAboveOpponent();
};
PrinceJS.Fighter.prototype.inLooseFloorDistance = function (t) {
  return !!t;
};
PrinceJS.Fighter.prototype.checkLooseFloor = function (t) {};
PrinceJS.Fighter.prototype.proceedOnDead = function () {
  this.onDead.dispatch();
};
PrinceJS.Fighter.prototype.moveR = function (t = !0) {
  return ["stoop", "bump", "stand", "turn", "turnengarde", "strike"].includes(this.action) ||
    (t && ["engarde"].includes(this.action))
    ? !1
    : (this.faceL() && ["retreat", "stabbed"].includes(this.action)) ||
        (this.faceR() && !["retreat", "stabbed"].includes(this.action));
};
PrinceJS.Fighter.prototype.moveL = function (t = !0) {
  return ["stoop", "bump", "stand", "turn", "turnengarde", "strike"].includes(this.action) ||
    (t && ["engarde"].includes(this.action))
    ? !1
    : (this.faceR() && ["retreat", "stabbed"].includes(this.action)) ||
        (this.faceL() && !["retreat", "stabbed"].includes(this.action));
};
PrinceJS.Fighter.prototype.sneaks = function () {
  return (
    [
      "stoop",
      "stand",
      "standup",
      "turn",
      "jumpbackhang",
      "jumphanglong",
      "hang",
      "hangstraight",
      "hangdrop",
      "climbup",
      "climbdown",
      "testfoot"
    ].includes(this.action) || this.action.startsWith("step")
  );
};
PrinceJS.Fighter.prototype.getCharBounds = function () {
  let t = this.game.cache.getFrameData(this.charName).getFrameByName(this.charName + "-" + this.charFrame),
    e = PrinceJS.Utils.convertX(this.charX + this.charFdx * this.charFace),
    i = this.charY + this.charFdy - t.height,
    s = t.width,
    h = t.height;
  return (
    this.faceR() && (e -= t.width - 5),
    ((this.charFood && this.faceL()) || (!this.charFood && this.faceR())) && (e += 1),
    ["runturn"].includes(this.action) && (s += 2),
    this.charFrame === 38 && (s += 5),
    new Phaser.Rectangle(e, i, s, h)
  );
};
PrinceJS.Fighter.prototype.alignToTile = function (t) {
  this.faceL()
    ? (this.charX = PrinceJS.Utils.convertBlockXtoX(t.roomX) - 2)
    : (this.charX = PrinceJS.Utils.convertBlockXtoX(t.roomX + 1) + 1),
    (this.charY = PrinceJS.Utils.convertBlockYtoY(t.roomY)),
    (this.room = t.room),
    this.updateBase(),
    this.maskAndCrop(),
    (this.inJumpUp = !1);
};
PrinceJS.Fighter.prototype.alignToFloor = function () {
  let t = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
  t.roomY >= 0 && (this.charY = PrinceJS.Utils.convertBlockYtoY(t.roomY)), (this.inJumpUp = !1), this.maskAndCrop();
};
PrinceJS.Fighter.prototype.maskAndCrop = function () {
  (this.frameID(16) || this.frameID(21) || this.frameID(35)) && this.level.unMaskTile(this);
};
