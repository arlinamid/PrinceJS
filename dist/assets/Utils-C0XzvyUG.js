PrinceJS.Utils = {
  convertX: function (e) {
    return Math.floor((e * 320) / 140);
  },
  convertXtoBlockX: function (e) {
    return Math.floor((e - 7) / 14);
  },
  convertYtoBlockY: function (e) {
    return Math.floor(e / PrinceJS.BLOCK_HEIGHT);
  },
  convertBlockXtoX: function (e) {
    return e * 14 + 7;
  },
  convertBlockYtoY: function (e) {
    return (e + 1) * PrinceJS.BLOCK_HEIGHT - 10;
  },
  delayed: function (e, t) {
    return new Promise((n) => {
      setTimeout(() => {
        Promise.resolve()
          .then(() => e && e())
          .then((i) => {
            n(i);
          });
      }, t);
    });
  },
  delayedCancelable: function (e, t) {
    let n;
    return {
      cancel: () => {
        clearTimeout(n);
      },
      promise: new Promise((i) => {
        n = setTimeout(() => {
          Promise.resolve()
            .then(() => e && e())
            .then((r) => {
              i(r);
            });
        }, t);
      })
    };
  },
  perform: function (e, t) {
    return new Promise((n) => {
      let i = e && e();
      setTimeout(() => {
        n(i);
      }, t);
    });
  },
  flashScreen: function (e, t, n, i) {
    for (let r = 0; r < t * 2; r++)
      PrinceJS.Utils.delayed(() => {
        (e.stage.backgroundColor = r % 2 === 0 ? n : 0), PrinceJS.InterfaceCurrent.flash(e.stage.backgroundColor);
      }, i * r);
  },
  flashPattern: function (e, t, n) {
    return n.reduce(
      (i, r) => i.then(() => (PrinceJS.Utils.flashScreen(e, 1, t, r), PrinceJS.Utils.delayed(void 0, 4 * r))),
      Promise.resolve()
    );
  },
  flashRedDamage: function (e) {
    PrinceJS.Utils.flashPattern(e, PrinceJS.Level.FLASH_RED, [25]);
  },
  flashRedPotion: function (e) {
    PrinceJS.Utils.flashPattern(e, PrinceJS.Level.FLASH_RED, [50, 25, 25]);
  },
  flashGreenPotion: function (e) {
    PrinceJS.Utils.flashPattern(e, PrinceJS.Level.FLASH_GREEN, [50, 25, 25]);
  },
  flashYellowSword: function (e) {
    PrinceJS.Utils.flashPattern(e, PrinceJS.Level.FLASH_YELLOW, [50, 25, 25, 50, 25, 25, 25]);
  },
  flashWhiteShadowMerge: function (e) {
    PrinceJS.Utils.flashPattern(
      e,
      PrinceJS.Level.FLASH_WHITE,
      [50, 25, 25, 50, 25, 25, 25, 50, 25, 25, 50, 25, 25, 25]
    );
  },
  flashWhiteVizierVictory: function (e) {
    PrinceJS.Utils.flashPattern(e, PrinceJS.Level.FLASH_WHITE, [25, 25, 100, 100, 50, 50, 25, 25, 50]);
  },
  random: function (e) {
    return Math.floor(Math.random() * Math.floor(e));
  },
  continueGame: function (e) {
    return PrinceJS.Utils.pointerPressed(e) || PrinceJS.Utils.gamepadAnyPressed(e);
  },
  gamepadButtonPressedCheck: function (e, t, n = "default") {
    if (this[`_${n}Pressed`]) return !1;
    let i = !1,
      r = e.input.gamepad.pad1;
    if (r && r.connected) {
      t || (t = Object.keys(r._rawPad.buttons).map((s) => parseInt(s)));
      for (let s of t) r.justPressed(s) && (i = !0);
    }
    return (
      i &&
        ((this[`_${n}Pressed`] = !0),
        PrinceJS.Utils.delayed(() => {
          this[`_${n}Pressed`] = !1;
        }, 500)),
      i
    );
  },
  gamepadButtonDownCheck: function (e, t) {
    let n = e.input.gamepad.pad1;
    if (n && n.connected) {
      t || (t = Object.keys(n._rawPad.buttons).map((i) => parseInt(i)));
      for (let i of t) if (n.isDown(i)) return !0;
    }
    return !1;
  },
  gamepadAxisCheck: function (e, t, n) {
    let i = e.input.gamepad.pad1;
    if (i && i.connected)
      for (let r of t) {
        if (n === "<" && i.axis(r) < -0.75) return !0;
        if (n === ">" && i.axis(r) > 0.75) return !0;
      }
    return !1;
  },
  gamepadAnyPressed: function (e) {
    return PrinceJS.Utils.gamepadButtonPressedCheck(e);
  },
  gamepadUpPressed: function (e) {
    return (
      PrinceJS.Utils.gamepadButtonDownCheck(e, [
        PrinceJS.Gamepad.A,
        PrinceJS.Gamepad.R,
        PrinceJS.Gamepad.ZR,
        PrinceJS.Gamepad.DPadU
      ]) || PrinceJS.Utils.gamepadAxisCheck(e, [PrinceJS.Gamepad.Axis.LY, PrinceJS.Gamepad.Axis.RY], "<")
    );
  },
  gamepadDownPressed: function (e) {
    return (
      PrinceJS.Utils.gamepadButtonDownCheck(e, [PrinceJS.Gamepad.DPadD]) ||
      PrinceJS.Utils.gamepadAxisCheck(e, [PrinceJS.Gamepad.Axis.LY, PrinceJS.Gamepad.Axis.RY], ">")
    );
  },
  gamepadLeftPressed: function (e) {
    return (
      PrinceJS.Utils.gamepadButtonDownCheck(e, [PrinceJS.Gamepad.DPadL]) ||
      PrinceJS.Utils.gamepadAxisCheck(e, [PrinceJS.Gamepad.Axis.LX, PrinceJS.Gamepad.Axis.RX], "<")
    );
  },
  gamepadRightPressed: function (e) {
    return (
      PrinceJS.Utils.gamepadButtonDownCheck(e, [PrinceJS.Gamepad.DPadR]) ||
      PrinceJS.Utils.gamepadAxisCheck(e, [PrinceJS.Gamepad.Axis.LX, PrinceJS.Gamepad.Axis.RX], ">")
    );
  },
  gamepadActionPressed: function (e) {
    return PrinceJS.Utils.gamepadButtonDownCheck(e, [
      PrinceJS.Gamepad.B,
      PrinceJS.Gamepad.Y,
      PrinceJS.Gamepad.L,
      PrinceJS.Gamepad.ZL
    ]);
  },
  gamepadInfoPressed: function (e) {
    return PrinceJS.Utils.gamepadButtonPressedCheck(e, [PrinceJS.Gamepad.X], "info");
  },
  gamepadPreviousPressed: function (e) {
    return PrinceJS.Utils.gamepadButtonPressedCheck(e, [PrinceJS.Gamepad.Minus], "previous");
  },
  gamepadNextPressed: function (e) {
    return PrinceJS.Utils.gamepadButtonPressedCheck(e, [PrinceJS.Gamepad.Plus], "next");
  },
  pointerPressed: function (e) {
    let t = this._pointerPressed;
    return (this._pointerPressed = PrinceJS.Utils.pointerDown(e)), t && !this._pointerPressed;
  },
  pointerDown: function (e) {
    return (e.input.activePointer.leftButton && e.input.activePointer.leftButton.isDown) ||
      e.input.activePointer.isDown ||
      e.input.pointer1.isDown
      ? !0
      : e.input.pointer2.isDown;
  },
  effectivePointer: function (e) {
    let t = document.getElementsByTagName("canvas")[0].getBoundingClientRect().width,
      n = document.getElementsByTagName("canvas")[0].getBoundingClientRect().height,
      i = PrinceJS.Utils.effectiveScreenSize(e),
      r =
        e.input.activePointer.x ||
        (e.input.pointer1.isDown && e.input.pointer1.x) ||
        (e.input.pointer2.isDown && e.input.pointer2.x) ||
        0,
      s =
        e.input.activePointer.y ||
        (e.input.pointer1.isDown && e.input.pointer1.y) ||
        (e.input.pointer2.isDown && e.input.pointer2.y) ||
        0;
    return { x: r - (t - i.width) / 2, y: s - (n - i.height) / 2 };
  },
  effectiveScreenSize: function (e) {
    let t = document.getElementsByTagName("canvas")[0].getBoundingClientRect().width,
      n = document.getElementsByTagName("canvas")[0].getBoundingClientRect().height;
    return t / n >= PrinceJS.WORLD_RATIO
      ? { width: n * PrinceJS.WORLD_RATIO, height: n }
      : { width: t, height: t / PrinceJS.WORLD_RATIO };
  },
  gameContainer: function () {
    return document.getElementById("gameContainer");
  },
  resetFlipScreen: function () {
    PrinceJS.Utils.gameContainer().classList.remove("flipped");
  },
  toggleFlipScreen: function () {
    PrinceJS.Utils.gameContainer().classList.toggle("flipped");
  },
  isScreenFlipped: function () {
    return PrinceJS.Utils.gameContainer().classList.contains("flipped");
  },
  setRemainingMinutesTo15() {
    if (PrinceJS.Utils.getRemainingMinutes() > 15) {
      PrinceJS.Utils.minutes = 15;
      let e = new Date();
      e.setMinutes(e.getMinutes() - (60 - PrinceJS.Utils.minutes)),
        (PrinceJS.startTime = e),
        PrinceJS.Utils.updateQuery();
    }
  },
  resetRemainingMinutesTo60() {
    (PrinceJS.Utils.minutes = 60),
      (PrinceJS.startTime = void 0),
      (PrinceJS.endTime = void 0),
      PrinceJS.Utils.updateQuery();
  },
  getDeltaTime: function () {
    if (!PrinceJS.startTime) return { minutes: -1, seconds: -1 };
    let e = (PrinceJS.endTime || new Date()).getTime() - PrinceJS.startTime.getTime(),
      t = Math.floor(e / 6e4),
      n = Math.floor(e / 1e3) % 60;
    return { minutes: t, seconds: n };
  },
  getRemainingMinutes: function () {
    let e = PrinceJS.Utils.getDeltaTime();
    return Math.min(60, Math.max(0, 60 - e.minutes));
  },
  getRemainingSeconds: function () {
    let e = PrinceJS.Utils.getDeltaTime();
    return Math.min(60, Math.max(0, 60 - e.seconds));
  },
  applyStrength: function (e) {
    return PrinceJS.strength >= 0 && PrinceJS.strength < 100 ? Math.ceil((e * PrinceJS.strength) / 100) : e;
  },
  applyQuery: function () {
    let e = new URLSearchParams(window.location.search);
    if (e.get("level") || e.get("l")) {
      let t = parseInt(e.get("level") || e.get("l"), 10);
      ((!isNaN(t) && t >= 1 && t <= 14) || t >= 90) && (PrinceJS.currentLevel = t);
    }
    if (e.get("health") || e.get("h")) {
      let t = parseInt(e.get("health") || e.get("h"), 10);
      !isNaN(t) && t >= 3 && t <= 10 && (PrinceJS.maxHealth = t);
    }
    if (e.get("time") || e.get("t")) {
      let t = parseInt(e.get("time") || e.get("t"), 10);
      !isNaN(t) && t >= 1 && t <= 60 && (PrinceJS.minutes = t);
    }
    if (e.get("strength") || e.get("s")) {
      let t = parseInt(e.get("strength") || e.get("s"), 10);
      !isNaN(t) && t >= 0 && t <= 100 && (PrinceJS.strength = t);
    }
    if (e.get("width") || e.get("w")) {
      let t = parseInt(e.get("width") || e.get("w"), 10);
      !isNaN(t) && t > 0 && (PrinceJS.screenWidth = t);
    }
    (e.get("shortcut") || e.get("_")) && (PrinceJS.shortcut = (e.get("shortcut") || e.get("_")) === "true");
  },
  applyScreenWidth() {
    PrinceJS.screenWidth > 0 && (PrinceJS.Utils.gameContainer().style["max-width"] = PrinceJS.screenWidth + "px");
  },
  updateQuery: function () {
    (PrinceJS.minutes = PrinceJS.Utils.getRemainingMinutes()),
      PrinceJS.shortcut
        ? PrinceJS.Utils.setHistoryState({
            l: PrinceJS.currentLevel,
            h: PrinceJS.maxHealth,
            t: PrinceJS.minutes,
            s: PrinceJS.strength,
            w: PrinceJS.screenWidth,
            _: !0
          })
        : PrinceJS.Utils.setHistoryState({
            level: PrinceJS.currentLevel,
            health: PrinceJS.maxHealth,
            time: PrinceJS.minutes,
            strength: PrinceJS.strength,
            width: PrinceJS.screenWidth
          });
  },
  restoreQuery: function () {
    if (PrinceJS.Utils.getRemainingMinutes() < PrinceJS.minutes) {
      let e = new Date();
      e.setMinutes(e.getMinutes() - (60 - PrinceJS.minutes)), (PrinceJS.startTime = e);
    }
  },
  clearQuery: function () {
    PrinceJS.shortcut
      ? PrinceJS.Utils.setHistoryState({ s: PrinceJS.strength, w: PrinceJS.screenWidth, _: !0 })
      : PrinceJS.Utils.setHistoryState({ strength: PrinceJS.strength, width: PrinceJS.screenWidth });
  },
  setHistoryState(e) {
    history.replaceState(
      null,
      null,
      "?" +
        Object.keys(e)
          .map((t) => t + "=" + e[t])
          .join("&")
    );
  }
};
