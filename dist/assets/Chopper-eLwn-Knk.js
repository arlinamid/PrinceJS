PrinceJS.Tile.Chopper = function (e, i, t) {
  PrinceJS.Tile.Base.call(this, e, PrinceJS.Level.TILE_CHOPPER, i, t),
    (this.tileChildBack = this.game.make.sprite(0, 0, this.key, this.key + "_chopper_5")),
    this.back.addChild(this.tileChildBack),
    (this.tileChildFront = this.game.make.sprite(0, 0, this.key, this.key + "_chopper_5_fg")),
    this.front.addChild(this.tileChildFront),
    (this.blood = this.game.make.sprite(12, 41, "general", "chopper-blood_4")),
    (this.blood.visible = !1),
    this.tileChildFront.addChild(this.blood),
    (this.step = 0),
    (this.onChopped = new Phaser.Signal()),
    (this.active = !1),
    (this.sound = !1);
};
PrinceJS.Tile.Chopper.prototype = Object.create(PrinceJS.Tile.Base.prototype);
PrinceJS.Tile.Chopper.prototype.constructor = PrinceJS.Tile.Chopper;
PrinceJS.Tile.Chopper.prototype.update = function () {
  this.active &&
    (this.step++,
    this.step > 14
      ? ((this.step = 0), (this.active = !1))
      : this.step < 6 &&
        ((this.tileChildBack.frameName = this.key + "_chopper_" + this.step),
        (this.tileChildFront.frameName = this.key + "_chopper_" + this.step + "_fg"),
        (this.blood.frameName = "chopper-blood_" + this.step),
        this.step === 3 &&
          (this.onChopped.dispatch(this.roomX, this.roomY, this.room),
          this.sound && this.game.sound.play("SlicerBladesClash"))));
};
PrinceJS.Tile.Chopper.prototype.chop = function (e) {
  (this.active = !0), (this.sound = e);
};
PrinceJS.Tile.Chopper.prototype.showBlood = function () {
  this.blood.visible = !0;
};
