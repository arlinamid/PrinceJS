PrinceJS.Game = function (e) {
  this.kid, this.level, this.ui, this.currentRoom, (this.enemies = []);
};
PrinceJS.Game.prototype = {
  preload: function () {
    this.game.load.audio("TheShadow", "assets/music/15_The_Shadow.mp3"),
      this.game.load.audio("Float", "assets/music/16_Float.mp3"),
      this.game.load.audio("Jaffar2", "assets/music/19_Jaffar_2.mp3"),
      this.game.load.audio("JaffarDead", "assets/music/20_Jaffar_Dead.mp3"),
      this.game.load.audio("HeroicDeath", "assets/music/13_Heroic_Death.mp3");
    let e = PrinceJS.currentLevel < 90 ? "assets/maps/" : "assets/maps/custom/";
    this.load.json("level", e + "level" + PrinceJS.currentLevel + ".json");
  },
  create: function () {
    if (
      (this.game.sound.stopAll(),
      (this.continueTimer = -1),
      (this.pressButtonToContinueTimer = -1),
      (this.pressButtonToNext = !1),
      !PrinceJS.startTime)
    ) {
      let r = new Date();
      r.setMinutes(r.getMinutes() - (60 - PrinceJS.minutes)), (PrinceJS.startTime = r);
    }
    let e = this.game.cache.getJSON("level");
    if (!e) {
      this.restartGame();
      return;
    }
    (this.level = new PrinceJS.LevelBuilder(this.game, this).buildFromJSON(e)),
      (this.specialEvents = e.prince.specialEvents !== !1),
      (this.playDanger = e.prince.danger !== !1),
      (this.shadow = null),
      (this.mouse = null);
    for (let r = 0; r < e.guards.length; r++) {
      let s = e.guards[r],
        n = new PrinceJS.Enemy(
          this.game,
          this.level,
          s.location + (s.bias || 0),
          s.direction * (s.reverse || 1),
          s.room,
          s.skill,
          s.colors,
          s.type,
          r + 1
        );
      s.visible === !1 && n.setInvisible(),
        s.active === !1 && n.setInactive(),
        s.sneak === !1 && n.setSneakUp(!1),
        n.onInitLife.add((h) => {
          this.ui.setOpponentLive(h);
        }, this),
        this.enemies.push(n),
        n.charName === "shadow" && (this.shadow = n);
    }
    let i = e.prince.turn !== !1,
      t = e.prince.direction * (e.prince.reverse || 1);
    i && (t = -t),
      (this.kid = new PrinceJS.Kid(this.game, this.level, e.prince.location + (e.prince.bias || 0), t, e.prince.room)),
      typeof e.prince.sword == "boolean" && (this.kid.hasSword = e.prince.sword),
      i &&
        ((this.kid.charX += 7),
        PrinceJS.Utils.delayed(() => {
          this.kid.action = "turn";
        }, 100)),
      (this.kid.charX += e.prince.offset || 0),
      this.game.onPause.add(this.onPause, this),
      this.game.onResume.add(this.onResume, this),
      this.kid.onChangeRoom.add(this.changeRoom, this),
      this.kid.onDead.add(this.handleDead, this),
      this.kid.onFlipped.add(this.handleFlipped, this),
      this.kid.onNextLevel.add(this.nextLevel, this),
      this.kid.onLevelFinished.add(this.levelFinished, this),
      PrinceJS.Tile.Gate.reset(),
      (this.visitedRooms = {}),
      (this.currentRoom = e.prince.room),
      (this.blockCamera = !1),
      this.world.sort("z"),
      (this.world.alpha = 1),
      (this.ui = new PrinceJS.Interface(this.game, this)),
      this.ui.setPlayerLive(this.kid),
      this.setupCamera(e.prince.room, e.prince.cameraRoom),
      this.game.time.events.loop(80, this.updateWorld, this),
      this.input.keyboard.addKey(Phaser.Keyboard.R).onDown.add(this.restartGameEvent, this),
      this.input.keyboard.addKey(Phaser.Keyboard.A).onDown.add(this.restartLevelEvent, this),
      this.input.keyboard.addKey(Phaser.Keyboard.L).onDown.add(this.nextLevelEvent, this),
      this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.showRemainingMinutes, this),
      (this.input.keyboard.onDownCallback = this.buttonPressed.bind(this)),
      (this.firstUpdate = !0),
      PrinceJS.danger === null && (PrinceJS.danger = this.level.number === 1 && this.playDanger),
      PrinceJS.Utils.resetFlipScreen(),
      PrinceJS.Utils.updateQuery();
  },
  update: function () {
    if (PrinceJS.Utils.continueGame(this.game)) {
      this.buttonPressed();
      let e = PrinceJS.Utils.effectivePointer(this.game),
        i = PrinceJS.Utils.effectiveScreenSize(this.game);
      ((PrinceJS.Utils.isScreenFlipped() && e.y >= 0 && e.y <= 0.04 * i.height) ||
        (!PrinceJS.Utils.isScreenFlipped() && e.y >= 0.96 * i.height && e.y <= i.height)) &&
        ((this.isRemainingMinutesShown() || this.isLevelShown()) &&
          (e.x >= 0 && e.x <= 0.2 * i.width
            ? this.previousLevel(PrinceJS.currentLevel, !0)
            : e.x >= 0.8 * i.width && e.x <= i.width
            ? this.nextLevel(PrinceJS.currentLevel, !0, !0)
            : e.x >= 0.4 * i.width && e.x <= 0.6 * i.width && this.restartLevel(!0)),
        e.x >= 0 && e.x <= i.width && this.showRemainingMinutes()),
        PrinceJS.Utils.gamepadInfoPressed(this.game)
          ? this.isRemainingMinutesShown() || this.isLevelShown()
            ? this.restartLevel(!0)
            : this.showRemainingMinutes()
          : PrinceJS.Utils.gamepadPreviousPressed(this.game)
          ? this.previousLevel(PrinceJS.currentLevel, !0)
          : PrinceJS.Utils.gamepadNextPressed(this.game) && this.nextLevel(PrinceJS.currentLevel, !0, !0);
    }
  },
  updateWorld: function () {
    this.level.update(), this.kid.updateActor();
    for (let e = 0; e < this.enemies.length; e++) this.enemies[e].updateActor();
    this.mouse && this.mouse.updateActor(),
      this.checkLevelLogic(),
      this.ui.updateUI(),
      this.checkTimers(),
      (this.firstUpdate = !1);
  },
  checkLevelLogic: function () {
    if (!this.specialEvents) return;
    let e, i, t;
    switch (this.level.number) {
      case 1:
        this.firstUpdate &&
          (this.level.fireEvent(8, PrinceJS.Level.TILE_DROP_BUTTON),
          PrinceJS.danger &&
            PrinceJS.Utils.delayed(() => {
              this.game.sound.play("Danger");
            }, 800));
        break;
      case 2:
        if (this.firstUpdate)
          for (let r = 0; r < this.enemies.length; r++) {
            let s = this.enemies[r];
            s && s.room === 24 && s.charBlockX === 0 && s.charBlockY === 1 && ((s.charX -= 12), s.updateBlockXY());
          }
        break;
      case 3:
        if (((i = this.kid.opponent && this.kid.opponent.charName === "skeleton" ? this.kid.opponent : null), i)) {
          if (this.level.exitDoorOpen && this.kid.room === i.room && Math.abs(this.kid.opponentDistance()) < 999) {
            let r = this.level.getTileAt(i.charBlockX, i.charBlockY, i.room);
            r.element === PrinceJS.Level.TILE_SKELETON &&
              (r.removeObject(), i.setActive(), this.game.sound.play("BonesLeapToLife"));
          }
          i.room === 3 &&
            i.setCharForRoom !== i.room &&
            ((i.setCharForRoom = i.room),
            PrinceJS.Utils.delayed(() => {
              i.charFace === -1 && i.turn(),
                (i.room = 3),
                (i.charX = PrinceJS.Utils.convertBlockXtoX(4)),
                (i.charY = PrinceJS.Utils.convertBlockYtoY(1)),
                (i.action = "stand"),
                this.kid.sheathe();
            }, 100)),
            i.room === 3 &&
              i.charBlockY === 1 &&
              i.charX <= 45 &&
              !i.inFallDown &&
              ((i.charX = 55), i.updateBlockXY(), i.startFall()),
            i.room === 8 && !i.defeated && ((i.defeated = !0), this.game.sound.play("Victory"), this.kid.sheathe());
        }
        break;
      case 4:
        this.level.exitDoorOpen && this.kid.room === 11 && this.kid.charBlockY === 0
          ? ((t = this.level.getTileAt(4, 0, 4)),
            t instanceof PrinceJS.Tile.Mirror && (t.addObject(), (this.kid.delegate = t), (this.level.mirror = t)))
          : this.level.exitDoorOpen &&
            this.currentCameraRoom === 4 &&
            this.kid.charBlockY === 0 &&
            this.level.mirror &&
            !this.level.mirrorDetected &&
            ((this.level.mirrorDetected = !0),
            PrinceJS.Utils.delayed(() => {
              this.game.sound.play("Danger");
            }, 100)),
          (t = this.level.getTileAt(this.kid.charBlockX - this.kid.charFace, this.kid.charBlockY, this.kid.room)),
          t &&
            t.element === PrinceJS.Level.TILE_MIRROR &&
            this.kid.action === "runjump" &&
            this.kid.faceL() &&
            !this.level.shadowOutOfMirror &&
            (this.kid.distanceToFloor() === 0
              ? this.kid.bump()
              : (t.hideReflection(),
                this.shadow && this.shadow.appearOutOfMirror(t),
                (this.level.shadowOutOfMirror = !0),
                this.game.sound.play("Mirror"),
                this.kid.stealLife())),
          this.level.mirror &&
            this.kid.room === 4 &&
            this.kid.charBlockX <= 3 &&
            this.kid.charBlockY === 1 &&
            ((t = this.level.getTileAt(4, 0, 4)), t && t.element === PrinceJS.Level.TILE_MIRROR && t.hideReflection()),
          this.shadow &&
            this.shadow.visible &&
            this.shadow.charBlockY > 0 &&
            ((this.shadow.action = "stand"), this.shadow.setInvisible());
        break;
      case 5:
        this.shadow &&
          ((t = this.level.getTileAt(1, 0, 24)),
          t.state === PrinceJS.Tile.Gate.STATE_RAISING &&
            !this.shadow.visible &&
            this.shadow.faceR() &&
            ((this.shadow.visible = !0),
            this.performProgram(
              [
                { i: "ACTION", p1: 2600, p2: "running" },
                { i: "ACTION", p1: 700, p2: "runstop" },
                { i: "ACTION", p1: 0, p2: "drinkpotion" },
                { i: "SOUND", p1: 0, p2: "DrinkPotionGlugGlug" },
                { i: "REM_OBJECT" },
                { i: "WAIT", p1: 1500 },
                { i: "ACTION", p1: 500, p2: "turn" },
                { i: "ACTION", p1: 3e3, p2: "running" }
              ],
              this.shadow
            )),
          this.shadow.visible &&
            (this.currentCameraRoom === 11 ||
              (this.shadow.room === 11 && this.shadow.charBlockX === 8 && this.shadow.faceL())) &&
            ((this.shadow.action = "stand"), this.shadow.setInvisible()));
        break;
      case 6:
        this.shadow &&
          (this.firstUpdate && (this.shadow.charX += 8),
          this.currentCameraRoom === 1 &&
            (this.level.shadowDetected || ((this.level.shadowDetected = !0), this.game.sound.play("Danger")),
            this.kid.charBlockX === 6 && (this.shadow.action = "step11"))),
          this.currentCameraRoom === 1 &&
            this.kid.charBlockY === 2 &&
            this.kid.charY >= 185 &&
            ((this.blockCamera = !0),
            PrinceJS.Utils.delayed(() => {
              this.nextLevel(PrinceJS.currentLevel);
            }, 100));
        break;
      case 8:
        this.level.exitDoorOpen &&
          this.currentCameraRoom === 16 &&
          this.kid.charBlockY === 0 &&
          (this.level.waitForMouse ||
            ((this.level.waitForMouse = !0),
            PrinceJS.Utils.delayed(() => {
              this.level.waitedForMouse = !0;
            }, 12500)),
          this.level.waitedForMouse &&
            !this.mouse &&
            ((this.mouse = new PrinceJS.Mouse(this.game, this.level, 16, 9, -1)),
            this.performProgram(
              [
                { i: "ACTION", p1: 625, p2: "scurry" },
                { i: "ACTION", p1: 0, p2: "stop" },
                { i: "ACTION", p1: 1e3, p2: "raise" },
                { i: "ACTION", p1: 0, p2: "stop" },
                { i: "TURN", p1: 0 },
                { i: "ACTION", p1: 600, p2: "scurry" },
                { i: "REM_ACTOR" }
              ],
              this.mouse
            )));
        break;
      case 12:
        if (
          (this.kid.room === 20 &&
            this.kid.charBlockY === 1 &&
            this.level.getTileAt(1, 0, 15).element === PrinceJS.Level.TILE_SWORD &&
            this.level.removeObject(1, 0, 15),
          this.shadow
            ? (this.kid.room === 15 &&
                (this.kid.charBlockX === 5 || this.kid.charBlockX === 6) &&
                !this.shadow.visible &&
                !this.level.shadowMerge &&
                ((this.shadow.charX = PrinceJS.Utils.convertBlockXtoX(1)),
                (this.shadow.charY = PrinceJS.Utils.convertBlockYtoY(1)),
                this.shadow.setVisible(),
                this.shadow.setActive(),
                PrinceJS.Utils.delayed(() => {
                  (this.shadow.refracTimer = 9),
                    (this.shadow.opponent = this.kid),
                    (this.kid.opponent = this.shadow),
                    (this.kid.opponentSync = !0);
                }, 1e3)),
              !this.shadow.active &&
                this.kid.opponent &&
                Math.abs(this.kid.opponentDistance()) <= (this.kid.action.includes("jump") ? 15 : 7) &&
                !this.level.shadowMerge &&
                ((this.level.shadowMerge = !0),
                (this.level.leapOfFaith = !0),
                this.ui.resetOpponentLive(),
                this.kid.addLife(),
                this.kid.mergeShadowPosition(),
                this.kid.showShadowOverlay(),
                this.kid.flashShadowOverlay(),
                PrinceJS.Utils.flashWhiteShadowMerge(this.game),
                PrinceJS.Utils.delayed(() => {
                  this.game.sound.play("Prince");
                }, 2e3)))
            : (this.level.leapOfFaith = !0),
          this.level.leapOfFaith && !this.level.leapOfFaithSetup && this.level.rooms[2])
        ) {
          this.level.leapOfFaithSetup = !0;
          for (let r = 0; r < 10; r++)
            (t = this.level.getTileAt(r, 0, 2)),
              t &&
                t.element === PrinceJS.Level.TILE_SPACE &&
                ((t.element = PrinceJS.Level.TILE_FLOOR), (t.hidden = !0)),
              r >= 6 &&
                ((t = this.level.getTileAt(r, 0, this.level.rooms[2].links.left)),
                t &&
                  t.element === PrinceJS.Level.TILE_SPACE &&
                  ((t.element = PrinceJS.Level.TILE_FLOOR), (t.hidden = !0)));
        }
        this.currentCameraRoom === 23 && this.nextLevel(PrinceJS.currentLevel);
        break;
      case 13:
        this.firstUpdate && (this.kid.action = "startrun"),
          Object.keys(this.visitedRooms).forEach((r) => {
            if (!["16", "23"].includes(r)) return;
            let s = [2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5);
            for (let n = 0; n < s.length; n++) {
              let h = this.kid.level.getTileAt(s[n], 2, this.level.rooms[r].links.up);
              if (h.element === PrinceJS.Level.TILE_LOOSE_BOARD && !h.fallStarted()) {
                h.shake(!0);
                break;
              }
            }
          }),
          (e = this.kid.opponent && this.kid.opponent.baseCharName === "jaffar" ? this.kid.opponent : null),
          e &&
            (!e.alive && !PrinceJS.endTime && ((PrinceJS.endTime = new Date()), this.showRemainingMinutes()),
            !e.alive &&
              !this.level.triggerOpenExitDoor &&
              ((this.level.triggerOpenExitDoor = !0),
              PrinceJS.Utils.delayed(() => {
                let r = this.level.getTileAt(0, 0, 24);
                r.element === PrinceJS.Level.TILE_RAISE_BUTTON && ((r.mute = !0), r.push());
              }, 7e3)));
        break;
      case 14:
        this.currentCameraRoom === 5 && this.nextLevel(PrinceJS.currentLevel);
        break;
    }
  },
  fireEvent: function (e, i, t) {
    this.level.fireEvent(e, i, t);
  },
  performProgram: function (e, i) {
    return e.reduce(
      (t, r) =>
        t.then(() => {
          let s = r.o || i,
            n;
          switch (r.i) {
            case "ACTION":
              n = () => {
                s.action = r.p2;
              };
              break;
            case "WAIT":
              n = () => {};
              break;
            case "TURN":
              n = () => {
                s.turn();
              };
              break;
            case "SOUND":
              n = () => {
                this.game.sound.play(r.p2);
              };
              break;
            case "REM_OBJECT":
              n = () => {
                this.level.removeObject(s.charBlockX, s.charBlockY, s.room);
              };
              break;
            case "REM_ACTOR":
              n = () => {
                (s.visible = !1), s.kill();
              };
              break;
            default:
              n = r.i;
              break;
          }
          return PrinceJS.Utils.perform(n, r.p1);
        }),
      Promise.resolve()
    );
  },
  checkTimers: function () {
    this.continueTimer > -1 &&
      (this.continueTimer--,
      this.continueTimer === 0 &&
        ((this.continueTimer = -1), this.ui.showPressButtonToContinue(), (this.pressButtonToContinueTimer = 260))),
      this.pressButtonToContinueTimer > -1 &&
        (this.pressButtonToContinueTimer--,
        this.pressButtonToContinueTimer === 0 && ((this.pressButtonToContinueTimer = -1), this.restartGame()));
  },
  showRemainingMinutes: function (e) {
    this.ui.showRemainingMinutes(e);
  },
  isRemainingMinutesShown: function () {
    return this.ui.isRemainingMinutesShown();
  },
  isLevelShown: function () {
    return this.ui.isLevelShown();
  },
  restartGameEvent(e) {
    (!e.ctrlKey && !e.shiftKey) || this.restartGame();
  },
  restartLevelEvent(e) {
    (!e.ctrlKey && !e.shiftKey) || this.restartLevel(!0);
  },
  nextLevelEvent: function (e) {
    (!e.ctrlKey && !e.shiftKey) ||
      (PrinceJS.currentLevel > 3 && PrinceJS.currentLevel < 90) ||
      this.nextLevel(void 0, !0);
  },
  restartGame() {
    (this.input.keyboard.onDownCallback = null), PrinceJS.Restart(), this.state.start("Title");
  },
  restartLevel(e = !0) {
    this.reset(!0), (PrinceJS.skipShowLevel = [13, 14].includes(PrinceJS.currentLevel) && !e);
  },
  levelFinished() {
    this.pressButtonToNext = !0;
  },
  nextLevel: function (e, i = !1, t = !1) {
    if (!(e !== void 0 && e !== PrinceJS.currentLevel)) {
      if (
        ((PrinceJS.danger = null),
        PrinceJS.currentLevel++,
        (PrinceJS.currentHealth = PrinceJS.currentLevel === 13 ? this.kid.health : null),
        (PrinceJS.maxHealth = this.kid.maxHealth),
        PrinceJS.currentLevel > 15 && PrinceJS.currentLevel < 90)
      ) {
        this.restartGame();
        return;
      }
      i && !t && PrinceJS.Utils.setRemainingMinutesTo15(),
        PrinceJS.currentLevel >= 100 && this.level.number === 14 && PrinceJS.Utils.resetRemainingMinutesTo60(),
        this.reset(),
        (PrinceJS.skipShowLevel = [13, 14].includes(PrinceJS.currentLevel) && !i);
    }
  },
  previousLevel: function (e, i = !1) {
    (e !== void 0 && e !== PrinceJS.currentLevel) ||
      ((PrinceJS.danger = null),
      PrinceJS.currentLevel > 1 && PrinceJS.currentLevel--,
      this.reset(),
      (PrinceJS.skipShowLevel = [13, 14].includes(PrinceJS.currentLevel) && !i));
  },
  handleDead: function () {
    this.continueTimer = 10;
  },
  handleFlipped: function () {
    this.ui.flipped();
  },
  handleChop: function (e) {
    e.chop(e.room === this.currentCameraRoom);
  },
  timeUp() {
    PrinceJS.Utils.delayed(() => {
      (PrinceJS.currentLevel = 16), this.state.start("Cutscene");
    }, 1e3);
  },
  outOfRoom() {
    this.kid.die(), this.handleDead();
  },
  buttonPressed: function () {
    this.pressButtonToContinueTimer > -1 && this.reset(!0),
      this.pressButtonToNext && this.nextLevel(PrinceJS.currentLevel);
  },
  reset: function (e) {
    this.game.sound.stopAll(),
      (this.continueTimer = -1),
      (this.pressButtonToContinueTimer = -1),
      (this.pressButtonToNext = !1),
      (this.enemies = []),
      !e && [2, 4, 6, 8, 9, 12, 15].indexOf(PrinceJS.currentLevel) > -1
        ? this.state.start("Cutscene")
        : this.state.start("Game"),
      (PrinceJS.skipShowLevel = [13, 14].includes(PrinceJS.currentLevel));
  },
  onPause: function () {
    PrinceJS.Utils.updateQuery(), this.ui.showGamePaused();
  },
  onResume: function () {
    PrinceJS.Utils.restoreQuery(), this.showRemainingMinutes(!0);
  },
  changeRoom: function (e, i) {
    this.setupCamera(e, i), this.currentRoom !== e && ((this.currentRoom = e), (this.kid.flee = !1));
  },
  setupCamera: function (e, i) {
    if (!this.blockCamera) {
      if (this.currentRoom > 0 && e <= 0) {
        this.outOfRoom();
        return;
      }
      i !== 0 &&
        ((e = i || e),
        this.level.rooms[e] &&
          ((this.game.camera.x = this.level.rooms[e].x * PrinceJS.SCREEN_WIDTH * PrinceJS.SCALE_FACTOR),
          (this.game.camera.y = this.level.rooms[e].y * PrinceJS.ROOM_HEIGHT * PrinceJS.SCALE_FACTOR),
          this.checkForOpponent(e),
          this.level.checkGates(e, this.currentCameraRoom),
          (this.currentCameraRoom = e),
          (this.visitedRooms[this.currentCameraRoom] = !0)));
    }
  },
  checkGateFastDropped: function (e) {
    for (let i = 0; i < this.enemies.length; i++) {
      let t = this.enemies[i];
      t.room === e.room &&
        ((t.faceL() && t.charBlockX <= e.roomX) || (t.faceR() && t.charBlockX >= e.roomX)) &&
        t.turn();
    }
  },
  recheckCurrentRoom: function () {
    this.checkForOpponent(this.currentCameraRoom);
  },
  checkForOpponent: function (e) {
    let i;
    for (let s = 0; s < this.enemies.length; s++) {
      let n = this.enemies[s];
      if (n.alive && this.kid.charBlockY === n.charBlockY && this.kid.opponentInSameRoom(n, e)) {
        i = n;
        break;
      }
    }
    if (!i)
      for (let s = 0; s < this.enemies.length; s++) {
        let n = this.enemies[s];
        if (n.alive && this.kid.charBlockY === n.charBlockY && this.kid.opponentNearRoom(n, e)) {
          i = n;
          break;
        }
      }
    if (!i)
      for (let s = 0; s < this.enemies.length; s++) {
        let n = this.enemies[s];
        if (n.alive && this.kid.opponentInSameRoom(n, e)) {
          i = n;
          break;
        }
      }
    if (!i)
      for (let s = 0; s < this.enemies.length; s++) {
        let n = this.enemies[s];
        if (n.alive && this.kid.opponentNearRoom(n, e)) {
          i = n;
          break;
        }
      }
    i &&
      (i.baseCharName === "jaffar" && i.alive && !i.meet && this.game.sound.play("Jaffar2"),
      this.kid.opponent !== i && ((this.kid.opponent = i), (this.kid.flee = !1)),
      (i.opponent = this.kid),
      (i.meet = !0));
    let t = !1,
      r = !1;
    this.kid.opponent &&
      (this.kid.opponentInSameRoom(this.kid.opponent, e) && (t = !0),
      this.kid.opponentNextRoom(this.kid.opponent, e) && (r = !0)),
      this.ui &&
        (t
          ? this.ui.setOpponentLive(this.kid.opponent)
          : (!this.kid.opponent || this.kid.opponent !== this.ui.opp || !this.kid.opponentOnSameLevel() || !r) &&
            this.ui.resetOpponentLive());
  },
  floorStartFall: function (e) {
    this.level.floorStartFall(e);
  },
  floorStopFall: function (e) {
    this.level.floorStopFall(e), this.kid.checkLooseFloor(e);
    for (let i = 0; i < this.enemies.length; i++) this.enemies[i].checkLooseFloor(e);
  }
};
