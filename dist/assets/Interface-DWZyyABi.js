PrinceJS.Interface = function (e, i) {
  (this.game = e), (this.delegate = i);
  let t = this.game.make.bitmapData(PrinceJS.SCREEN_WIDTH, PrinceJS.UI_HEIGHT);
  t.fill(0, 0, 0),
    (this.layer = this.game.add.sprite(0, (PrinceJS.SCREEN_HEIGHT - PrinceJS.UI_HEIGHT) * PrinceJS.SCALE_FACTOR, t)),
    (this.layer.fixedToCamera = !0);
  let s = this.game.make.bitmapData(PrinceJS.SCREEN_WIDTH, PrinceJS.UI_HEIGHT);
  s.fill(255, 0, 0),
    (this.layerRed = this.game.add.sprite(0, 0, s)),
    (this.layerRed.visible = !1),
    this.layer.addChild(this.layerRed);
  let h = this.game.make.bitmapData(PrinceJS.SCREEN_WIDTH, PrinceJS.UI_HEIGHT);
  h.fill(0, 255, 0),
    (this.layerGreen = this.game.add.sprite(0, 0, h)),
    (this.layerGreen.visible = !1),
    this.layer.addChild(this.layerGreen);
  let n = this.game.make.bitmapData(PrinceJS.SCREEN_WIDTH, PrinceJS.UI_HEIGHT);
  n.fill(255, 255, 0),
    (this.layerYellow = this.game.add.sprite(0, 0, n)),
    (this.layerYellow.visible = !1),
    this.layer.addChild(this.layerYellow);
  let a = this.game.make.bitmapData(PrinceJS.SCREEN_WIDTH, PrinceJS.UI_HEIGHT);
  a.fill(255, 255, 255),
    (this.layerWhite = this.game.add.sprite(0, 0, a)),
    (this.layerWhite.visible = !1),
    this.layer.addChild(this.layerWhite),
    (this.flashMap = {
      [PrinceJS.Level.FLASH_RED]: this.layerRed,
      [PrinceJS.Level.FLASH_GREEN]: this.layerGreen,
      [PrinceJS.Level.FLASH_YELLOW]: this.layerYellow,
      [PrinceJS.Level.FLASH_WHITE]: this.layerWhite
    }),
    (this.text = this.game.make.bitmapText(
      PrinceJS.SCREEN_WIDTH * 0.5,
      (PrinceJS.UI_HEIGHT - 2) * 0.5,
      "font",
      "",
      16
    )),
    this.text.anchor.setTo(0.5, 0.5),
    (this.showTextType = null),
    this.showLevel(),
    this.layer.addChild(this.text),
    (this.player = null),
    (this.playerHPs = []),
    (this.playerHPActive = 0),
    (this.opp = null),
    (this.oppHPs = []),
    (this.oppHPActive = 0),
    (this.pressButtonToContinueTimer = -1),
    (this.hideTextTimer = -1),
    (PrinceJS.InterfaceCurrent = this);
};
PrinceJS.Interface.prototype = {
  setPlayerLive: function (e) {
    (this.player = e), (this.playerHPActive = this.player.health);
    for (let i = 0; i < this.playerHPActive; i++)
      (this.playerHPs[i] = this.game.add.sprite(i * 7, 2, "general", "kid-live")),
        this.layer.addChild(this.playerHPs[i]);
    for (let i = this.playerHPActive; i < this.player.maxHealth; i++)
      (this.playerHPs[i] = this.game.add.sprite(i * 7, 2, "general", "kid-emptylive")),
        this.layer.addChild(this.playerHPs[i]);
    this.player.onDamageLife.add(this.damagePlayerLive, this),
      this.player.onRecoverLive.add(this.recoverPlayerLive, this),
      this.player.onAddLive.add(this.addPlayerLive, this);
  },
  damagePlayerLive: function (e) {
    let i = Math.min(this.playerHPActive, e);
    for (let t = 0; t < i; t++)
      this.playerHPActive--, (this.playerHPs[this.playerHPActive].frameName = "kid-emptylive");
  },
  recoverPlayerLive: function () {
    (this.playerHPs[0].frameName = "kid-live"),
      (this.playerHPs[this.playerHPActive].frameName = "kid-live"),
      this.playerHPActive++;
  },
  addPlayerLive: function () {
    if (((this.playerHPActive = this.playerHPs.length), this.playerHPs.length < 10)) {
      let e = this.game.add.sprite(this.playerHPActive * 7, 2, "general", "kid-live");
      (this.playerHPs[this.playerHPActive] = e), this.layer.addChild(e), this.playerHPActive++;
    }
    for (let e = 0; e < this.playerHPActive; e++) this.playerHPs[e].frameName = "kid-live";
  },
  setOpponentLive: function (e) {
    if (this.opp !== e && (this.resetOpponentLive(), (this.opp = e), !(!e || !e.active || e.charName === "skeleton"))) {
      (this.oppHPs = []), (this.oppHPActive = e.health);
      for (let i = e.health; i > 0; i--)
        (this.oppHPs[i - 1] = this.game.add.sprite(
          PrinceJS.SCREEN_WIDTH - i * 7 + 1,
          2,
          "general",
          e.baseCharName + "-live"
        )),
          e.charColor > 0 && (this.oppHPs[i - 1].tint = PrinceJS.Enemy.COLOR[e.charColor - 1]),
          this.layer.addChild(this.oppHPs[i - 1]);
      e.onDamageLife.add(this.damageOpponentLive, this), e.onDead.add(this.resetOpponentLive, this);
    }
  },
  resetOpponentLive: function () {
    if (this.opp) {
      for (let e = 0; e < this.oppHPs.length; e++) this.oppHPs[e].destroy();
      this.opp.onDamageLife.removeAll(),
        this.opp.onDead.removeAll(),
        (this.opp = null),
        (this.oppHPs = []),
        (this.oppHPActive = 0);
    }
  },
  damageOpponentLive: function (e) {
    if (!this.opp || this.opp.charName === "skeleton") return;
    let i = Math.min(this.oppHPActive, e);
    for (let t = 0; t < i; t++) this.oppHPActive--, (this.oppHPs[this.oppHPActive].visible = !1);
  },
  updateUI: function () {
    this.showRegularRemainingTime(),
      this.playerHPActive === 1 &&
        (this.playerHPs[0].frameName === "kid-live"
          ? (this.playerHPs[0].frameName = "kid-emptylive")
          : (this.playerHPs[0].frameName = "kid-live")),
      this.oppHPActive === 1 && (this.oppHPs[0].visible = !this.oppHPs[0].visible),
      this.pressButtonToContinueTimer > -1 &&
        (this.pressButtonToContinueTimer--,
        this.pressButtonToContinueTimer < 70 &&
          this.pressButtonToContinueTimer % 7 === 0 &&
          ((this.text.visible = !this.text.visible), this.text.visible && this.game.sound.play("Beep"))),
      this.hideTextTimer > -1 && (this.hideTextTimer--, this.hideTextTimer === 0 && this.hideText());
  },
  showLevel: function () {
    PrinceJS.endTime ||
      PrinceJS.skipShowLevel ||
      (this.showText("LEVEL " + PrinceJS.currentLevel, "level"),
      (this.hideTextTimer = 25),
      PrinceJS.Utils.delayed(() => {
        (!this.showTextType || this.showTextType === "level") && (this.hideText(), this.showRegularRemainingTime(!0));
      }, 2e3));
  },
  showRegularRemainingTime: function (e) {
    PrinceJS.endTime ||
      (PrinceJS.Utils.getRemainingMinutes() === 0
        ? (this.showRemainingSeconds(), this.delegate.timeUp(), (PrinceJS.startTime = null))
        : PrinceJS.Utils.getRemainingMinutes() === 1
        ? this.showRemainingSeconds()
        : (e ||
            (PrinceJS.Utils.getRemainingMinutes() < 60 &&
              PrinceJS.Utils.getRemainingMinutes() % 5 === 0 &&
              PrinceJS.Utils.getDeltaTime().seconds === 0)) &&
          this.showRemainingMinutes(e));
  },
  showRemainingMinutes: function (e) {
    if (this.showTextType && !e) return;
    let i = PrinceJS.Utils.getRemainingMinutes();
    this.showText(i + (i === 1 ? " MINUTE " : " MINUTES ") + "LEFT", "minutes"), (this.hideTextTimer = 30);
  },
  isRemainingMinutesShown: function () {
    return this.showTextType === "minutes";
  },
  isLevelShown: function () {
    return this.showTextType === "level";
  },
  showRemainingSeconds: function () {
    if (["level", "continue", "paused"].includes(this.showTextType)) return;
    let e = 0;
    PrinceJS.Utils.getRemainingMinutes() > 0 && (e = PrinceJS.Utils.getRemainingSeconds()),
      this.showText(e + (e === 1 ? " SECOND " : " SECONDS ") + "LEFT", "seconds");
  },
  showPressButtonToContinue: function () {
    PrinceJS.Utils.delayed(() => {
      this.showText("Press Button to Continue", "continue"), (this.pressButtonToContinueTimer = 200);
    }, 4e3);
  },
  showGamePaused: function () {
    this.showText("GAME PAUSED", "paused");
  },
  showText: function (e, i) {
    this.text.setText(e), (this.showTextType = i), (this.hideTextTimer = -1);
  },
  hideText: function () {
    this.text.setText(""), (this.showTextType = null), (this.hideTextTimer = -1);
  },
  flipped: function () {
    (this.text.scale.y *= -1),
      (this.text.y = (PrinceJS.UI_HEIGHT - 2) * 0.5),
      this.text.scale.y === -1 && (this.text.y += 2);
  },
  flash: function (e) {
    Object.keys(this.flashMap).forEach((i) => {
      this.flashMap[i].visible = i === String(e);
    });
  }
};
