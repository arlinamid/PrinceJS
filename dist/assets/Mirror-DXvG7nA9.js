PrinceJS.Tile.Mirror = function (e, i, r) {
  PrinceJS.Tile.Base.call(this, e, PrinceJS.Level.TILE_FLOOR, i, r),
    this.type === PrinceJS.Level.TYPE_PALACE &&
      ((this.mirrorBack = this.game.make.sprite(3, -3, this.key, this.key + "_" + this.element + "_mirror")),
      (this.mirrorBack.visible = !1),
      this.back.addChild(this.mirrorBack),
      (this.mirrorFront = this.game.make.sprite(3, -3, this.key, this.key + "_" + this.element + "_fg_mirror")),
      (this.mirrorFront.visible = !1),
      this.front.addChild(this.mirrorFront),
      (this.reflectionGroup = this.game.add.group()),
      (this.reflectionGroup.scale.x *= -1),
      (this.reflection = this.game.make.sprite(0, 0, "kid", "kid-1")),
      this.reflection.anchor.setTo(0, 1),
      (this.reflection.visible = !1),
      this.reflectionGroup.addChild(this.reflection),
      (this.reflectionGroup.visible = !1),
      this.back.addChild(this.reflectionGroup),
      (this.reflectionCover = this.game.make.sprite(
        -103,
        -5,
        this.key,
        this.key + "_" + this.element + "_mirror_cover"
      )),
      (this.reflectionCover.visible = !1),
      this.back.addChild(this.reflectionCover));
};
PrinceJS.Tile.Mirror.prototype = Object.create(PrinceJS.Tile.Base.prototype);
PrinceJS.Tile.Mirror.prototype.constructor = PrinceJS.Tile.Mirror;
PrinceJS.Tile.Mirror.prototype.update = function () {};
PrinceJS.Tile.Mirror.prototype.addObject = function () {
  this.element === PrinceJS.Level.TILE_FLOOR &&
    ((this.element = PrinceJS.Level.TILE_MIRROR),
    (this.mirrorBack.visible = !0),
    (this.mirrorFront.visible = !0),
    (this.reflectionGroup.visible = !0),
    (this.reflectionCover.visible = !0));
};
PrinceJS.Tile.Mirror.prototype.toggleMask = function () {
  this.element === PrinceJS.Level.TILE_FLOOR && PrinceJS.Tile.Base.prototype.toggleMask.call(this, ...arguments);
};
PrinceJS.Tile.Mirror.prototype.syncFrame = function (e) {
  this.reflection &&
    ((this.reflection.frameName = e.frameName),
    (this.reflection.x = e.x - this.x - 55),
    (this.reflection.x = Math.max(this.reflection.x, e.faceL() ? -25 : -10)),
    (this.reflection.y = e.y - this.y),
    (this.reflection.visible = this.reflection.x > -40 && this.reflection.x < 20));
};
PrinceJS.Tile.Mirror.prototype.syncFace = function (e) {
  this.reflection && ((this.reflection.charFace = e.charFace), (this.reflection.scale.x = e.scale.x));
};
PrinceJS.Tile.Mirror.prototype.hideReflection = function () {
  this.reflection && ((this.reflection.visible = !1), (this.reflection = null));
};
