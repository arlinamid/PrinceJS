PrinceJS.EndTitle = function (t) {
  this.tick = 0;
};
PrinceJS.EndTitle.prototype = {
  preload: function () {
    this.game.load.audio("Epilogue", "assets/music/22_Epilogue.mp3");
  },
  create: function () {
    this.stopMusic(),
      (this.tick = 0),
      (this.game.world.alpha = 1),
      this.game.world.setBounds(0, 0, PrinceJS.SCREEN_WIDTH, PrinceJS.SCREEN_HEIGHT),
      this.game.sound.play("Epilogue"),
      (this.back = this.game.add.image(0, 0, "title", "the_tyrant")),
      (this.back.alpha = 0),
      (this.tween1 = this.game.add.tween(this.back).to({ alpha: 1 }, 2e3, Phaser.Easing.Linear.None, !1, 0, 0, !1)),
      (this.textBack = this.game.add.image(0, this.world.height, "title", "main_background")),
      this.textBack.anchor.setTo(0, 1),
      (this.cropRect = new Phaser.Rectangle(0, 0, 0, this.textBack.height)),
      (this.tween2 = this.game.add
        .tween(this.cropRect)
        .to({ width: this.textBack.width }, 200, Phaser.Easing.Linear.None, !1, 0, 0, !1)),
      this.textBack.crop(this.cropRect),
      (this.tween3 = this.game.add.tween(this.textBack).to({ alpha: 0 }, 2e3, Phaser.Easing.Linear.None, !1, 0, 0, !1)),
      this.tween3.onComplete.add(this.next, this),
      (this.input.keyboard.onDownCallback = null),
      PrinceJS.Utils.delayed(() => {
        this.input.keyboard.onDownCallback = this.next.bind(this);
      }, 1e3);
  },
  update: function () {
    switch (this.tick) {
      case 100:
        this.tween1.start();
        break;
      case 1250:
        this.tween2.start();
        break;
      case 7250:
        (this.back.visible = !1), this.tween3.start();
        break;
    }
    this.tick++, this.textBack.updateCrop(), PrinceJS.Utils.continueGame(this.game) && this.next();
  },
  next: function () {
    (this.input.keyboard.onDownCallback = null), this.state.start("Title");
  },
  stopMusic: function () {
    this.game.sound.stopAll();
  }
};
