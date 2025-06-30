"use strict";

// Use the global PrinceJS object created in main.js
// All constants and functions are now defined there

PrinceJS.Boot = function () {
  PrinceJS.Init();
};

PrinceJS.Boot.prototype = {
  preload: function () {
    this.load.bitmapFont("font", "assets/font/prince_0.png", "assets/font/prince.fnt");
  },

  create: function () {
    this.world.scale.set(PrinceJS.SCALE_FACTOR);

    // Configure scale manager for better fullscreen support
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.state.start("Preloader");

    PrinceJS.Utils.applyQuery();
    PrinceJS.Utils.applyScreenWidth();
  }
};
