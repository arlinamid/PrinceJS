let i = ["LooseFloorShakes1", "LooseFloorShakes2", "LooseFloorShakes3"];
PrinceJS.Tile.Loose = function (e, s, t) {
  PrinceJS.Tile.Base.call(this, e, PrinceJS.Level.TILE_LOOSE_BOARD, s, t),
    (this.onStartFalling = new Phaser.Signal()),
    (this.onStopFalling = new Phaser.Signal()),
    (this.step = 0),
    (this.state = PrinceJS.Tile.Loose.STATE_INACTIVE),
    (this.vacc = 0),
    (this.yTo = 0);
};
PrinceJS.Tile.Loose.STATE_INACTIVE = 0;
PrinceJS.Tile.Loose.STATE_SHAKING = 1;
PrinceJS.Tile.Loose.STATE_FALLING = 2;
PrinceJS.Tile.Loose.FALL_VELOCITY = 3;
PrinceJS.Tile.Loose.frames = Phaser.Animation.generateFrameNames("_loose_", 1, 8, "", 1);
PrinceJS.Tile.Loose.prototype = Object.create(PrinceJS.Tile.Base.prototype);
PrinceJS.Tile.Loose.prototype.constructor = PrinceJS.Tile.Loose;
PrinceJS.Tile.Loose.prototype.toggleMask = function () {
  PrinceJS.Tile.Base.prototype.toggleMask.call(this, ...arguments), (this.front.visible = this.crop);
};
PrinceJS.Tile.Loose.prototype.update = function () {
  let e;
  switch (this.state) {
    case PrinceJS.Tile.Loose.STATE_SHAKING:
      this.step === PrinceJS.Tile.Loose.frames.length
        ? ((this.state = PrinceJS.Tile.Loose.STATE_FALLING),
          (this.step = 0),
          (this.back.frameName = this.key + "_falling"),
          this.onStartFalling.dispatch(this))
        : this.step === 3 && !this.fall
        ? ((this.front.visible = !0),
          (this.back.frameName = this.key + "_" + PrinceJS.Level.TILE_LOOSE_BOARD),
          (this.state = PrinceJS.Tile.Loose.STATE_INACTIVE))
        : ((this.back.frameName = this.key + PrinceJS.Tile.Loose.frames[this.step]), this.step++),
        (this.step === 0 || this.step === 3 || this.step === 7) && this.game.sound.play(i[PrinceJS.Utils.random(3)]);
      break;
    case PrinceJS.Tile.Loose.STATE_FALLING:
      (e = PrinceJS.Tile.Loose.FALL_VELOCITY * this.step),
        (this.y += e),
        this.step++,
        (this.vacc += e),
        this.vacc > this.yTo && ((this.state = PrinceJS.Tile.Loose.STATE_INACTIVE), this.onStopFalling.dispatch(this));
      break;
  }
};
PrinceJS.Tile.Loose.prototype.shake = function (e) {
  this.state === PrinceJS.Tile.Loose.STATE_INACTIVE &&
    ((this.state = PrinceJS.Tile.Loose.STATE_SHAKING), (this.step = 0), (this.front.visible = this.crop)),
    (this.fall = e);
};
PrinceJS.Tile.Loose.prototype.sweep = function () {
  (this.state = PrinceJS.Tile.Loose.STATE_FALLING),
    (this.step = 0),
    (this.back.frameName = this.key + "_falling"),
    this.onStartFalling.dispatch(this),
    this.game.sound.play(i[0]);
};
PrinceJS.Tile.Loose.prototype.fallStarted = function () {
  return this.state === PrinceJS.Tile.Loose.STATE_SHAKING && this.step === PrinceJS.Tile.Loose.frames.length;
};
