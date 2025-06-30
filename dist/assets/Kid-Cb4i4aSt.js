PrinceJS.Kid = function (e, i, t, s, h) {
  PrinceJS.Fighter.call(this, e, i, t, s, h, "kid"),
    (this.id = 0),
    (this.onLevelFinished = new Phaser.Signal()),
    (this.onNextLevel = new Phaser.Signal()),
    (this.onRecoverLive = new Phaser.Signal()),
    (this.onAddLive = new Phaser.Signal()),
    (this.onFlipped = new Phaser.Signal()),
    (this.pickupSword = !1),
    (this.pickupPotion = !1),
    (this.allowCrawl = !0),
    (this.charRepeat = !1),
    (this.recoverCrop = !1),
    (this.checkFloorStepFall = !1),
    (this.backwardsFall = 1),
    (this.ledgeSwing = 0),
    (this.grabWait = !1),
    (this.cursors = this.game.input.keyboard.createCursorKeys()),
    (this.shiftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT)),
    this.registerCommand(253, this.CMD_UP),
    this.registerCommand(252, this.CMD_DOWN),
    this.registerCommand(247, this.CMD_IFWTLESS),
    this.registerCommand(245, this.CMD_JARU),
    this.registerCommand(244, this.CMD_JARD),
    this.registerCommand(243, this.CMD_EFFECT),
    this.registerCommand(241, this.CMD_NEXTLEVEL),
    (this.maxHealth = PrinceJS.maxHealth),
    (this.health = PrinceJS.currentHealth || this.maxHealth),
    (this.hasSword = PrinceJS.currentLevel > 1),
    (this.blockEngarde = !1),
    (this.bumpTimer = 0),
    (this.shadowFlashTimer = 0),
    (this.opponentSync = !1);
};
PrinceJS.Kid.prototype = Object.create(PrinceJS.Fighter.prototype);
PrinceJS.Kid.prototype.constructor = PrinceJS.Kid;
PrinceJS.Kid.prototype.CMD_UP = function (e) {
  this.charBlockY === 0 &&
    ((this.charY += 189),
    (this.baseY -= 189),
    (this.charBlockY = 2),
    this.level.rooms[this.room] &&
      ((this.room = this.level.rooms[this.room].links.up), this.onChangeRoom.dispatch(this.room)));
};
PrinceJS.Kid.prototype.CMD_DOWN = function (e) {
  this.charBlockY === 2 &&
    this.charY > 189 &&
    ((this.charY -= 189), (this.baseY += 189), (this.charBlockY = 0), this.changeRoomDown());
};
PrinceJS.Kid.prototype.CMD_IFWTLESS = function (e) {
  this.inFloat &&
    (this.action === "stepfall" && (this.action = "stepfloat"),
    this.action === "bumpfall" && (this.action = "bumpfloat"),
    this.action === "highjump" && (this.action = "superhighjump"));
};
PrinceJS.Kid.prototype.CMD_EFFECT = function (e) {};
PrinceJS.Kid.prototype.CMD_TAP = function (e) {
  ["softLand"].includes(this.action) ||
    (e.p1 === 1 ? this.game.sound.play("Footsteps") : e.p1 === 2 && this.game.sound.play("BumpIntoWallSoft"));
};
PrinceJS.Kid.prototype.CMD_JARU = function (e) {
  this.level.shakeFloor(this.charBlockY - 1, this.room);
  let i = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room);
  i.element === PrinceJS.Level.TILE_LOOSE_BOARD && i.shake(!0);
  let t = this.level.getTileAt(this.charBlockX + 1, this.charBlockY - 1, this.room);
  t.element === PrinceJS.Level.TILE_LOOSE_BOARD && t.shake(!0);
};
PrinceJS.Kid.prototype.CMD_JARD = function (e) {
  this.level.shakeFloor(this.charBlockY, this.room);
};
PrinceJS.Kid.prototype.CMD_NEXTLEVEL = function (e) {
  PrinceJS.maxHealth = this.maxHealth;
  let i = 0;
  PrinceJS.currentLevel === 4
    ? (this.game.sound.play("TheShadow"), (i = 9e3))
    : [13, 14].includes(PrinceJS.currentLevel) || (this.game.sound.play("Prince"), (i = 13e3));
  let t = PrinceJS.currentLevel;
  this.onLevelFinished.dispatch(t),
    PrinceJS.Utils.delayed(() => {
      this.onNextLevel.dispatch(t);
    }, i);
};
PrinceJS.Kid.prototype.showShadowOverlay = function () {
  (this.shadowOverlay = this.game.make.sprite(0, 0, "shadow", "shadow-15")),
    this.shadowOverlay.anchor.setTo(0, 1),
    this.addChild(this.shadowOverlay),
    (this.delegate = {
      syncFrame: (e) => {
        this.shadowOverlay.frameName = "shadow-" + e.frameName.split("-")[1];
      },
      syncFace: (e) => {
        this.shadowOverlay.charFace = e.charFace;
      }
    });
};
PrinceJS.Kid.prototype.hideShadowOverlay = function () {
  (this.shadowOverlay.visible = !1), (this.delegate = null);
};
PrinceJS.Kid.prototype.updateActor = function () {
  this.updateTimer(),
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
PrinceJS.Kid.prototype.drinkPotion = function () {
  this.pickupPotion = !1;
  let e = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room);
  if (
    (e.element !== PrinceJS.Level.TILE_POTION &&
      (e = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room)),
    e.element !== PrinceJS.Level.TILE_POTION)
  ) {
    this.allowCrawl = !0;
    return;
  }
  this.game.sound.play("DrinkPotionGlugGlug"), (this.action = "drinkpotion");
  let i = e.modifier;
  this.level.removeObject(e.roomX, e.roomY, e.room),
    !e.isSpecial &&
      PrinceJS.Utils.delayed(() => {
        switch (i) {
          case PrinceJS.Level.POTION_RECOVER:
            PrinceJS.Utils.flashRedPotion(this.game), this.game.sound.play("Potion1"), this.recoverLife();
            break;
          case PrinceJS.Level.POTION_ADD:
            PrinceJS.Utils.flashRedPotion(this.game), this.game.sound.play("Potion2"), this.addLife();
            break;
          case PrinceJS.Level.POTION_BUFFER:
            PrinceJS.Utils.flashGreenPotion(this.game), this.floatFall();
            break;
          case PrinceJS.Level.POTION_FLIP:
            this.flipScreen();
            break;
          case PrinceJS.Level.POTION_DAMAGE:
            PrinceJS.Utils.flashRedDamage(this.game), this.game.sound.play("StabbedByOpponent"), this.damageLife();
            break;
        }
        this.allowCrawl = !0;
      }, 1e3);
};
PrinceJS.Kid.prototype.gotSword = function () {
  (this.pickupSword = !1),
    (this.allowCrawl = !0),
    (this.action = "pickupsword"),
    PrinceJS.Utils.flashYellowSword(this.game),
    this.game.sound.play("Victory"),
    this.level.removeObject(this.charBlockX + this.charFace, this.charBlockY, this.room),
    (this.hasSword = !0);
};
PrinceJS.Kid.prototype.updateTimer = function () {
  this.bumpTimer > 0 && this.bumpTimer--,
    this.shadowFlashTimer === 1 && (this.hideShadowOverlay(), this.shadowFlashTimer--),
    this.shadowFlashTimer > 1 &&
      ((this.shadowOverlay.visible = this.shadowFlashTimer % 2 === 0), this.shadowFlashTimer--);
};
PrinceJS.Kid.prototype.updateBehaviour = function () {
  if (this.x === 0 && this.y === 0) return;
  !this.keyL() && this.faceL() && (this.allowCrawl = this.allowAdvance = !0),
    !this.keyR() && this.faceR() && (this.allowCrawl = this.allowAdvance = !0),
    !this.keyL() && this.faceR() && (this.allowRetreat = !0),
    !this.keyR() && this.faceL() && (this.allowRetreat = !0),
    this.keyU() || (this.allowBlock = !0),
    this.keyS() || (this.allowStrike = !0);
  let e, i;
  switch (this.action) {
    case "stand":
      if (
        ((this.blockEngarde = !1),
        (this.ledgeSwing = 0),
        (!this.flee && this.canReachOpponent() && this.facingOpponent() && this.hasSword && this.tryEngarde()) ||
          (this.flee &&
            this.keyS() &&
            this.canReachOpponent() &&
            this.facingOpponent() &&
            this.hasSword &&
            this.tryEngarde()))
      )
        return;
      if (this.keyL() && this.faceR()) return this.turn();
      if (this.keyR() && this.faceL()) return this.turn();
      if (this.keyL() && this.keyU() && this.faceL()) return this.standjump();
      if (this.keyR() && this.keyU() && this.faceR()) return this.standjump();
      if (this.keyL() && this.keyS() && this.faceL()) return this.step();
      if (this.keyR() && this.keyS() && this.faceR()) return this.step();
      if (this.keyL() && this.faceL()) return this.startrun();
      if (this.keyR() && this.faceR()) return this.startrun();
      if (this.keyU()) return this.jump();
      if (this.keyD()) return this.stoop();
      if (this.keyS()) return this.tryPickup();
      break;
    case "startrun":
      if (((this.blockEngarde = !1), (this.charRepeat = !1), this.frameID(1, 3))) {
        if (this.keyU()) return this.standjump();
        if (this.keyU()) return this.standjump();
        if (this.keyU()) return this.standjump();
      } else if (this.keyU()) return this.frameID(4, 6) ? this.runjump() : this.standjump();
      break;
    case "running":
      if (((this.charRepeat = !1), this.keyL() && this.faceR())) return this.runturn();
      if (this.keyR() && this.faceL()) return this.runturn();
      if (!this.keyL() && this.faceL()) return this.runstop();
      if (!this.keyR() && this.faceR()) return this.runstop();
      if (this.keyU()) return this.runjump();
      if (this.keyD()) return this.rdiveroll();
      break;
    case "turn":
      if (((this.blockEngarde = !1), (this.charRepeat = !1), this.keyL() && this.faceL() && this.frameID(48)))
        return this.turnrun();
      if (this.keyR() && this.faceR() && this.frameID(48)) return this.turnrun();
      break;
    case "stoop":
      if (((this.charRepeat = !1), this.pickupSword && this.frameID(109))) return this.gotSword();
      if (this.pickupPotion && this.frameID(109)) return this.drinkPotion();
      if (!this.keyD() && this.frameID(109)) return this.standup();
      if (this.keyL() && this.faceL() && this.allowCrawl) return this.crawl();
      if (this.keyR() && this.faceR() && this.allowCrawl) return this.crawl();
      break;
    case "hang":
      if (
        ((this.charRepeat = !1),
        (e = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room)),
        e.isBarrier() && (this.action = "hangstraight"),
        (i = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room)),
        i.element === PrinceJS.Level.TILE_LOOSE_BOARD && (i.shake(!0), i.fallStarted() && this.startFall()),
        this.keyU() && !this.grabWait)
      )
        return this.climbup();
      if (!this.keyS()) return this.startFall();
      this.frameID(92) && this.ledgeSwing++;
      break;
    case "hangstraight":
      if (((this.charRepeat = !1), this.keyU() && !this.grabWait)) return this.climbup();
      if (!this.keyS()) return this.startFall();
      break;
    case "jumpfall":
    case "rjumpfall":
    case "bumpfall":
    case "stepfall":
    case "freefall":
      if (((this.charRepeat = !1), this.keyS())) return this.tryGrabEdge();
      break;
    case "engarde":
      if (((this.charRepeat = !1), this.keyL() && this.faceL() && this.allowAdvance)) return this.advance();
      if (this.keyR() && this.faceR() && this.allowAdvance) return this.advance();
      if (this.keyL() && this.faceR() && this.allowRetreat) return this.retreat();
      if (this.keyR() && this.faceL() && this.allowRetreat) return this.retreat();
      if (this.keyU() && this.allowBlock) return this.block();
      if (this.keyS() && this.allowStrike) return this.strike();
      if (this.keyD()) return this.fastsheathe();
      break;
    case "advance":
    case "blockedstrike":
      if (((this.charRepeat = !1), this.keyU() && this.allowBlock)) return this.block();
      break;
    case "retreat":
    case "strike":
    case "block":
      if (((this.charRepeat = !1), this.keyS() && this.allowStrike)) return this.strike();
      break;
    case "climbup":
    case "climbdown":
      (this.charRepeat = !1),
        (e = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room)),
        e.element === PrinceJS.Level.TILE_LOOSE_BOARD && e.fallStarted()
          ? this.startFall()
          : this.frameID(142) && e.element === PrinceJS.Level.TILE_SPACE && this.startFall(),
        ((this.action === "climbup" && this.frameID(142)) || (this.action === "climbdown" && this.frameID(140))) &&
          this.level.recheckCurrentRoom();
      break;
  }
};
PrinceJS.Kid.prototype.tryEngarde = function () {
  if (!this.hasSword || this.blockEngarde) return !1;
  this.dodgeChoppers(), this.level.recheckCurrentRoom();
  let e = !this.opponent.facingOpponent() && this.opponent.sneakUp ? 35 : 100;
  return this.opponent && this.opponent.alive && this.opponentDistance() <= e ? this.engarde() : !1;
};
PrinceJS.Kid.prototype.inFallDistance = function (e) {
  if (
    [PrinceJS.Level.TILE_SPACE, PrinceJS.Level.TILE_TOP_BIG_PILLAR, PrinceJS.Level.TILE_TAPESTRY_TOP].includes(
      e.element
    ) ||
    this.x === 0 ||
    !["runstop", "runturn", "runjump", "standjump"].includes(this.action)
  )
    return !0;
  let i = this.faceL() ? 10 : -14;
  return Math.abs(e.centerX - this.centerX + i) >= 25;
};
PrinceJS.Kid.prototype.checkLooseFloor = function (e) {
  this.standsOnTile(e) && this.inLooseFloorDistance(e) && this.damageStruck();
};
PrinceJS.Kid.prototype.inGrabDistance = function (e, i = 30) {
  let t = this.faceL() ? 2 : -5;
  return Math.abs(e.centerX - this.centerX + t) <= i;
};
PrinceJS.Kid.prototype.tryGrabEdge = function () {
  if ((this.updateBlockXY(), this.fallingBlocks > 2 && !this.inFloat)) return;
  let e = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room),
    i = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY - 1, this.room),
    t = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY - 1, this.room),
    s =
      this.distanceToEdge() <= 10 + (["stepfall"].includes(this.action) ? 3 : 0) &&
      (this.distanceToTopFloor() >= -50 ||
        (["jumpfall", "freefall"].includes(this.action) && this.distanceToFloor() > -3));
  if (
    i.isWalkable() &&
    [PrinceJS.Level.TILE_SPACE, PrinceJS.Level.TILE_TOP_BIG_PILLAR, PrinceJS.Level.TILE_TAPESTRY_TOP].includes(
      e.element
    ) &&
    s &&
    this.inGrabDistance(i) &&
    !(this.faceL() && [PrinceJS.Level.TILE_TAPESTRY].includes(i.element))
  )
    return this.grab(this.charBlockX);
  if (
    e.isWalkable() &&
    [PrinceJS.Level.TILE_SPACE, PrinceJS.Level.TILE_TOP_BIG_PILLAR, PrinceJS.Level.TILE_TAPESTRY_TOP].includes(
      t.element
    ) &&
    s &&
    this.inGrabDistance(e, 20) &&
    !(this.faceL() && [PrinceJS.Level.TILE_TAPESTRY].includes(e.element))
  )
    return this.grab(this.charBlockX - this.charFace);
};
PrinceJS.Kid.prototype.grab = function (e) {
  this.updateBlockXY(),
    this.faceL()
      ? (this.charX = PrinceJS.Utils.convertBlockXtoX(e) - 3)
      : (this.charX = PrinceJS.Utils.convertBlockXtoX(e + 1) + 1),
    (this.charY = PrinceJS.Utils.convertBlockYtoY(this.charBlockY)),
    (this.charXVel = 0),
    (this.charYVel = 0),
    (this.ledgeSwing = 0),
    this.stopFall(),
    this.updateBlockXY(),
    (this.action = "hang"),
    this.game.sound.play("BumpIntoWallHard"),
    this.processCommand();
  let i = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room);
  i.element === PrinceJS.Level.TILE_LOOSE_BOARD && i.shake(!0),
    (this.grabWait = !0),
    PrinceJS.Utils.delayed(() => {
      this.grabWait = !1;
    }, 500);
};
PrinceJS.Kid.prototype.checkBarrier = function () {
  if (
    !this.alive ||
    [
      "jumpup",
      "highjump",
      "jumphanglong",
      "jumpbackhang",
      "climbup",
      "climbdown",
      "climbfail",
      "stand",
      "turn",
      "fastsheathe"
    ].includes(this.action) ||
    this.action.substring(0, 4) === "step" ||
    (this.action.substring(0, 4) === "hang" && this.action !== "hangdrop")
  )
    return;
  let e = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room),
    i = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room),
    t = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY, this.room);
  if (this.action === "freefall" && e.isFreeFallBarrier() && i.isFreeFallBarrier()) {
    this.moveL()
      ? (this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX + 1) - 1)
      : this.moveR() && (this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX)),
      this.updateBlockXY(),
      this.bump();
    return;
  }
  if (
    this.moveR() &&
    (e.isBarrier() ||
      (this.centerX <= t.centerX &&
        [PrinceJS.Level.TILE_TAPESTRY, PrinceJS.Level.TILE_TAPESTRY_TOP].includes(t.element)))
  ) {
    if (e.element === PrinceJS.Level.TILE_MIRROR) return;
    (e.intersects(this.getCharBounds()) || (e.intersectsAbs(this.getCharBoundsAbs()) && !this.swordDrawn)) &&
      (e.isBarrier() || (this.charBlockX -= this.charFace),
      this.swordDrawn
        ? (this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) - 2)
        : (this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 5),
      this.updateBlockXY(),
      this.bump());
  } else {
    let s = this.swordDrawn ? 12 * this.charFace : 0,
      h = PrinceJS.Utils.convertXtoBlockX(this.charX + this.charFdx * this.charFace - s),
      r = this.level.getTileAt(h, this.charBlockY, this.room);
    if (r.isBarrier())
      switch (r.element) {
        case PrinceJS.Level.TILE_WALL:
          this.swordDrawn ||
            (this.moveL()
              ? (this.charX = PrinceJS.Utils.convertBlockXtoX(h + 1) - 1)
              : this.moveR() && (this.charX = PrinceJS.Utils.convertBlockXtoX(h)),
            this.updateBlockXY()),
            this.bump();
          break;
        case PrinceJS.Level.TILE_GATE:
        case PrinceJS.Level.TILE_TAPESTRY:
        case PrinceJS.Level.TILE_TAPESTRY_TOP:
          this.moveL() &&
            (r.intersects(this.getCharBounds()) || (r.intersectsAbs(this.getCharBoundsAbs()) && !this.swordDrawn)) &&
            (this.action === "stand" && e.element === PrinceJS.Level.TILE_GATE
              ? ((this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 3), this.updateBlockXY())
              : this.centerX - 8 > r.centerX &&
                ((this.charX = PrinceJS.Utils.convertBlockXtoX(h + 1) - 1), this.updateBlockXY(), this.bump()));
          break;
      }
    if (((r = this.level.getTileAt(h - this.charFace, this.charBlockY, this.room)), r && r.isBarrier()))
      switch (r.element) {
        case PrinceJS.Level.TILE_MIRROR:
          this.moveL() && this.action !== "runjump" && ((this.charX += 5), this.bump());
          break;
      }
  }
};
PrinceJS.Kid.prototype.getCharBoundsAbs = function () {
  return new Phaser.Rectangle(this.x, this.y - this.height, this.width, this.height);
};
PrinceJS.Kid.prototype.bump = function () {
  let e = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
  e.isSpace()
    ? ((this.charX -= 2 * this.charFace * this.backwardsFall), this.bumpFall())
    : this.distanceToFloor() >= 5
    ? this.bumpFall()
    : this.frameID(24, 25) || this.frameID(40, 42) || this.frameID(102, 106)
    ? ((this.charX -= 5 * this.charFace), this.land())
    : ((e = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room)),
      !this.swordDrawn && !e.isWalkable() && this.action !== "highjump" && (this.charX -= 5 * this.charFace),
      this.swordDrawn
        ? (this.moveR() ? (this.charX -= 2) : this.moveL() ? (this.charX += 6) : (this.charX += 5 * this.charFace),
          this.bumpSound())
        : ["softland", "medland"].includes(this.action) ||
          ((this.blockEngarde = !0), this.setBump(), this.processCommand())),
    this.crop(null);
};
PrinceJS.Kid.prototype.setBump = function () {
  this.bumpSound(), (this.action = "bump"), this.alignToFloor();
};
PrinceJS.Kid.prototype.bumpSound = function () {
  this.bumpTimer === 0 && (this.game.sound.play("BumpIntoWallSoft"), (this.bumpTimer = 10));
};
PrinceJS.Kid.prototype.bumpFall = function () {
  (this.inFallDown = !0),
    this.actionCode === 4
      ? ((this.charX -= this.charFace * this.backwardsFall), (this.charXVel = 0), (this.ledgeSwing = 0))
      : ((this.charX -= 2 * this.charFace * this.backwardsFall),
        this.bumpSound(),
        (this.action = "bumpfall"),
        this.processCommand());
};
PrinceJS.Kid.prototype.fastsheathe = function () {
  (this.flee = !0),
    (this.action = "fastsheathe"),
    (this.swordDrawn = !1),
    this.opponent !== null && (this.opponent.fastsheathe(), (this.opponent.refracTimer = 9));
};
PrinceJS.Kid.prototype.block = function () {
  if (this.frameID(158) || this.frameID(165)) {
    if (this.opponent !== null) {
      if (this.opponent.frameID(18)) return;
      (this.action = "block"), this.opponent.frameID(3) && this.processCommand();
    }
  } else {
    if (!this.frameID(167)) return;
    this.action = "striketoblock";
  }
  this.allowBlock = !1;
};
PrinceJS.Kid.prototype.prepareCheckFloor = function () {
  let e = this.charBlockX,
    i = this.charBlockY,
    t = this.charFcheck;
  return this.charFrame === 141
    ? { skip: !0 }
    : ((["hang", "hangstraight"].includes(this.action) ||
        (this.action === "climbup" && this.frameID(135, 140)) ||
        (this.action === "climbdown" && this.frameID(91, 140))) &&
        (i = i - 1),
      ["hang", "hangstraight", "climbup", "climbdown", "runturn"].includes(this.action) && (t = !0),
      { tile: this.level.getTileAt(e, i, this.room), checkCharFcheck: t });
};
PrinceJS.Kid.prototype.checkButton = function () {
  let { skip: e, tile: i, checkCharFcheck: t } = this.prepareCheckFloor();
  if (!e)
    switch (this.actionCode) {
      case 0:
      case 1:
      case 2:
      case 5:
      case 6:
      case 7:
        if (t && i)
          switch (i.element) {
            case PrinceJS.Level.TILE_RAISE_BUTTON:
            case PrinceJS.Level.TILE_DROP_BUTTON:
              i.push();
              break;
          }
        break;
    }
};
PrinceJS.Kid.prototype.checkFloor = function () {
  let { skip: e, tile: i, checkCharFcheck: t } = this.prepareCheckFloor();
  if (e) return;
  let s = this.level.getTileAt(i.roomX - this.charFace, i.roomY, this.room);
  if (
    !(["climbup", "climbdown"].includes(this.action) && ![PrinceJS.Level.TILE_LOOSE_BOARD].includes(i.element)) &&
    !(["stoop"].includes(this.action) && ![PrinceJS.Level.TILE_SPACE].includes(i.element)) &&
    !["strike"].includes(this.action) &&
    !(this.pickupPotion || this.pickupSword)
  )
    switch (this.actionCode) {
      case 0:
      case 1:
      case 5:
      case 7:
        if (((this.inFallDown = !1), t))
          switch (i.element) {
            case PrinceJS.Level.TILE_FLOOR:
              i.hidden && ((i.hidden = !1), i.revalidate());
              break;
            case PrinceJS.Level.TILE_SPACE:
            case PrinceJS.Level.TILE_TOP_BIG_PILLAR:
            case PrinceJS.Level.TILE_TAPESTRY_TOP:
              if (!this.alive) return;
              this.inFallDistance(s)
                ? this.startFall()
                : s.element === PrinceJS.Level.TILE_LOOSE_BOARD
                ? s.shake(!0)
                : s.element === PrinceJS.Level.TILE_SPIKES
                ? s.raise()
                : [PrinceJS.Level.TILE_RAISE_BUTTON, PrinceJS.Level.TILE_DROP_BUTTON].includes(s.element) && s.push();
              break;
            case PrinceJS.Level.TILE_LOOSE_BOARD:
              i.shake(!0);
              break;
            case PrinceJS.Level.TILE_SPIKES:
              this.inSpikeDistance(i) &&
                ((i.state !== PrinceJS.Tile.Spikes.STATE_FULL_OUT &&
                  ["running", "runjump", "runturn"].includes(this.action)) ||
                  this.action === "softland" ||
                  (this.action === "medland" && this.frameID(108, 109)) ||
                  (this.action === "standjump" && this.frameID(26, 28))) &&
                (this.game.sound.play("SpikedBySpikes"), this.alignToTile(i), this.dieSpikes()),
                i.raise();
              break;
          }
        break;
      case 3:
      case 4:
        if (((this.inFallDown = !0), this.actionCode === 3 && !this.checkFloorStepFall)) return;
        (this.checkFloorStepFall = !1), this.checkFall(i), this.checkLedgeSwing();
        break;
    }
};
PrinceJS.Kid.prototype.checkLedgeSwing = function () {
  this.ledgeSwing >= 4 && (this.charX += (this.inFloat ? 2 : 1.5) * this.charFace);
};
PrinceJS.Kid.prototype.checkRoomChange = function () {
  if ([16, 17, 27, 28, 47, 48, 49, 50, 51, 61, 62, 76, 77, 116, 117, 125, 126, 127, 128, 157].includes(this.charFrame))
    return;
  let e = this.charX + this.charFdx * this.charFace,
    i = PrinceJS.Utils.convertXtoBlockX(e);
  if (i >= 9 && (this.moveR(!1) || ["bump"].includes(this.action))) {
    let t = this.room;
    (e > 142 || (this.swordDrawn && (e > 130 || e < 0))) &&
      this.level.rooms[this.room] &&
      (t = this.level.rooms[this.room].links.right),
      ["climbup", "climbdown", "stand", "jumpup"].includes(this.action) || this.onChangeRoom.dispatch(this.room, t);
  }
  this.moveL(!1) &&
    (i === 8 || (i === 9 && e < 135)) &&
    (["climbup", "climbdown", "stand", "jumpup"].includes(this.action) || this.onChangeRoom.dispatch(this.room)),
    this.charY > 189 && ((this.charY -= 189), (this.baseY += 189), this.changeRoomDown());
};
PrinceJS.Kid.prototype.changeRoomDown = function () {
  if (this.level.rooms[this.room]) {
    let e = this.level.rooms[this.room].links.down;
    e > 0
      ? (this.room = e)
      : this.charBlockX >= 9
      ? ((e = this.level.rooms[this.room].links.right),
        (e = this.level.rooms[e].links.down),
        e > 0 && ((this.charX -= 140), (this.baseX += 320), (this.charBlockX = 0)),
        (this.room = e))
      : this.charBlockX <= 0
      ? ((e = this.level.rooms[this.room].links.left),
        e > 0 &&
          ((e = this.level.rooms[e].links.down), (this.charX += 140), (this.baseX -= 320), (this.charBlockX = 9)),
        (this.room = e))
      : (this.room = e),
      this.onChangeRoom.dispatch(this.room);
  }
};
PrinceJS.Kid.prototype.maskAndCrop = function () {
  this.faceR() && this.charFrame > 134 && this.charFrame < 145 && (this.frameName += "r"),
    this.faceR() && this.action.substring(0, 4) === "hang"
      ? this.level.maskTile(this.charBlockX, this.charBlockY - 1, this.room, this)
      : this.faceR() && this.action.substring(0, 4) === "jumphanglong" && this.frameID(79)
      ? this.level.maskTile(this.charBlockX, this.charBlockY - 1, this.room, this)
      : this.faceR() && this.action.substring(0, 4) === "jumpbackhang" && this.frameID(79)
      ? this.level.maskTile(this.charBlockX, this.charBlockY - 1, this.room, this)
      : this.faceR() &&
        this.action === "climbdown" &&
        this.frameID(91) &&
        this.level.maskTile(this.charBlockX, this.charBlockY - 1, this.room, this),
    (this.frameID(15) || this.frameID(158) || this.frameID(185) || (this.faceL() && this.action === "hang")) &&
      this.level.unMaskTile(this),
    this.recoverCrop && (this.crop(null), (this.recoverCrop = !1)),
    this.inJumpUp &&
      this.frameID(78, 79) &&
      this.crop(new Phaser.Rectangle(0, 7, -this.width * this.charFace, this.height)),
    this.inJumpUp &&
      this.frameID(81) &&
      (this.crop(null),
      this.crop(new Phaser.Rectangle(0, 3, -this.width * this.charFace, this.height)),
      (this.inJumpUp = !1),
      (this.recoverCrop = !0));
};
PrinceJS.Kid.prototype.tryPickup = function () {
  let e = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room),
    i = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room);
  (this.pickupSword = e.element === PrinceJS.Level.TILE_SWORD || i.element === PrinceJS.Level.TILE_SWORD),
    (this.pickupPotion = e.element === PrinceJS.Level.TILE_POTION || i.element === PrinceJS.Level.TILE_POTION),
    (this.pickupPotion || this.pickupSword) &&
      (this.faceR() &&
        ((i.element === PrinceJS.Level.TILE_POTION || i.element === PrinceJS.Level.TILE_SWORD) && this.charBlockX++,
        (this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 1 * this.pickupPotion)),
      this.faceL() &&
        ((e.element === PrinceJS.Level.TILE_POTION || e.element === PrinceJS.Level.TILE_SWORD) && this.charBlockX++,
        (this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) - 3)),
      (this.action = "stoop"),
      (this.allowCrawl = !1));
};
PrinceJS.Kid.prototype.keyL = function () {
  return this.cursors.left.isDown || this.pointerL() || PrinceJS.Utils.gamepadLeftPressed(this.game);
};
PrinceJS.Kid.prototype.keyR = function () {
  return this.cursors.right.isDown || this.pointerR() || PrinceJS.Utils.gamepadRightPressed(this.game);
};
PrinceJS.Kid.prototype.keyU = function () {
  return this.cursors.up.isDown || this.pointerU() || PrinceJS.Utils.gamepadUpPressed(this.game);
};
PrinceJS.Kid.prototype.keyD = function () {
  return this.cursors.down.isDown || this.pointerD() || PrinceJS.Utils.gamepadDownPressed(this.game);
};
PrinceJS.Kid.prototype.keyS = function () {
  return this.shiftKey.isDown || this.pointerS() || PrinceJS.Utils.gamepadActionPressed(this.game);
};
PrinceJS.Kid.prototype.pointerL = function () {
  if (!PrinceJS.Utils.pointerDown(this.game)) return;
  let e = PrinceJS.Utils.effectivePointer(this.game),
    i = PrinceJS.Utils.effectiveScreenSize(this.game);
  return (
    e.x >= 0 &&
    e.x <= (1 / 3) * i.width &&
    e.y >= (PrinceJS.Utils.isScreenFlipped() ? 0.04 : 0) * i.height &&
    e.y <= (PrinceJS.Utils.isScreenFlipped() ? 1 : 0.96) * i.height
  );
};
PrinceJS.Kid.prototype.pointerR = function () {
  if (!PrinceJS.Utils.pointerDown(this.game)) return;
  let e = PrinceJS.Utils.effectivePointer(this.game),
    i = PrinceJS.Utils.effectiveScreenSize(this.game);
  return (
    e.x >= (2 / 3) * i.width &&
    e.x <= i.width &&
    e.y >= (PrinceJS.Utils.isScreenFlipped() ? 0.04 : 0) * i.height &&
    e.y <= (PrinceJS.Utils.isScreenFlipped() ? 1 : 0.96) * i.height
  );
};
PrinceJS.Kid.prototype.pointerU = function () {
  if (!PrinceJS.Utils.pointerDown(this.game)) return;
  let e = PrinceJS.Utils.effectivePointer(this.game),
    i = PrinceJS.Utils.effectiveScreenSize(this.game);
  return (
    e.x >= 0 &&
    e.x <= i.width &&
    e.y >= (PrinceJS.Utils.isScreenFlipped() ? 0.04 : 0) * i.height &&
    e.y <= (1 / 3) * i.height
  );
};
PrinceJS.Kid.prototype.pointerD = function () {
  if (!PrinceJS.Utils.pointerDown(this.game)) return;
  let e = PrinceJS.Utils.effectivePointer(this.game),
    i = PrinceJS.Utils.effectiveScreenSize(this.game);
  return (
    e.x >= 0 &&
    e.x <= i.width &&
    e.y >= (2 / 3) * i.height &&
    e.y <= (PrinceJS.Utils.isScreenFlipped() ? 1 : 0.96) * i.height
  );
};
PrinceJS.Kid.prototype.pointerS = function () {
  if (!PrinceJS.Utils.pointerDown(this.game)) return;
  let e = PrinceJS.Utils.effectivePointer(this.game),
    i = PrinceJS.Utils.effectiveScreenSize(this.game),
    t = this.swordDrawn ? 0.5 : 0;
  return (
    e.x >= ((0.5 + t) * i.width) / 3 &&
    e.x <= ((2.5 - t) * i.width) / 3 &&
    e.y >= ((0.5 + t) * i.height) / 3 &&
    e.y <= ((2.5 - t) * i.height) / 3
  );
};
PrinceJS.Kid.prototype.syncShadow = function () {
  this.opponentSync &&
    this.opponent &&
    this.opponent.charName === "shadow" &&
    !this.opponent.active &&
    this.opponent.charFace !== this.charFace &&
    (this.opponent.action = this.action);
};
PrinceJS.Kid.prototype.mergeShadowPosition = function () {
  let e = this.opponent;
  (this.opponent = null),
    (e.opponent = null),
    (e.action = "stand"),
    e.setInvisible(),
    (this.charX = e.charX),
    (this.charY = e.charY),
    (this.charFdx = e.charFdx),
    (this.charFdy = e.charFdy),
    (this.charFood = e.charFood),
    this.charFace !== e.charFace && this.changeFace(),
    this.updateCharPosition(),
    this.updateBlockXY();
};
PrinceJS.Kid.prototype.flashShadowOverlay = function () {
  this.shadowFlashTimer = 30;
};
PrinceJS.Kid.prototype.turn = function () {
  !this.hasSword || !this.canReachOpponent(!1, !0)
    ? (this.action = "turn")
    : this.hasSword && this.canReachOpponent(!1, !0) && !this.facingOpponent() && !this.nearBarrier()
    ? ((this.action = "turndraw"),
      (this.flee = !1),
      this.swordDrawn || this.game.sound.play("UnsheatheSword"),
      (this.swordDrawn = !0))
    : (this.action = "turn");
};
PrinceJS.Kid.prototype.standjump = function () {
  (this.action = "standjump"), this.syncShadow();
};
PrinceJS.Kid.prototype.startrun = function () {
  if (this.nearBarrier()) return this.step();
  (this.action = "startrun"), this.syncShadow();
};
PrinceJS.Kid.prototype.runturn = function () {
  this.action = "runturn";
};
PrinceJS.Kid.prototype.turnrun = function () {
  if (this.nearBarrier()) {
    this.step(), (this.charX -= 2 * this.charFace);
    return;
  }
  this.action = "turnrun";
};
PrinceJS.Kid.prototype.runjump = function () {
  (this.action = "runjump"), this.syncShadow();
};
PrinceJS.Kid.prototype.rdiveroll = function () {
  (this.action = "rdiveroll"), (this.allowCrawl = !1);
};
PrinceJS.Kid.prototype.standup = function () {
  (this.action = "standup"), (this.allowCrawl = !0);
};
PrinceJS.Kid.prototype.land = function () {
  (this.charY = PrinceJS.Utils.convertBlockYtoY(this.charBlockY)),
    (this.charXVel = 0),
    (this.charYVel = 0),
    (this.ledgeSwing = 0);
  let e = this.inFloat ? 0 : this.fallingBlocks;
  this.stopFall();
  let i = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
  if (i.element === PrinceJS.Level.TILE_SPIKES)
    this.game.sound.play("SpikedBySpikes"), this.alignToTile(i), this.dieSpikes();
  else if (this.alive)
    switch (e) {
      case 0:
      case 1:
        PrinceJS.danger ? (this.action = "medland") : (this.action = "softland"), this.game.sound.play("SoftLanding");
        break;
      case 2:
        (this.action = "medland"), this.game.sound.play("MediumLandingOof"), this.damageLife(!0);
        break;
      default:
        this.game.sound.play("FreeFallLand"), this.die("falldead");
    }
  this.alignToFloor(),
    this.processCommand(),
    this.level.unMaskTile(this),
    (PrinceJS.danger = !1),
    this.level.recheckCurrentRoom();
};
PrinceJS.Kid.prototype.crawl = function () {
  (this.action = "crawl"), (this.allowCrawl = !1);
};
PrinceJS.Kid.prototype.runstop = function () {
  (this.frameID(7) || this.frameID(11)) && ((this.action = "runstop"), this.syncShadow());
};
PrinceJS.Kid.prototype.step = function () {
  let e = 11,
    i = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room),
    t = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room);
  if (
    (i.element === PrinceJS.Level.TILE_CHOPPER && this.faceL()) ||
    (t.element === PrinceJS.Level.TILE_CHOPPER && this.faceR())
  )
    (e = this.distanceToEdge() - 4 - (this.faceL() ? 1 : 0)), e <= 0 && (e = 11);
  else if (
    (i.element === PrinceJS.Level.TILE_MIRROR && this.faceL()) ||
    (t.element === PrinceJS.Level.TILE_MIRROR && this.faceR())
  ) {
    if (((e = this.distanceToEdge() - 8), e <= 0)) {
      this.bump();
      return;
    }
  } else if (
    this.nearBarrier() ||
    t.element === PrinceJS.Level.TILE_SPACE ||
    t.element === PrinceJS.Level.TILE_TOP_BIG_PILLAR ||
    t.element === PrinceJS.Level.TILE_TAPESTRY_TOP ||
    t.element === PrinceJS.Level.TILE_POTION ||
    t.element === PrinceJS.Level.TILE_LOOSE_BOARD ||
    t.element === PrinceJS.Level.TILE_DROP_BUTTON ||
    t.element === PrinceJS.Level.TILE_RAISE_BUTTON ||
    t.element === PrinceJS.Level.TILE_SWORD
  ) {
    if (
      ((e = this.distanceToEdge()),
      ((i.element === PrinceJS.Level.TILE_GATE &&
        (i.state === PrinceJS.Tile.Gate.STATE_FAST_DROPPING || !i.canCross(30))) ||
        i.element === PrinceJS.Level.TILE_TAPESTRY) &&
        this.faceR())
    ) {
      if (((e -= 6), e <= 0)) {
        this.setBump();
        return;
      }
    } else if (t.element === PrinceJS.Level.TILE_POTION || t.element === PrinceJS.Level.TILE_SWORD)
      !this.nearBarrier() && e === 0 && (e = 11);
    else if (t.isBarrier() && e - 2 <= 0) {
      this.setBump();
      return;
    } else if (
      e === 0 &&
      (t.element === PrinceJS.Level.TILE_LOOSE_BOARD ||
        t.element === PrinceJS.Level.TILE_DROP_BUTTON ||
        t.element === PrinceJS.Level.TILE_RAISE_BUTTON ||
        t.element === PrinceJS.Level.TILE_SPACE ||
        t.element === PrinceJS.Level.TILE_TOP_BIG_PILLAR ||
        t.element === PrinceJS.Level.TILE_TAPESTRY_TOP)
    )
      if (
        this.charRepeat ||
        t.element === PrinceJS.Level.TILE_DROP_BUTTON ||
        t.element === PrinceJS.Level.TILE_RAISE_BUTTON
      )
        (this.charRepeat = !1), (e = 11);
      else {
        (this.charRepeat = !0), (this.action = "testfoot");
        return;
      }
  }
  e > 0 && ((this.action = "step" + Math.min(e, 14)), this.syncShadow());
};
PrinceJS.Kid.prototype.startFall = function () {
  if (
    (["turn", "turnrun", "turnengarde", "highjump", "hangdrop"].includes(this.action) && (this.checkFloorStepFall = !0),
    (this.fallingBlocks = Math.min(0, this.fallingBlocks)),
    (this.inFallDown = !0),
    (this.backwardsFall = this.swordDrawn ? -1 : 1),
    this.action.substring(0, 4) === "hang")
  ) {
    let e = this.charBlockX;
    this.action === "hangstraight" && (e -= this.charFace);
    let i = this.level.getTileAt(e, this.charBlockY, this.room);
    [PrinceJS.Level.TILE_SPACE, PrinceJS.Level.TILE_TOP_BIG_PILLAR, PrinceJS.Level.TILE_TAPESTRY_TOP].includes(
      i.element
    )
      ? ((i = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room)),
        i.isBarrier() && (this.charX -= 7 * this.charFace),
        (this.action = "hangfall"),
        this.level.maskTile(this.charBlockX - this.charFace, this.charBlockY, this.room, this),
        this.processCommand())
      : ((i = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room)),
        i.isBarrier() && (this.charX -= 7 * this.charFace),
        (this.action = "hangdrop"),
        this.stopFall());
  } else {
    let e = "stepfall";
    this.frameID(44) && (e = "rjumpfall"),
      this.frameID(26) && (e = "jumpfall"),
      this.frameID(13) && (e = "stepfall2"),
      this.distanceToEdge() <= 5 &&
        (["running", "runstop"].includes(this.action) || this.action.startsWith("step")) &&
        (this.charX -= 7 * this.charFace);
    let t = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room).isWalkable() ? 10 : 5;
    ["retreat"].includes(this.action) || this.swordDrawn
      ? ((this.charX += t * this.charFace * (this.action === "advance" ? 1 : -1)),
        this.level.maskTile(this.charBlockX + this.charFace, this.charBlockY, this.room, this))
      : this.level.maskTile(this.charBlockX + 1, this.charBlockY, this.room, this),
      (this.swordDrawn = !1),
      (this.action = e),
      this.processCommand();
  }
};
PrinceJS.Kid.prototype.stoop = function () {
  let e = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY, this.room);
  if (
    [PrinceJS.Level.TILE_SPACE, PrinceJS.Level.TILE_TOP_BIG_PILLAR].includes(e.element) ||
    (this.faceL() && [PrinceJS.Level.TILE_TAPESTRY_TOP].includes(e.element))
  ) {
    if (this.charFace === -1) {
      if (this.charX - PrinceJS.Utils.convertBlockXtoX(this.charBlockX) > 4) return this.climbdown();
    } else if (this.charX - PrinceJS.Utils.convertBlockXtoX(this.charBlockX) < 9) return this.climbdown();
  }
  this.action = "stoop";
};
PrinceJS.Kid.prototype.climbdown = function () {
  this.blockEngarde = !1;
  let e = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
  this.faceL() &&
  e.element === PrinceJS.Level.TILE_GATE &&
  (e.state === PrinceJS.Tile.Gate.STATE_FAST_DROPPING || !e.canCross(15))
    ? (this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 3)
    : (this.faceL()
        ? (this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 6)
        : (this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 7),
      (this.action = "climbdown"));
};
PrinceJS.Kid.prototype.climbup = function () {
  this.blockEngarde = !1;
  let e = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room);
  this.faceL() &&
  e.element === PrinceJS.Level.TILE_GATE &&
  (e.state === PrinceJS.Tile.Gate.STATE_FAST_DROPPING || !e.canCross(15))
    ? (this.action = "climbfail")
    : ((this.action = "climbup"), this.faceR() && this.level.unMaskTile(this)),
    e.element === PrinceJS.Level.TILE_LOOSE_BOARD && e.shake(!0);
};
PrinceJS.Kid.prototype.jumpup = function () {
  (this.action = "jumpup"), (this.inJumpUp = !0);
};
PrinceJS.Kid.prototype.highjump = function () {
  let e = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY - 1, this.room);
  (this.action = "highjump"),
    this.faceL() && e.isWalkable() && this.level.maskTile(this.charBlockX + 1, this.charBlockY - 1, this.room, this);
};
PrinceJS.Kid.prototype.jumpbackhang = function () {
  this.charFace === -1
    ? (this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 7)
    : (this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 6),
    (this.action = "jumpbackhang"),
    this.faceR() && this.level.maskTile(this.charBlockX, this.charBlockY - 1, this.room, this);
};
PrinceJS.Kid.prototype.jumphanglong = function () {
  this.charFace === -1
    ? (this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 1)
    : (this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 12),
    (this.action = "jumphanglong"),
    this.faceR() && this.level.maskTile(this.charBlockX + 1, this.charBlockY - 1, this.room, this);
};
PrinceJS.Kid.prototype.climbstairs = function () {
  let e = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
  e.element === PrinceJS.Level.TILE_EXIT_RIGHT
    ? this.charBlockX--
    : (e = this.level.getTileAt(this.charBlockX + 1, this.charBlockY, this.room)),
    this.faceR() && ((this.charFace *= -1), (this.scale.x *= -1)),
    (this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 3),
    e.mask(),
    (this.action = "climbstairs");
};
PrinceJS.Kid.prototype.jump = function () {
  let e = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room),
    i = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room),
    t = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY - 1, this.room),
    s = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY - 1, this.room),
    h = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY, this.room);
  if (
    e.isExitDoor() &&
    (e.element === PrinceJS.Level.TILE_EXIT_LEFT &&
      (e = this.level.getTileAt(this.charBlockX + 1, this.charBlockY, this.room)),
    e.open)
  )
    return this.climbstairs();
  if (this.faceL() && e.element === PrinceJS.Level.TILE_MIRROR && Math.abs(e.x - this.x) < 30) return this.bump();
  if (t.element === PrinceJS.Level.TILE_MIRROR) return this.jumpup();
  if (this.checkJump(i) && this.checkClimbable(t)) return this.jumphanglong();
  if (this.checkClimbable(i) && this.checkJump(s) && h.isWalkable())
    return this.faceL() && PrinceJS.Utils.convertBlockXtoX(this.charBlockX + 1) - this.charX < 11
      ? (this.charBlockX++, this.jumphanglong())
      : this.faceR() && this.charX - PrinceJS.Utils.convertBlockXtoX(this.charBlockX) < 9
      ? (this.charBlockX--, this.jumphanglong())
      : this.jumpup();
  if (this.checkClimbable(i) && this.checkJump(s))
    return this.faceL() && PrinceJS.Utils.convertBlockXtoX(this.charBlockX + 1) - this.charX < 11
      ? this.jumpbackhang()
      : this.faceR() && this.charX - PrinceJS.Utils.convertBlockXtoX(this.charBlockX) < 9
      ? this.jumpbackhang()
      : this.jumpup();
  if (i.isSpace()) return this.highjump();
  this.jumpup();
};
PrinceJS.Kid.prototype.checkJump = function (e) {
  return (this.faceL() && e.isSpace()) || (this.faceR() && e.isJumpSpace()) || e.hidden;
};
PrinceJS.Kid.prototype.checkClimbable = function (e) {
  return e.isWalkable() && (this.faceR() || ![PrinceJS.Level.TILE_TAPESTRY].includes(e.element));
};
PrinceJS.Kid.prototype.damageLife = function (e = !1) {
  this.alive &&
    (this.showSplash(),
    PrinceJS.Utils.flashRedDamage(this.game),
    e && (this.splash.y = -5),
    this.health > 1 ? ((this.health -= 1), this.onDamageLife.dispatch(1)) : this.die());
};
PrinceJS.Kid.prototype.stealLife = function () {
  if (this.health > 1) {
    let e = this.health - 1;
    (this.health = 1), this.onDamageLife.dispatch(e);
  }
};
PrinceJS.Kid.prototype.recoverLife = function () {
  this.health < this.maxHealth && (this.health++, this.onRecoverLive.dispatch());
};
PrinceJS.Kid.prototype.addLife = function () {
  this.maxHealth < 10 && this.maxHealth++, (this.health = this.maxHealth), this.onAddLive.dispatch();
};
PrinceJS.Kid.prototype.flipScreen = function () {
  PrinceJS.Utils.toggleFlipScreen(), this.onFlipped.dispatch();
};
PrinceJS.Kid.prototype.floatFall = function () {
  this.inFloatTimeoutCancel !== null && (this.inFloatTimeoutCancel(), (this.inFloatTimeoutCancel = null)),
    (this.inFloat = !0),
    this.game.sound.play("Float");
  let e = PrinceJS.Utils.delayedCancelable(() => {
    (this.inFloat = !1), (this.inFloatTimeoutCancel = null), (this.fallingBlocks = 0);
  }, 18e3);
  this.inFloatTimeoutCancel = e.cancel;
};
PrinceJS.Kid.prototype.damageStruck = function () {
  this.alive &&
    (this.action.includes("land") ||
      (this.fallingBlocks < 2 && (this.fallingBlocks = 2), this.inFallDown || this.land()));
};
PrinceJS.Kid.prototype.proceedOnDead = function () {
  PrinceJS.Utils.delayed(() => {
    this.game &&
      (this.opponent && this.opponent.baseCharName === "jaffar"
        ? this.game.sound.play("HeroicDeath")
        : this.game.sound.play("Accident"),
      this.onDead.dispatch());
  }, 1e3);
};
