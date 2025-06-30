PrinceJS.Tile.Skeleton = function (e, t, i) {
  PrinceJS.Tile.Base.call(this, e, PrinceJS.Level.TILE_SKELETON, t, i);
};
PrinceJS.Tile.Skeleton.prototype = Object.create(PrinceJS.Tile.Base.prototype);
PrinceJS.Tile.Skeleton.prototype.constructor = PrinceJS.Tile.Skeleton;
PrinceJS.Tile.Skeleton.prototype.update = function () {};
PrinceJS.Tile.Skeleton.prototype.removeObject = function () {
  (this.element = PrinceJS.Level.TILE_FLOOR),
    (this.modifier = 0),
    (this.front.frameName = this.key + "_" + this.element + "_fg"),
    (this.back.frameName = this.key + "_" + this.element);
  let e = this.game.make.sprite(0, 0, this.key, this.key + "_" + this.element + "_" + this.modifier);
  this.back.addChild(e);
};
