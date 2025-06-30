PrinceJS.Cutscene = function (e) {
  this.scene;
};
PrinceJS.Cutscene.STATE_SETUP = 0;
PrinceJS.Cutscene.STATE_READY = 1;
PrinceJS.Cutscene.STATE_WAITING = 2;
PrinceJS.Cutscene.STATE_RUNNING = 3;
PrinceJS.Cutscene.prototype = {
  preload: function () {
    switch ((this.game.load.image("cover", "assets/gfx/cover.png"), PrinceJS.currentLevel)) {
      case 1:
        this.game.load.audio("Princess", "assets/music/03_Princess.mp3"),
          this.game.load.audio("Jaffar", "assets/music/04_Jaffar.mp3"),
          this.game.load.audio("Heartbeat", "assets/music/05_Heartbeat.mp3");
        break;
      case 2:
      case 4:
      case 6:
      case 12:
        this.game.load.audio("Heartbeat2", "assets/music/12_Heartbeat_2.mp3");
        break;
      case 8:
      case 9:
        this.game.load.audio("Timer", "assets/music/17_Timer.mp3");
        break;
      case 15:
        this.game.load.audio("Embrace", "assets/music/21_Embrace.mp3");
        break;
      case 16:
        this.game.load.audio("TragicEnd", "assets/music/18_Tragic_End.mp3");
        break;
    }
    this.load.json("cutscene", "assets/cutscenes/scene" + PrinceJS.currentLevel + ".json");
  },
  create: function () {
    this.reset();
    let e = this.game.cache.getJSON("cutscene");
    if (!e) {
      this.next();
      return;
    }
    (this.program = e.program),
      (this.scene = new PrinceJS.Scene(this.game)),
      (this.cover = this.game.add.sprite(0, 0, "cover")),
      this.scene.front.addChild(this.cover),
      this.executeProgram(),
      (this.input.keyboard.onDownCallback = null),
      PrinceJS.Utils.delayed(() => {
        this.input.keyboard.onDownCallback = this.continue.bind(this);
      }, 1e3),
      this.game.time.events.loop(120, this.updateScene, this);
  },
  executeProgram: function () {
    if (this.sceneState === PrinceJS.Cutscene.STATE_WAITING) {
      this.waitingTime--, this.waitingTime === 0 && (this.sceneState = PrinceJS.Cutscene.STATE_READY);
      return;
    }
    for (; this.sceneState === PrinceJS.Cutscene.STATE_SETUP || this.sceneState === PrinceJS.Cutscene.STATE_RUNNING; ) {
      let e = this.program[this.pc],
        t;
      switch (e.i) {
        case "START":
          this.world.sort("z"),
            (this.sceneState = PrinceJS.Cutscene.STATE_READY),
            e.p1 === 0 ? this.fadeOut(1) : this.fadeIn();
          break;
        case "END":
          this.endCutscene(e.p1 !== 0), (this.sceneState = PrinceJS.Cutscene.STATE_WAITING), (this.waitingTime = 1e3);
          break;
        case "ACTION":
          (t = this.actors[e.p1]), (t.action = e.p2);
          break;
        case "ADD_ACTOR":
          (t = new PrinceJS.Actor(this.game, e.p3, e.p4, e.p5, e.p2)), (this.actors[e.p1] = t);
          break;
        case "REM_ACTOR":
          this.actors[e.p1].kill();
          break;
        case "ADD_OBJECT":
          (this.objects[e.p1] = new PrinceJS.Tile.Clock(this.game, e.p3, e.p4, e.p2)),
            this.scene.addObject(this.objects[e.p1]);
          break;
        case "START_OBJECT":
          this.objects[e.p1].activate();
          break;
        case "EFFECT":
          this.scene.effect();
          break;
        case "WAIT":
          (this.sceneState = PrinceJS.Cutscene.STATE_WAITING), (this.waitingTime = e.p1);
          break;
        case "MUSIC":
          this.stopMusic(), this.game.sound.play(e.p2);
          break;
        case "SOUND":
          this.game.sound.play(e.p2);
          break;
        case "FADEIN":
          this.fadeIn(e.p1 * 120);
          break;
        case "FADEOUT":
          this.fadeOut(e.p1 * 120);
          break;
      }
      this.pc++;
    }
  },
  update: function () {
    PrinceJS.Utils.continueGame(this.game) && this.continue();
  },
  updateScene: function () {
    if (this.sceneState !== PrinceJS.Cutscene.STATE_RUNNING) {
      this.sceneState === PrinceJS.Cutscene.STATE_READY && (this.sceneState = PrinceJS.Cutscene.STATE_RUNNING),
        this.executeProgram(),
        this.scene.update();
      for (let e = 0; e < this.actors.length; e++) this.actors[e].updateActor();
    }
  },
  endCutscene: function (e = !0) {
    e
      ? this.fadeOut(2e3, () => {
          this.next();
        })
      : this.next();
  },
  continue: function () {
    PrinceJS.currentLevel < 15 ? this.play() : this.next();
  },
  play: function () {
    this.stopMusic(), (this.input.keyboard.onDownCallback = null), this.state.start("Game");
  },
  next: function () {
    (this.input.keyboard.onDownCallback = null),
      PrinceJS.currentLevel === 1
        ? this.state.start("Credits")
        : PrinceJS.currentLevel === 15
        ? (PrinceJS.Restart(), this.state.start("EndTitle"))
        : PrinceJS.currentLevel === 16
        ? (PrinceJS.Restart(), this.state.start("Title"))
        : this.play();
  },
  reset: function () {
    (this.actors = []),
      (this.objects = []),
      (this.pc = 0),
      (this.waitingTime = 0),
      (this.sceneState = PrinceJS.Cutscene.STATE_SETUP);
  },
  stopMusic: function () {
    this.game.sound.stopAll();
  },
  fadeIn: function (e = 2e3, t) {
    this.game.add.tween(this.cover).to({ alpha: 0 }, 2e3, Phaser.Easing.Linear.None, !0, 0, 0, !1),
      PrinceJS.Utils.delayed(() => {
        t && t();
      }, e);
  },
  fadeOut: function (e = 2e3, t) {
    this.game.add.tween(this.cover).to({ alpha: 1 }, 2e3, Phaser.Easing.Linear.None, !0, 0, 0, !1),
      PrinceJS.Utils.delayed(() => {
        t && t();
      }, e);
  }
};
