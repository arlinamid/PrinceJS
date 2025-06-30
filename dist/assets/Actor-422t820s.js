PrinceJS.Actor = function (t, i, c, h, e, r) {
  Phaser.Sprite.call(this, t, 0, 0, e),
    typeof r > "u" && (r = e),
    (this.charX = i),
    (this.charY = c),
    (this.charFace = h),
    (this.charName = e),
    this.charFrame,
    (this.charFdx = 0),
    (this.charFdy = 0),
    (this.charFcheck = !1),
    (this.charFfoot = 0),
    (this.charFood = !1),
    (this.charFthin = !1),
    (this.scale.x *= -h),
    this.anchor.setTo(0, 1),
    (this._action = "stand"),
    (this._seqpointer = 0),
    this.game.add.existing(this),
    (this.z = 20),
    (this.baseX = 0),
    (this.baseY = 0),
    (this.anims = this.game.cache.getJSON(r + "-anims")),
    (this.commands = []),
    (this.delegate = null);
  for (let s = 0; s < 256; s++) this.registerCommand(s, this.CMD_NOOP);
  this.registerCommand(255, this.CMD_GOTO),
    this.registerCommand(254, this.CMD_ABOUTFACE),
    this.registerCommand(251, this.CMD_CHX),
    this.registerCommand(250, this.CMD_CHY),
    this.registerCommand(242, this.CMD_TAP),
    this.registerCommand(0, this.CMD_FRAME);
};
PrinceJS.Actor.prototype = Object.create(Phaser.Sprite.prototype);
PrinceJS.Actor.prototype.constructor = PrinceJS.Actor;
PrinceJS.Actor.prototype.registerCommand = function (t, i) {
  this.commands[t] = i.bind(this);
};
PrinceJS.Actor.prototype.updateCharFrame = function () {
  let t = this.anims.framedef[this.charFrame];
  (this.charFdx = t.fdx), (this.charFdy = t.fdy);
  let i = parseInt(t.fcheck, 16);
  (this.charFfoot = i & 31),
    (this.charFood = (i & 128) === 128),
    (this.charFcheck = (i & 64) === 64),
    (this.charFthin = (i & 32) === 32);
};
PrinceJS.Actor.prototype.updateActor = function () {
  this.processCommand(), this.updateCharPosition();
};
PrinceJS.Actor.prototype.CMD_NOOP = function (t) {};
PrinceJS.Actor.prototype.CMD_GOTO = function (t) {
  (this._action = t.p1), (this._seqpointer = t.p2 - 1);
};
PrinceJS.Actor.prototype.CMD_ABOUTFACE = function (t) {
  this.changeFace();
};
PrinceJS.Actor.prototype.CMD_CHX = function (t) {
  this.charX += t.p1 * this.charFace;
};
PrinceJS.Actor.prototype.CMD_CHY = function (t) {
  this.charY += t.p1;
};
PrinceJS.Actor.prototype.CMD_TAP = function (t) {};
PrinceJS.Actor.prototype.CMD_FRAME = function (t) {
  (this.charFrame = t.p1), this.updateCharFrame(), (this.processing = !1);
};
PrinceJS.Actor.prototype.processCommand = function () {
  for (this.processing = !0; this.processing; ) {
    let t = this.anims.sequence[this._action][this._seqpointer];
    this.commands[t.cmd](t), this._seqpointer++;
  }
};
PrinceJS.Actor.prototype.changeFace = function () {
  (this.charFace *= -1), (this.scale.x *= -1), this.delegate && this.delegate.syncFace(this);
};
PrinceJS.Actor.prototype.updateCharPosition = function () {
  if (this.charFrame === void 0) return;
  this.frameName = this.charName + "-" + this.charFrame;
  let t = this.charX + this.charFdx * this.charFace;
  ((this.charFood && this.faceL()) || (!this.charFood && this.faceR())) && (t += 0.5),
    (this.x = this.baseX + PrinceJS.Utils.convertX(t)),
    (this.y = this.baseY + this.charY + this.charFdy),
    this.delegate && this.delegate.syncFrame(this);
};
PrinceJS.Actor.prototype.faceL = function () {
  return this.charFace === -1;
};
PrinceJS.Actor.prototype.faceR = function () {
  return this.charFace === 1;
};
PrinceJS.Actor.prototype.frameID = function (t, i) {
  return typeof i > "u" ? this.charFrame === t : this.charFrame >= t && this.charFrame <= i;
};
Object.defineProperty(PrinceJS.Actor.prototype, "action", {
  get: function () {
    return this._action;
  },
  set: function (t) {
    (this._action = t), (this._seqpointer = 0);
  }
});
