PrinceJS.Level = function (e, i, s, t) {
  (this.game = e),
    (this.number = i),
    (this.name = s),
    (this.type = t),
    (this.rooms = []),
    (this.back = this.game.add.group()),
    (this.back.z = 10),
    (this.front = this.game.add.group()),
    (this.front.z = 30),
    (this.trobs = []),
    (this.maskedTiles = {}),
    (this.dummyWall = new PrinceJS.Tile.Base(this.game, PrinceJS.Level.TILE_WALL, 0, this.type)),
    (this.exitDoorOpen = !1),
    (this.activeGates = []);
};
PrinceJS.Level.TYPE_DUNGEON = 0;
PrinceJS.Level.TYPE_PALACE = 1;
PrinceJS.Level.TILE_SPACE = 0;
PrinceJS.Level.TILE_FLOOR = 1;
PrinceJS.Level.TILE_SPIKES = 2;
PrinceJS.Level.TILE_PILLAR = 3;
PrinceJS.Level.TILE_GATE = 4;
PrinceJS.Level.TILE_STUCK_BUTTON = 5;
PrinceJS.Level.TILE_DROP_BUTTON = 6;
PrinceJS.Level.TILE_TAPESTRY = 7;
PrinceJS.Level.TILE_BOTTOM_BIG_PILLAR = 8;
PrinceJS.Level.TILE_TOP_BIG_PILLAR = 9;
PrinceJS.Level.TILE_POTION = 10;
PrinceJS.Level.TILE_LOOSE_BOARD = 11;
PrinceJS.Level.TILE_TAPESTRY_TOP = 12;
PrinceJS.Level.TILE_MIRROR = 13;
PrinceJS.Level.TILE_DEBRIS = 14;
PrinceJS.Level.TILE_RAISE_BUTTON = 15;
PrinceJS.Level.TILE_EXIT_LEFT = 16;
PrinceJS.Level.TILE_EXIT_RIGHT = 17;
PrinceJS.Level.TILE_CHOPPER = 18;
PrinceJS.Level.TILE_TORCH = 19;
PrinceJS.Level.TILE_WALL = 20;
PrinceJS.Level.TILE_SKELETON = 21;
PrinceJS.Level.TILE_SWORD = 22;
PrinceJS.Level.TILE_BALCONY_LEFT = 23;
PrinceJS.Level.TILE_BALCONY_RIGHT = 24;
PrinceJS.Level.TILE_LATTICE_PILLAR = 25;
PrinceJS.Level.TILE_LATTICE_SUPPORT = 26;
PrinceJS.Level.TILE_SMALL_LATTICE = 27;
PrinceJS.Level.TILE_LATTICE_LEFT = 28;
PrinceJS.Level.TILE_LATTICE_RIGHT = 29;
PrinceJS.Level.TILE_TORCH_WITH_DEBRIS = 30;
PrinceJS.Level.TILE_DEBRIS_ONLY = 31;
PrinceJS.Level.TILE_NULL = 32;
PrinceJS.Level.POTION_RECOVER = 1;
PrinceJS.Level.POTION_ADD = 2;
PrinceJS.Level.POTION_BUFFER = 3;
PrinceJS.Level.POTION_FLIP = 4;
PrinceJS.Level.POTION_DAMAGE = 5;
PrinceJS.Level.POTION_SPECIAL = 6;
PrinceJS.Level.FLASH_RED = 16711680;
PrinceJS.Level.FLASH_GREEN = 65280;
PrinceJS.Level.FLASH_YELLOW = 16776960;
PrinceJS.Level.FLASH_WHITE = 16777215;
PrinceJS.Level.prototype = {
  addTile: function (e, i, s, t) {
    e >= 0 && i >= 0 && ((this.rooms[s].tiles[i * 10 + e] = t), (t.roomX = e), (t.roomY = i), (t.room = s)),
      (t.x = this.rooms[s].x * PrinceJS.ROOM_WIDTH + e * PrinceJS.BLOCK_WIDTH),
      (t.y = this.rooms[s].y * PrinceJS.ROOM_HEIGHT + i * PrinceJS.BLOCK_HEIGHT - 13),
      this.back.add(t.back),
      this.front.add(t.front);
  },
  addTrob: function (e) {
    this.trobs.push(e);
  },
  update: function () {
    let e = this.trobs.length;
    for (; e--; ) this.trobs[e].update();
  },
  removeObject: function (e, i, s) {
    let t = this.getTileAt(e, i, s);
    if (t && t.removeObject) {
      t.removeObject();
      let n = this.trobs.indexOf(t);
      n > -1 && this.trobs.splice(n, 1);
    }
  },
  getTileAt: function (e, i, s) {
    if (!this.rooms[s]) return this.dummyWall;
    let t = s,
      n = e,
      l = i,
      r = this.getRoomX(s, e);
    return (
      r.room > 0
        ? ((t = r.room), (n = r.x), (r = this.getRoomY(t, i)), (t = r.room), (l = r.y))
        : ((r = this.getRoomY(s, i)),
          (t = r.room),
          (l = r.y),
          r.room > 0 && ((r = this.getRoomX(t, e)), (t = r.room), (n = r.x))),
      t <= 0 ? this.dummyWall : this.rooms[t].tiles[n + l * 10]
    );
  },
  getRoomX: function (e, i) {
    return (
      i < 0 && ((e = this.rooms[e].links.left), (i += 10)),
      i > 9 && ((e = this.rooms[e].links.right), (i -= 10)),
      { room: e, x: i }
    );
  },
  getRoomY: function (e, i) {
    return (
      i < 0 && ((e = this.rooms[e].links.up), (i += 3)),
      i > 2 && ((e = this.rooms[e].links.down), (i -= 3)),
      { room: e, y: i }
    );
  },
  shakeFloor: function (e, i) {
    for (let s = 0; s < 10; s++) {
      let t = this.getTileAt(s, e, i);
      t.element === PrinceJS.Level.TILE_LOOSE_BOARD && t.shake(!1);
    }
  },
  unMaskTile: function (e) {
    this.maskedTiles[e.id] && (this.maskedTiles[e.id].toggleMask(e), delete this.maskedTiles[e.id]);
  },
  maskTile: function (e, i, s, t) {
    let n = this.getTileAt(e, i, s);
    this.maskedTiles[t.id] !== n &&
      (this.maskedTiles[t.id] && this.unMaskTile(t), n.isWalkable() && ((this.maskedTiles[t.id] = n), n.toggleMask(t)));
  },
  floorStartFall: function (e) {
    let i = new PrinceJS.Tile.Base(this.game, PrinceJS.Level.TILE_SPACE, 0, e.type);
    for (
      e.type === PrinceJS.Level.TYPE_PALACE && (i.back.frameName = e.key + "_0_1"),
        this.addTile(e.roomX, e.roomY, e.room, i);
      this.getTileAt(e.roomX, e.roomY, e.room).element === PrinceJS.Level.TILE_SPACE;

    )
      e.roomY++,
        e.roomY === 3 && ((e.roomY = 0), (e.room = this.rooms[e.room].links.down)),
        (e.yTo += PrinceJS.BLOCK_HEIGHT);
  },
  floorStopFall: function (e) {
    let i = this.getTileAt(e.roomX, e.roomY, e.room);
    i.element !== PrinceJS.Level.TILE_SPACE
      ? (e.destroy(), i.addDebris(), this.shakeFloor(e.roomY, e.room))
      : e.sweep();
  },
  fireEvent: function (e, i, s) {
    if (!this.events[e]) return;
    let t = this.events[e].room,
      n = (this.events[e].location - 1) % 10,
      l = Math.floor((this.events[e].location - 1) / 10),
      r = this.getTileAt(n, l, t);
    r.element === PrinceJS.Level.TILE_EXIT_LEFT && (r = this.getTileAt(n + 1, l, t)),
      i === PrinceJS.Level.TILE_RAISE_BUTTON
        ? r.raise &&
          (r.raise(s),
          [PrinceJS.Level.TILE_EXIT_LEFT, PrinceJS.Level.TILE_EXIT_RIGHT].includes(r.element) &&
            (this.exitDoorOpen = !0))
        : r.drop && r.drop(s),
      this.events[e].next && this.fireEvent(e + 1, i);
  },
  activateChopper: function (e, i, s) {
    let t;
    do t = this.getTileAt(++e, i, s);
    while (e < 9 && t.element !== PrinceJS.Level.TILE_CHOPPER);
    t.element === PrinceJS.Level.TILE_CHOPPER && this.delegate.handleChop(t);
  },
  checkGates: function (e, i) {
    let s = this.getGatesAll(e, i);
    this.activeGates.forEach((t) => {
      s.includes(t) || t.isVisible(!1);
    }),
      s.forEach((t) => {
        t.isVisible(!0);
      }),
      (this.activeGates = s);
  },
  getGatesAll: function (e, i) {
    let s = [...this.getGates(e), ...this.getGatesLeft(e)];
    return (
      i &&
        e &&
        this.rooms[e] &&
        (this.rooms[e].links.up === i && s.push(...this.getGatesUp(e)),
        this.rooms[e].links.down === i && s.push(...this.getGatesDown(e))),
      s
    );
  },
  getGates: function (e, i, s) {
    let t = [];
    return (
      e &&
        this.rooms[e] &&
        this.rooms[e].tiles.forEach((n) => {
          n.element === PrinceJS.Level.TILE_GATE &&
            ((i === void 0 && s === void 0) ||
              (i !== void 0 && s !== void 0 && n.roomX === i && n.roomY === s) ||
              (i !== void 0 && s === void 0 && n.roomX === i) ||
              (i === void 0 && s !== void 0 && n.roomY === s)) &&
            t.push(n);
        }),
      t
    );
  },
  getGatesLeft: function (e) {
    let i = [];
    if (e && this.rooms[e]) {
      let s = this.rooms[e].links.left;
      s > 0 && i.push(...this.getGates(s, 9));
    }
    return i;
  },
  getGatesRight: function (e) {
    let i = [];
    if (e && this.rooms[e]) {
      let s = this.rooms[e].links.right;
      s > 0 && i.push(...this.getGates(s, 0));
    }
    return i;
  },
  getGatesUp: function (e) {
    let i = [];
    if (e && this.rooms[e]) {
      let s = this.rooms[e].links.up;
      if (s > 0) {
        i.push(...this.getGates(s, void 0, 2));
        let t = this.rooms[s].links.left;
        t > 0 && i.push(...this.getGates(t, 9, 2));
      }
    }
    return i;
  },
  getGatesDown: function (e) {
    let i = [];
    if (e && this.rooms[e]) {
      let s = this.rooms[e].links.down;
      if (s > 0) {
        i.push(...this.getGates(s, void 0, 0));
        let t = this.rooms[s].links.left;
        t > 0 && i.push(...this.getGates(t, 9, 0));
      }
    }
    return i;
  },
  recheckCurrentRoom: function () {
    this.delegate.recheckCurrentRoom();
  }
};
PrinceJS.Level.prototype.constructor = PrinceJS.Level;
