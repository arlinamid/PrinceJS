PrinceJS.Tile.ExitDoor = function (i, t, e, o = !1) {
  PrinceJS.Tile.Base.call(this, i, PrinceJS.Level.TILE_EXIT_RIGHT, t, e),
    (this.tileChildBack = this.game.make.sprite(10, 12, this.key, this.key + "_door")),
    this.back.addChild(this.tileChildBack),
    this.type === PrinceJS.Level.TYPE_PALACE && (this.tileChildBack.x -= 3),
    (this.tileChildFront = this.game.make.sprite(0, 0, this.key, this.key + "_door_fg")),
    this.front.addChild(this.tileChildFront),
    (this.tileChildFront.visible = !1),
    (this.step = 0),
    (this.open = o),
    (this.heightOpen = 8 + this.type),
    (this.heightClose = this.tileChildBack.height),
    (this.heightCrop = this.heightClose - this.heightOpen),
    this.initCrop();
};
PrinceJS.Tile.ExitDoor.STATE_OPEN = 0;
PrinceJS.Tile.ExitDoor.STATE_RAISING = 1;
PrinceJS.Tile.ExitDoor.STATE_DROPPING = 2;
PrinceJS.Tile.ExitDoor.STATE_CLOSED = 3;
PrinceJS.Tile.ExitDoor.prototype = Object.create(PrinceJS.Tile.Base.prototype);
PrinceJS.Tile.ExitDoor.prototype.constructor = PrinceJS.Tile.ExitDoor;
PrinceJS.Tile.ExitDoor.prototype.toggleMask = function () {};
PrinceJS.Tile.ExitDoor.prototype.update = function () {
  let i = this.tileChildBack;
  switch (this.state) {
    case PrinceJS.Tile.ExitDoor.STATE_RAISING:
      i.height === this.heightOpen
        ? (this.open = !0)
        : (this.step++, i.crop(new Phaser.Rectangle(0, this.step, i.width, i.height)));
      break;
    case PrinceJS.Tile.ExitDoor.STATE_DROPPING:
      i.height === this.heightClose
        ? (this.open = !1)
        : ((this.step += 15),
          i.crop(new Phaser.Rectangle(0, this.heightCrop - this.step, i.width, i.height + this.step)));
      break;
  }
};
PrinceJS.Tile.ExitDoor.prototype.initCrop = function () {
  if (this.open) {
    let i = this.tileChildBack;
    i.crop(new Phaser.Rectangle(0, this.heightCrop, i.width, i.height));
  }
};
PrinceJS.Tile.ExitDoor.prototype.raise = function () {
  this.state === PrinceJS.Tile.ExitDoor.STATE_CLOSED &&
    ((this.state = PrinceJS.Tile.ExitDoor.STATE_RAISING), this.game.sound.play("ExitDoorOpening"));
};
PrinceJS.Tile.ExitDoor.prototype.drop = function () {
  this.state !== PrinceJS.Tile.ExitDoor.STATE_CLOSED &&
    ((this.state = PrinceJS.Tile.ExitDoor.STATE_DROPPING), this.game.sound.play("EntranceDoorCloses"));
};
PrinceJS.Tile.ExitDoor.prototype.mask = function () {
  this.tileChildFront.visible = !0;
};
Object.defineProperty(PrinceJS.Tile.ExitDoor.prototype, "open", {
  get: function () {
    return this.state === PrinceJS.Tile.ExitDoor.STATE_OPEN;
  },
  set: function (i) {
    (this.state = i ? PrinceJS.Tile.ExitDoor.STATE_OPEN : PrinceJS.Tile.ExitDoor.STATE_CLOSED), (this.step = 0);
  }
});
