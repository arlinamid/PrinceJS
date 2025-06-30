PrinceJS.Tile.Sword = function (e, t, i) {
  PrinceJS.Tile.Base.call(this, e, PrinceJS.Level.TILE_SWORD, t, i),
    (this.tick = this.game.rnd.between(40, 167)),
    (this.step = 0);
};
PrinceJS.Tile.Sword.prototype = Object.create(PrinceJS.Tile.Base.prototype);
PrinceJS.Tile.Sword.prototype.constructor = PrinceJS.Tile.Sword;
PrinceJS.Tile.Sword.prototype.update = function () {
  this.step === -1 &&
    ((this.back.frameName = this.key + "_" + this.element), (this.tick = this.game.rnd.between(40, 167))),
    this.step++,
    this.step === this.tick && ((this.back.frameName += "_bright"), (this.step = -1));
};
PrinceJS.Tile.Sword.prototype.removeObject = function () {
  (this.element = PrinceJS.Level.TILE_FLOOR),
    (this.modifier = 0),
    (this.front.frameName = this.key + "_" + this.element + "_fg"),
    (this.back.frameName = this.key + "_" + this.element);
  let e = this.game.make.sprite(0, 0, this.key, this.key + "_" + this.element + "_" + this.modifier);
  this.back.addChild(e);
};
