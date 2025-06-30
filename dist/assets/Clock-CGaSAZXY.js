PrinceJS.Tile.Clock = function (e, i, t, c) {
  (this.game = e),
    (this.back = this.game.make.sprite(i, t, "cutscene")),
    (this.tileChild = this.game.make.sprite(8, 16, "cutscene")),
    (this.tileChild.visible = !1),
    this.back.addChild(this.tileChild),
    (this.sandStep = 0),
    (this.clockStep = c),
    (this.step = 0),
    (this.back.frameName = PrinceJS.Tile.Clock.clockFrames[this.clockStep]),
    (this.tileChild.frameName = PrinceJS.Tile.Clock.sandFrames[this.sandStep]),
    (this.active = !1);
};
PrinceJS.Tile.Clock.sandFrames = Phaser.Animation.generateFrameNames("clocksand0", 1, 3, "", 1);
PrinceJS.Tile.Clock.clockFrames = Phaser.Animation.generateFrameNames("clock0", 1, 7, "", 1);
PrinceJS.Tile.Clock.prototype.update = function () {
  this.active &&
    ((this.sandStep = (this.sandStep + 1) % PrinceJS.Tile.Clock.sandFrames.length),
    (this.tileChild.frameName = PrinceJS.Tile.Clock.sandFrames[this.sandStep]),
    this.step++,
    this.step === 40 &&
      ((this.clockStep = (this.clockStep + 1) % PrinceJS.Tile.Clock.clockFrames.length),
      (this.back.frameName = PrinceJS.Tile.Clock.clockFrames[this.clockStep]),
      (this.step = 0)));
};
PrinceJS.Tile.Clock.prototype.activate = function () {
  (this.active = !0), (this.tileChild.visible = !0);
};
PrinceJS.Tile.Clock.prototype.constructor = PrinceJS.Tile.Clock;
