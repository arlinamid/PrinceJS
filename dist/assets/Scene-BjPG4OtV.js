PrinceJS.Scene = function (t) {
  (this.game = t),
    (this.back = this.game.add.group()),
    (this.back.z = 10),
    (this.front = this.game.add.group()),
    (this.front.z = 30),
    (this.trobs = []),
    (this.flash = !1),
    (this.tick = 0),
    this._build();
};
PrinceJS.Scene.prototype = {
  _build: function () {
    this.game.add.image(0, 0, "cutscene", "room", this.back),
      this.game.add.image(0, 142, "cutscene", "room_bed", this.back);
    let t = [
        { x: 53, y: 81 },
        { x: 171, y: 81 }
      ],
      e;
    for (e = 0; e < t.length; e++) {
      let i = new PrinceJS.Tile.Torch(this.game, PrinceJS.Level.TILE_TORCH, 0, PrinceJS.Level.TYPE_PALACE);
      (i.x = t[e].x), (i.y = t[e].y), (i.back.frameName = "palace_0"), this.addObject(i);
    }
    let s = [
      { x: 20, y: 97 },
      { x: 16, y: 104 },
      { x: 23, y: 110 },
      { x: 17, y: 116 },
      { x: 24, y: 120 },
      { x: 18, y: 128 }
    ];
    for (e = 0; e < s.length; e++) {
      let i = new PrinceJS.Tile.Star(this.game, s[e].x, s[e].y);
      this.addObject(i);
    }
    this.game.add.image(59, 120, "cutscene", "room_pillar", this.front),
      this.game.add.image(240, 120, "cutscene", "room_pillar", this.front);
  },
  addTrob: function (t) {
    this.trobs.push(t);
  },
  update: function () {
    let t = this.trobs.length;
    for (; t--; ) this.trobs[t].update();
    if (this.flash) {
      if (this.tick === 7) {
        this.flash = !1;
        return;
      }
      this.tick % 2 ? (this.game.stage.backgroundColor = "#FFFFFF") : (this.game.stage.backgroundColor = "#000000"),
        this.tick++;
    }
  },
  effect: function () {
    this.flash = !0;
  },
  addObject: function (t) {
    this.back.add(t.back), this.addTrob(t);
  }
};
PrinceJS.Scene.prototype.constructor = PrinceJS.Scene;
