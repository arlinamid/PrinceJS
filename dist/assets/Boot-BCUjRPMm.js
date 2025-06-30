PrinceJS.Boot = function () {
  PrinceJS.Init();
};
PrinceJS.Boot.prototype = {
  preload: function () {
    this.load.bitmapFont("font", "assets/font/prince_0.png", "assets/font/prince.fnt");
  },
  create: function () {
    this.world.scale.set(PrinceJS.SCALE_FACTOR),
      (this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL),
      (this.scale.pageAlignHorizontally = !0),
      (this.scale.pageAlignVertically = !0),
      this.state.start("Preloader"),
      PrinceJS.Utils.applyQuery(),
      PrinceJS.Utils.applyScreenWidth();
  }
};
