PrinceJS.Tile.Gate = function (e, t, h) {
  PrinceJS.Tile.Base.call(this, e, PrinceJS.Level.TILE_GATE, t, h),
    (this.onFastDrop = new Phaser.Signal()),
    (this.posY = -t * 46),
    (this.tileChildBack = this.game.make.sprite(0, 0, this.key, this.key + "_gate")),
    this.tileChildBack.crop(
      new Phaser.Rectangle(0, -this.posY, this.tileChildBack.width, this.tileChildBack.height + this.posY)
    ),
    this.back.addChild(this.tileChildBack),
    (this.tileChildFront = this.game.make.sprite(32, 16, this.key, this.key + "_gate_fg")),
    this.tileChildFront.crop(
      new Phaser.Rectangle(0, -this.posY, this.tileChildFront.width, this.tileChildFront.height + this.posY)
    ),
    this.front.addChild(this.tileChildFront),
    (this.state = t),
    (this.step = 0),
    (this.closedFast = !1),
    this.setCanMute(!0);
};
PrinceJS.Tile.Gate.STATE_CLOSED = 0;
PrinceJS.Tile.Gate.STATE_OPEN = 1;
PrinceJS.Tile.Gate.STATE_RAISING = 2;
PrinceJS.Tile.Gate.STATE_DROPPING = 3;
PrinceJS.Tile.Gate.STATE_FAST_DROPPING = 4;
PrinceJS.Tile.Gate.STATE_WAITING = 5;
PrinceJS.Tile.Gate.prototype = Object.create(PrinceJS.Tile.Base.prototype);
PrinceJS.Tile.Gate.prototype.constructor = PrinceJS.Tile.Gate;
let i = new Set(),
  s = new Set();
PrinceJS.Tile.Gate.reset = function () {
  i.clear(), s.clear();
};
PrinceJS.Tile.Gate.prototype.update = function () {
  let e = this.tileChildBack,
    t = this.tileChildFront,
    h;
  switch (this.state) {
    case PrinceJS.Tile.Gate.STATE_CLOSED:
    case PrinceJS.Tile.Gate.STATE_OPEN:
      i.delete(this), s.delete(this);
      break;
    case PrinceJS.Tile.Gate.STATE_RAISING:
      this.posY === -47
        ? ((this.state = PrinceJS.Tile.Gate.STATE_WAITING),
          (this.step = 0),
          this.soundActive && this.game.sound.play("GateStopsAtTop"))
        : ((this.posY -= 1),
          e.crop(new Phaser.Rectangle(0, -this.posY, e.width, e.height)),
          t.crop(new Phaser.Rectangle(0, -this.posY, t.width, t.height)),
          this.posY % 2 === 0 &&
            this.soundActive &&
            (i.size === 0 || i.values().next().value === this) &&
            (this.game.sound.play("GateRising"), i.add(this)));
      break;
    case PrinceJS.Tile.Gate.STATE_WAITING:
      i.delete(this),
        s.delete(this),
        this.step++,
        this.step === 50 && ((this.state = PrinceJS.Tile.Gate.STATE_DROPPING), (this.step = 0));
      break;
    case PrinceJS.Tile.Gate.STATE_DROPPING:
      this.step
        ? (this.step = (this.step + 1) % 4)
        : ((this.posY += 1),
          e.crop(new Phaser.Rectangle(0, -this.posY, e.width, e.height + 1)),
          t.crop(new Phaser.Rectangle(0, -this.posY, t.width, t.height + 1)),
          this.posY >= 0
            ? ((this.posY = 0),
              e.crop(null),
              t.crop(null),
              (this.state = PrinceJS.Tile.Gate.STATE_CLOSED),
              this.soundActive && this.game.sound.play("GateStopsAtTop"))
            : this.soundActive &&
              (s.size === 0 || s.values().next().value === this) &&
              (this.game.sound.play("GateComingDownSlow"), s.add(this)),
          this.step++);
      break;
    case PrinceJS.Tile.Gate.STATE_FAST_DROPPING:
      (h = this.posY < -1),
        (this.posY += 10),
        e.crop(new Phaser.Rectangle(0, -this.posY, e.width, e.height + 10)),
        t.crop(new Phaser.Rectangle(0, -this.posY, t.width, t.height + 10)),
        this.posY >= 0 &&
          ((this.posY = 0),
          e.crop(null),
          e.crop(null),
          t.crop(null),
          (this.state = PrinceJS.Tile.Gate.STATE_CLOSED),
          h && (this.game.sound.play("GateReachesBottomClang"), this.onFastDrop.dispatch(this)));
      break;
  }
};
PrinceJS.Tile.Gate.prototype.raise = function (e) {
  (this.closedFast && e) ||
    ((this.step = 0),
    this.state !== PrinceJS.Tile.Gate.STATE_WAITING &&
      this.state !== PrinceJS.Tile.Gate.STATE_FAST_DROPPING &&
      this.state !== PrinceJS.Tile.Gate.STATE_RAISING &&
      ((this.state = PrinceJS.Tile.Gate.STATE_RAISING), (this.closedFast = !1)));
};
PrinceJS.Tile.Gate.prototype.drop = function () {
  this.state !== PrinceJS.Tile.Gate.STATE_FAST_DROPPING &&
    ((this.state = PrinceJS.Tile.Gate.STATE_FAST_DROPPING), (this.closedFast = !0));
};
PrinceJS.Tile.Gate.prototype.getBounds = function () {
  let e = new Phaser.Rectangle(0, 0, 0, 0);
  return (e.height = 53 + this.posY - 4), (e.width = 4), (e.x = this.roomX * 32 + 40), (e.y = this.roomY * 63), e;
};
PrinceJS.Tile.Gate.prototype.getBoundsAbs = function () {
  return new Phaser.Rectangle(this.x, this.y, this.width, 63 + this.posY);
};
PrinceJS.Tile.Gate.prototype.canCross = function (e) {
  return Math.abs(this.posY) > e;
};
PrinceJS.Tile.Gate.prototype.isVisible = function (e) {
  this.canMute &&
    this.soundActive !== e &&
    ((this.soundActive = e), this.soundActive || (i.delete(this), s.delete(this)));
};
PrinceJS.Tile.Gate.prototype.setCanMute = function (e) {
  (this.canMute = e), (this.soundActive = !this.canMute);
};
