(function () {
  const d = document.createElement("link").relList;
  if (d && d.supports && d.supports("modulepreload")) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) n(r);
  new MutationObserver((r) => {
    for (const i of r)
      if (i.type === "childList")
        for (const a of i.addedNodes) a.tagName === "LINK" && a.rel === "modulepreload" && n(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function l(r) {
    const i = {};
    return (
      r.integrity && (i.integrity = r.integrity),
      r.referrerPolicy && (i.referrerPolicy = r.referrerPolicy),
      r.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : r.crossOrigin === "anonymous"
        ? (i.credentials = "omit")
        : (i.credentials = "same-origin"),
      i
    );
  }
  function n(r) {
    if (r.ep) return;
    r.ep = !0;
    const i = l(r);
    fetch(r.href, i);
  }
})();
const T = "modulepreload",
  L = function (e) {
    return "/" + e;
  },
  m = {},
  t = function (d, l, n) {
    let r = Promise.resolve();
    if (l && l.length > 0) {
      let a = function (_) {
        return Promise.all(
          _.map((c) =>
            Promise.resolve(c).then(
              (u) => ({ status: "fulfilled", value: u }),
              (u) => ({ status: "rejected", reason: u })
            )
          )
        );
      };
      document.getElementsByTagName("link");
      const o = document.querySelector("meta[property=csp-nonce]"),
        E = (o == null ? void 0 : o.nonce) || (o == null ? void 0 : o.getAttribute("nonce"));
      r = a(
        l.map((_) => {
          if (((_ = L(_)), _ in m)) return;
          m[_] = !0;
          const c = _.endsWith(".css"),
            u = c ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${_}"]${u}`)) return;
          const s = document.createElement("link");
          if (
            ((s.rel = c ? "stylesheet" : T),
            c || (s.as = "script"),
            (s.crossOrigin = ""),
            (s.href = _),
            E && s.setAttribute("nonce", E),
            document.head.appendChild(s),
            c)
          )
            return new Promise((P, p) => {
              s.addEventListener("load", P),
                s.addEventListener("error", () => p(new Error(`Unable to preload CSS for ${_}`)));
            });
        })
      );
    }
    function i(a) {
      const o = new Event("vite:preloadError", { cancelable: !0 });
      if (((o.payload = a), window.dispatchEvent(o), !o.defaultPrevented)) throw a;
    }
    return r.then((a) => {
      for (const o of a || []) o.status === "rejected" && i(o.reason);
      return d().catch(i);
    });
  };
function f(e) {
  return new Promise((d, l) => {
    const n = document.createElement("script");
    (n.src = e), (n.onload = d), (n.onerror = l), document.head.appendChild(n);
  });
}
function O() {
  window.PrinceJS = {};
  const e = window.PrinceJS;
  (e.SCALE_FACTOR = 2),
    (e.SCREEN_WIDTH = 320),
    (e.SCREEN_HEIGHT = 200),
    (e.WORLD_WIDTH = e.SCREEN_WIDTH * e.SCALE_FACTOR),
    (e.WORLD_HEIGHT = e.SCREEN_HEIGHT * e.SCALE_FACTOR),
    (e.WORLD_RATIO = e.WORLD_WIDTH / e.WORLD_HEIGHT),
    (e.BLOCK_WIDTH = 32),
    (e.BLOCK_HEIGHT = 63),
    (e.ROOM_HEIGHT = e.BLOCK_HEIGHT * 3),
    (e.ROOM_WIDTH = e.SCREEN_WIDTH),
    (e.UI_HEIGHT = 8),
    (e.SKIP_TITLE = !1),
    (e.SKIP_CUTSCENES = !1),
    (e.Init = function () {
      (e.currentLevel = 1),
        (e.maxHealth = 3),
        (e.currentHealth = null),
        (e.minutes = 60),
        (e.startTime = void 0),
        (e.endTime = void 0),
        (e.strength = 100),
        (e.screenWidth = 0),
        (e.shortcut = !1),
        (e.danger = null),
        (e.skipShowLevel = !1);
    }),
    (e.Gamepad = {
      A: 0,
      B: 1,
      X: 2,
      Y: 3,
      L: 4,
      R: 5,
      ZL: 6,
      ZR: 7,
      Minus: 8,
      Plus: 9,
      DPadU: 12,
      DPadD: 13,
      DPadL: 14,
      DPadR: 15,
      Axis: { LX: 0, LY: 1, RX: 2, RY: 3 }
    }),
    (e.Restart = function () {
      e.Utils.clearQuery(), e.Init(), e.Utils.applyQuery();
    });
}
async function R() {
  try {
    await t(() => import("./Boot-BCUjRPMm.js"), []),
      await t(() => import("./Utils-C0XzvyUG.js"), []),
      await t(() => import("./Preloader-BaQVioJr.js"), []),
      await t(() => import("./Game-CDiaJLbk.js"), []),
      await t(() => import("./Title-OgaXEQE2.js"), []),
      await t(() => import("./EndTitle-mLPtbNlP.js"), []),
      await t(() => import("./Credits-B14jhxlz.js"), []),
      await t(() => import("./Cutscene-BhNqse6n.js"), []),
      await t(() => import("./Scene-BjPG4OtV.js"), []),
      await t(() => import("./Level-CI18avJU.js"), []),
      await t(() => import("./LevelBuilder-CrBH0s0L.js"), []),
      await t(() => import("./Interface-DWZyyABi.js"), []),
      await t(() => import("./Actor-422t820s.js"), []),
      await t(() => import("./Fighter-Ekf_cGdj.js"), []),
      await t(() => import("./Enemy-BIgsd55Y.js"), []),
      await t(() => import("./Kid-Cb4i4aSt.js"), []),
      await t(() => import("./Mouse-BkhrDe8O.js"), []),
      await t(() => import("./Base-BcwaXgNc.js"), []),
      await t(() => import("./Button-DA9n1K9p.js"), []),
      await t(() => import("./Chopper-eLwn-Knk.js"), []),
      await t(() => import("./Clock-CGaSAZXY.js"), []),
      await t(() => import("./ExitDoor-Dr5ljfA2.js"), []),
      await t(() => import("./Gate-Blun-bPA.js"), []),
      await t(() => import("./Loose-Bv0MRA5K.js"), []),
      await t(() => import("./Mirror-DXvG7nA9.js"), []),
      await t(() => import("./Potion-CA51DhvD.js"), []),
      await t(() => import("./Skeleton-DAfuTRJ1.js"), []),
      await t(() => import("./Spikes-DOHXGyst.js"), []),
      await t(() => import("./Star-3KFevkOK.js"), []),
      await t(() => import("./Sword-kRrjSKse.js"), []),
      await t(() => import("./Torch-BrJfe5JK.js"), []),
      console.log("All game modules loaded successfully");
  } catch (e) {
    throw (console.error("Error loading game modules:", e), e);
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await f("/phaser.min.js"),
      console.log("Phaser loaded successfully"),
      O(),
      console.log("PrinceJS object initialized"),
      await R();
    let e = new Phaser.Game(640, 400, Phaser.AUTO, "gameContainer", null, !1, !1);
    e.state.add("Boot", PrinceJS.Boot),
      e.state.add("Preloader", PrinceJS.Preloader),
      e.state.add("Game", PrinceJS.Game),
      e.state.add("Title", PrinceJS.Title),
      e.state.add("EndTitle", PrinceJS.EndTitle),
      e.state.add("Credits", PrinceJS.Credits),
      e.state.add("Cutscene", PrinceJS.Cutscene),
      e.state.start("Boot"),
      console.log("Game initialized successfully");
  } catch (e) {
    console.error("Failed to load Phaser or game modules:", e);
  }
});
