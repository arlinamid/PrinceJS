PrinceJS.Mouse = function (t, e, c, o, i) {
  (this.level = e), (this.room = c), (this.charBlockX = o % 10), (this.charBlockY = Math.floor(o / 10));
  let r = PrinceJS.Utils.convertBlockXtoX(this.charBlockX),
    s = PrinceJS.Utils.convertBlockYtoY(this.charBlockY);
  PrinceJS.Actor.call(this, t, r, s, i, "mouse"), (this.action = "stop"), this.updateBase();
};
PrinceJS.Mouse.prototype = Object.create(PrinceJS.Actor.prototype);
PrinceJS.Mouse.prototype.constructor = PrinceJS.Mouse;
PrinceJS.Mouse.prototype.updateActor = function () {
  this.processCommand(), this.checkButton(), this.updateCharPosition();
};
PrinceJS.Mouse.prototype.CMD_FRAME = function (t) {
  (this.charFrame = t.p1), this.updateCharFrame(), this.updateBlockXY(), (this.processing = !1);
};
PrinceJS.Mouse.prototype.updateBlockXY = function () {
  let t = this.charX + this.charFdx * this.charFace - this.charFfoot * this.charFace,
    e = this.charY + this.charFdy;
  (this.charBlockX = PrinceJS.Utils.convertXtoBlockX(t)),
    (this.charBlockY = Math.min(PrinceJS.Utils.convertYtoBlockY(e), 2));
};
PrinceJS.Mouse.prototype.updateBase = function () {
  (this.baseX = this.level.rooms[this.room].x * PrinceJS.ROOM_WIDTH),
    (this.baseY = this.level.rooms[this.room].y * PrinceJS.ROOM_HEIGHT + 3);
};
PrinceJS.Mouse.prototype.checkButton = function () {
  if (!this.visible) return;
  let t = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
  if (t)
    switch (t.element) {
      case PrinceJS.Level.TILE_RAISE_BUTTON:
      case PrinceJS.Level.TILE_DROP_BUTTON:
        t.push();
        break;
    }
};
PrinceJS.Mouse.prototype.turn = function () {
  this.changeFace(), (this.charX += this.charFace * 5);
};
