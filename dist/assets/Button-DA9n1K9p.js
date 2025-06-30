PrinceJS.Tile.Button = function (e, t, i, s) {
  PrinceJS.Tile.Base.call(this, e, t, i, s),
    (this.stepMax = t === PrinceJS.Level.TILE_RAISE_BUTTON ? 3 : 5),
    (this.step = 0),
    (this.onPushed = new Phaser.Signal()),
    (this.active = !1),
    (this.mute = !1),
    (this.frontBevel = this.game.make.sprite(0, 0, this.key, this.key + "_" + t + "_fg")),
    this.front.addChild(this.frontBevel),
    t === PrinceJS.Level.TILE_STUCK_BUTTON && ((this.debris = !0), (this.mute = !0));
};
PrinceJS.Tile.Button.prototype = Object.create(PrinceJS.Tile.Base.prototype);
PrinceJS.Tile.Button.prototype.constructor = PrinceJS.Tile.Button;
PrinceJS.Tile.Button.prototype.update = function () {
  if (
    (this.active && this.element === PrinceJS.Level.TILE_RAISE_BUTTON && this.step === 0 && this.trigger(!0),
    this.debris)
  ) {
    (this.step = 0),
      this.active || ((this.active = !0), this.trigger(!1), this.mute || this.game.sound.play("FloorButton")),
      this.frontOriginalY !== void 0 && this.reset();
    return;
  }
  this.active && (this.step === this.stepMax && (this.reset(), (this.active = !1)), this.step++);
};
PrinceJS.Tile.Button.prototype.reset = function () {
  (this.front.y = this.frontOriginalY),
    delete this.frontOriginalY,
    (this.back.frameName = this.key + "_" + this.element),
    (this.offsetY = 0),
    this.front.crop(new Phaser.Rectangle(0, this.front.cropRect.y || 0, 33, this.tileHeight)),
    this.frontBevel.crop(null);
};
PrinceJS.Tile.Button.prototype.push = function () {
  this.active ||
    ((this.active = !0),
    (this.offsetY = 1),
    (this.frontOriginalY = this.front.y),
    (this.front.y += this.offsetY),
    this.front.crop(new Phaser.Rectangle(0, 0, 33, this.tileHeight - 1)),
    this.frontBevel.crop(new Phaser.Rectangle(0, 0, 33, this.frontBevel.height - 1)),
    (this.back.frameName += "_down"),
    this.trigger(!1),
    this.mute || this.game.sound.play("FloorButton")),
    (this.step = 0);
};
PrinceJS.Tile.Button.prototype.trigger = function (e) {
  this.onPushed.dispatch(this.modifier, this.element, e);
};
