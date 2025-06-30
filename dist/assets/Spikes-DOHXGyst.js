PrinceJS.Tile.Spikes = function (i, e, t) {
  PrinceJS.Tile.Base.call(this, i, PrinceJS.Level.TILE_SPIKES, e, t),
    (this.state = PrinceJS.Tile.Spikes.STATE_INACTIVE),
    (this.step = 0),
    (this.mortal = e < 5),
    e > 2 && e < 6 && (e = 5),
    e === 6 && (e = 4),
    e > 6 && (e = 9 - e),
    (this.tileChildBack = this.game.make.sprite(0, 0, this.key, this.key + "_" + this.element + "_" + e)),
    this.back.addChild(this.tileChildBack),
    (this.tileChildFront = this.game.make.sprite(0, 0, this.key, this.key + "_" + this.element + "_" + e + "_fg")),
    this.front.addChild(this.tileChildFront);
};
PrinceJS.Tile.Spikes.STATE_INACTIVE = 0;
PrinceJS.Tile.Spikes.STATE_RAISING = 1;
PrinceJS.Tile.Spikes.STATE_FULL_OUT = 2;
PrinceJS.Tile.Spikes.STATE_DROPPING = 3;
PrinceJS.Tile.Spikes.prototype = Object.create(PrinceJS.Tile.Base.prototype);
PrinceJS.Tile.Spikes.prototype.constructor = PrinceJS.Tile.Spikes;
PrinceJS.Tile.Spikes.prototype.maskWidth = function (i) {
  return i.action === "climbdown" ? 21 : 22;
};
PrinceJS.Tile.Spikes.prototype.update = function () {
  switch (this.state) {
    case PrinceJS.Tile.Spikes.STATE_RAISING:
      this.step++,
        (this.tileChildBack.frameName = this.key + "_" + PrinceJS.Level.TILE_SPIKES + "_" + this.step),
        (this.tileChildFront.frameName = this.key + "_" + PrinceJS.Level.TILE_SPIKES + "_" + this.step + "_fg"),
        this.step === 5 && ((this.state = PrinceJS.Tile.Spikes.STATE_FULL_OUT), (this.step = 0));
      break;
    case PrinceJS.Tile.Spikes.STATE_FULL_OUT:
      this.step++, this.step > 15 && this.drop();
      break;
    case PrinceJS.Tile.Spikes.STATE_DROPPING:
      this.step--,
        this.step === 3 && this.step--,
        (this.tileChildBack.frameName = this.key + "_" + PrinceJS.Level.TILE_SPIKES + "_" + this.step),
        (this.tileChildFront.frameName = this.key + "_" + PrinceJS.Level.TILE_SPIKES + "_" + this.step + "_fg"),
        this.step === 0 && (this.state = PrinceJS.Tile.Spikes.STATE_INACTIVE);
      break;
  }
};
PrinceJS.Tile.Spikes.prototype.raise = function () {
  this.state === PrinceJS.Tile.Spikes.STATE_INACTIVE
    ? ((this.state = PrinceJS.Tile.Spikes.STATE_RAISING), this.game.sound.play("ImpaledBySpikes"))
    : this.state === PrinceJS.Tile.Spikes.STATE_FULL_OUT && (this.step = 0);
};
PrinceJS.Tile.Spikes.prototype.drop = function () {
  (this.state = PrinceJS.Tile.Spikes.STATE_DROPPING), (this.step = 5);
};
