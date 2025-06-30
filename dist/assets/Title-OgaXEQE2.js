PrinceJS.Title = function (t) {
  this.tick = 0;
};
PrinceJS.Title.prototype = {
  preload: function () {},
  create: function () {
    this.stopMusic(),
      (this.tick = 0),
      this.game.world.setBounds(0, 0, PrinceJS.SCREEN_WIDTH, PrinceJS.SCREEN_HEIGHT),
      (this.back = this.game.add.image(0, 0, "title", "main_background")),
      (this.back.alpha = 0),
      (this.tween1 = this.game.add.tween(this.back).to({ alpha: 1 }, 2e3, Phaser.Easing.Linear.None, !1, 0, 0, !1)),
      this.tween1.onComplete.add(() => {
        this.game.sound.play("PrologueA");
      }),
      (this.presents = this.game.add.image(this.world.centerX, this.world.centerY + 29.5, "title", "presents")),
      this.presents.anchor.setTo(0.5, 0.5),
      (this.presents.visible = !1),
      (this.author = this.game.add.image(this.world.centerX - 3, this.world.centerY + 37, "title", "author")),
      this.author.anchor.setTo(0.5, 0.5),
      (this.author.visible = !1),
      (this.prince = this.game.add.image(0, 0, "title", "prince")),
      (this.prince.visible = !1),
      (this.textBack = this.game.add.image(0, this.world.height, "title", "in_the_absence")),
      this.textBack.anchor.setTo(0, 1),
      (this.cropRect = new Phaser.Rectangle(0, 0, 0, this.textBack.height)),
      (this.tween2 = this.game.add
        .tween(this.cropRect)
        .to({ width: this.textBack.width }, 200, Phaser.Easing.Linear.None, !1, 0, 0, !1)),
      this.textBack.crop(this.cropRect),
      (this.tween3 = this.game.add.tween(this.textBack).to({ alpha: 0 }, 2e3, Phaser.Easing.Linear.None, !1, 0, 0, !1)),
      this.tween3.onComplete.add(() => {
        PrinceJS.Utils.delayed(() => {
          this.cutscene();
        }, 3500);
      }),
      (this.input.keyboard.onDownCallback = this.play.bind(this));
  },
  update: function () {
    switch (this.tick) {
      case 0:
        this.tween1.start();
        break;
      case 250:
        this.presents.visible = !0;
        break;
      case 450:
        this.presents.visible = !1;
        break;
      case 530:
        this.author.visible = !0;
        break;
      case 730:
        this.author.visible = !1;
        break;
      case 1030:
        this.prince.visible = !0;
        break;
      case 1600:
        this.tween2.start(), this.game.sound.play("PrologueB");
        break;
      case 2250:
        (this.back.visible = !1), (this.prince.visible = !1), this.tween3.start();
        break;
    }
    this.tick++, this.textBack.updateCrop(), PrinceJS.Utils.continueGame(this.game) && this.play();
  },
  play: function () {
    this.stopMusic(), (this.input.keyboard.onDownCallback = null), this.state.start("Game");
  },
  cutscene: function () {
    this.stopMusic(), (this.input.keyboard.onDownCallback = null), this.state.start("Cutscene");
  },
  stopMusic: function () {
    this.game.sound.stopAll();
  }
};
