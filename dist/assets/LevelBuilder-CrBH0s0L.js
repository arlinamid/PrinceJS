PrinceJS.LevelBuilder = function (t, i) {
  (this.game = t),
    (this.delegate = i),
    this.height,
    this.width,
    this.type,
    (this.layout = []),
    (this.wallColor = ["#D8A858", "#E0A45C", "#E0A860", "#D8A054", "#E0A45C", "#D8A458", "#E0A858", "#D8A860"]),
    (this.wallPattern = []),
    this.seed,
    this.level;
};
PrinceJS.LevelBuilder.prototype = {
  buildFromJSON: function (t) {
    (this.width = t.size.width),
      (this.height = t.size.height),
      (this.type = t.type),
      this.game.world.setBounds(0, 0, PrinceJS.WORLD_WIDTH * this.width, PrinceJS.WORLD_HEIGHT * this.height),
      (this.level = new PrinceJS.Level(this.game, t.number, t.name, this.type)),
      (this.level.delegate = this.delegate),
      (this.startRoomId = t.prince.room),
      (this.startLocation = t.prince.location + (t.prince.bias || 0));
    let i, r, l, h;
    for (i = 0; i < this.height; i++)
      for (this.layout[i] = [], r = 0; r < this.width; r++) {
        let a = i * this.width + r;
        (l = t.room[a].id),
          (this.layout[i][r] = l),
          l !== -1 &&
            (this.type === PrinceJS.Level.TYPE_PALACE && this.generateWallPattern(l),
            (this.level.rooms[l] = {}),
            (this.level.rooms[l].x = r),
            (this.level.rooms[l].y = i),
            (this.level.rooms[l].links = {}),
            (this.level.rooms[l].tiles = t.room[a].tile));
      }
    for (i = this.height - 1; i >= 0; i--)
      for (r = 0; r < this.width; r++)
        if (((l = this.layout[i][r]), l !== -1)) {
          if (
            ((this.level.rooms[l].links.left = this.getRoomId(r - 1, i)),
            (this.level.rooms[l].links.right = this.getRoomId(r + 1, i)),
            (this.level.rooms[l].links.up = this.getRoomId(r, i - 1)),
            (this.level.rooms[l].links.down = this.getRoomId(r, i + 1)),
            this.level.rooms[l].links.left <= 0)
          )
            for (let a = 2; a >= 0; a--)
              (h = new PrinceJS.Tile.Base(this.game, PrinceJS.Level.TILE_WALL, 0, this.type)),
                (h.back.frameName = h.key + "_wall_0"),
                this.level.addTile(-1, a, l, h);
          if ((this.buildRoom(l, this.startRoomId, this.startLocation), this.level.rooms[l].links.up <= 0))
            for (let a = 0; a < 10; a++)
              (h = new PrinceJS.Tile.Base(this.game, PrinceJS.Level.TILE_FLOOR, 0, this.type)),
                this.level.addTile(a, -1, l, h);
        }
    return (this.level.events = t.events), this.level;
  },
  buildRoom: function (t, i, r) {
    for (let l = 2; l >= 0; l--)
      for (let h = 0; h < 10; h++) {
        let a = this.buildTile(h, l, t, i, r);
        this.level.addTile(h, l, t, a);
      }
  },
  buildTile: function (t, i, r, l, h) {
    let a = i * 10 + t,
      s = this.level.rooms[r].tiles[a],
      e,
      n,
      c,
      m,
      d;
    switch (s.element) {
      case PrinceJS.Level.TILE_WALL:
        if (
          ((e = new PrinceJS.Tile.Base(this.game, s.element, s.modifier, this.type)),
          (c = a + r),
          (m = ""),
          this.getTileAt(t - 1, i, r) === PrinceJS.Level.TILE_WALL ? (m = "W") : (m = "S"),
          (m += "W"),
          this.getTileAt(t + 1, i, r) === PrinceJS.Level.TILE_WALL ? (m += "W") : (m += "S"),
          this.type === PrinceJS.Level.TYPE_DUNGEON)
        )
          e.front.frameName = m + "_" + c;
        else {
          let o = this.game.make.bitmapData(60, 79);
          o.rect(0, 16, 32, 20, this.wallColor[this.wallPattern[r][i * 44 + t]]),
            o.rect(0, 36, 16, 21, this.wallColor[this.wallPattern[r][i * 44 + 11 + t]]),
            o.rect(16, 36, 16, 21, this.wallColor[this.wallPattern[r][i * 44 + 11 + t + 1]]),
            o.rect(0, 57, 8, 19, this.wallColor[this.wallPattern[r][i * 44 + 2 * 11 + t]]),
            o.rect(8, 57, 24, 19, this.wallColor[this.wallPattern[r][i * 44 + 2 * 11 + t + 1]]),
            o.rect(0, 76, 32, 3, this.wallColor[this.wallPattern[r][i * 44 + 3 * 11 + t]]),
            o.add(e.front),
            (n = this.game.make.sprite(0, 16, e.key, "W_" + c)),
            e.front.addChild(n);
        }
        m.charAt(2) === "S" && (e.back.frameName = e.key + "_wall_" + s.modifier);
        break;
      case PrinceJS.Level.TILE_SPACE:
      case PrinceJS.Level.TILE_FLOOR:
        (e = new PrinceJS.Tile.Base(this.game, s.element, s.modifier, this.type)),
          (n = this.game.make.sprite(0, 0, e.key, e.key + "_" + s.element + "_" + s.modifier)),
          e.back.addChild(n);
        break;
      case PrinceJS.Level.TILE_STUCK_BUTTON:
      case PrinceJS.Level.TILE_RAISE_BUTTON:
      case PrinceJS.Level.TILE_DROP_BUTTON:
        (e = new PrinceJS.Tile.Button(this.game, s.element, s.modifier, this.type)),
          e.onPushed.add(this.delegate.fireEvent, this.delegate),
          this.level.addTrob(e);
        break;
      case PrinceJS.Level.TILE_TORCH:
      case PrinceJS.Level.TILE_TORCH_WITH_DEBRIS:
        (e = new PrinceJS.Tile.Torch(this.game, s.element, s.modifier, this.type)), this.level.addTrob(e);
        break;
      case PrinceJS.Level.TILE_POTION:
        if (((e = new PrinceJS.Tile.Potion(this.game, s.modifier, this.type)), e.isSpecial)) {
          let o = this.getTileObjectAt(0, 0, 8);
          o && ((e.specialModifier = o.modifier), e.onDrank.add(this.delegate.fireEvent, this.delegate));
        }
        this.level.addTrob(e);
        break;
      case PrinceJS.Level.TILE_SWORD:
        (e = new PrinceJS.Tile.Sword(this.game, s.modifier, this.type)), this.level.addTrob(e);
        break;
      case PrinceJS.Level.TILE_EXIT_RIGHT:
        (d = r === l && Math.abs(a - h) <= 1),
          (e = new PrinceJS.Tile.ExitDoor(this.game, s.modifier, this.type, d)),
          this.level.addTrob(e),
          d &&
            PrinceJS.Utils.delayed(() => {
              e.drop();
            }, 200);
        break;
      case PrinceJS.Level.TILE_CHOPPER:
        (e = new PrinceJS.Tile.Chopper(this.game, s.modifier, this.type)),
          e.onChopped.add(this.level.activateChopper, this.level),
          this.level.addTrob(e);
        break;
      case PrinceJS.Level.TILE_SPIKES:
        (e = new PrinceJS.Tile.Spikes(this.game, s.modifier, this.type)), s.modifier === 0 && this.level.addTrob(e);
        break;
      case PrinceJS.Level.TILE_LOOSE_BOARD:
        (e = new PrinceJS.Tile.Loose(this.game, s.modifier, this.type)),
          e.onStartFalling.add(this.delegate.floorStartFall, this.delegate),
          e.onStopFalling.add(this.delegate.floorStopFall, this.delegate),
          this.level.addTrob(e);
        break;
      case PrinceJS.Level.TILE_SKELETON:
        (e = new PrinceJS.Tile.Skeleton(this.game, s.modifier, this.type)), this.level.addTrob(e);
        break;
      case PrinceJS.Level.TILE_MIRROR:
        (e = new PrinceJS.Tile.Mirror(this.game, s.modifier, this.type)), this.level.addTrob(e);
        break;
      case PrinceJS.Level.TILE_GATE:
        (e = new PrinceJS.Tile.Gate(this.game, s.modifier, this.type)),
          e.onFastDrop.add(this.delegate.checkGateFastDropped, this.delegate),
          s.mute === !1 && e.setCanMute(!1),
          this.level.addTrob(e);
        break;
      case PrinceJS.Level.TILE_TAPESTRY:
        (e = new PrinceJS.Tile.Base(this.game, s.element, s.modifier, this.type)),
          this.type === PrinceJS.Level.TYPE_PALACE &&
            s.modifier > 0 &&
            ((e.back.frameName = e.key + "_" + s.element + "_" + s.modifier),
            (e.front.frameName = e.back.frameName + "_fg"));
        break;
      case PrinceJS.Level.TILE_TAPESTRY_TOP:
        (e = new PrinceJS.Tile.Base(this.game, s.element, s.modifier, this.type)),
          this.type === PrinceJS.Level.TYPE_PALACE &&
            s.modifier > 0 &&
            ((e.back.frameName = e.key + "_" + s.element + "_" + s.modifier),
            (e.front.frameName = e.back.frameName + "_fg"),
            this.getTileAt(t - 1, i, r) === PrinceJS.Level.TILE_LATTICE_SUPPORT &&
              ((n = this.game.make.sprite(0, 0, e.key, e.key + "_" + PrinceJS.Level.TILE_SMALL_LATTICE + "_fg")),
              e.back.addChild(n)));
        break;
      case PrinceJS.Level.TILE_BALCONY_RIGHT:
        (e = new PrinceJS.Tile.Base(this.game, s.element, s.modifier, this.type)),
          this.type === PrinceJS.Level.TYPE_PALACE &&
            ((n = this.game.make.sprite(0, -4, e.key, e.key + "_balcony")), e.back.addChild(n));
        break;
      default:
        (e = new PrinceJS.Tile.Base(this.game, s.element, s.modifier, this.type)),
          s.element === PrinceJS.Level.TILE_BOTTOM_BIG_PILLAR &&
            this.getTileAt(t, i - 1, r) !== PrinceJS.Level.TILE_TOP_BIG_PILLAR &&
            ((e.front.frameName += "_low"), (e.back.frameName += "_low"));
        break;
    }
    return e;
  },
  getTileObjectAt: function (t, i, r) {
    let l = this.level.rooms[r];
    return (
      t < 0 && ((r = this.getRoomId(l.x - 1, l.y)), (t += 10)),
      t > 9 && ((r = this.getRoomId(l.x + 1, l.y)), (t -= 10)),
      i < 0 && ((l = this.getRoomId(l.x, l.y - 1)), (i += 3)),
      i > 2 && ((l = this.getRoomId(l.x, l.y + 1)), (i -= 3)),
      r === -1 ? null : this.level.rooms[r].tiles[t + i * 10]
    );
  },
  getTileAt: function (t, i, r) {
    let l = this.getTileObjectAt(t, i, r);
    return l ? l.element : PrinceJS.Level.TILE_WALL;
  },
  getRoomId: function (t, i) {
    return t < 0 || t >= this.width || i < 0 || i >= this.height ? -1 : this.layout[i][t];
  },
  generateWallPattern: function (t) {
    (this.wallPattern[t] = []), (this.seed = t), this.prandom(1);
    let i;
    for (let r = 0; r < 3; r++)
      for (let l = 0; l < 4; l++) {
        let h = l % 2 ? 0 : 4,
          a = -1;
        for (let s = 0; s <= 10; ++s) {
          do i = h + this.prandom(3);
          while (i === a);
          (this.wallPattern[t][44 * r + 11 * l + s] = i), (a = i);
        }
      }
  },
  prandom: function (t) {
    return (this.seed = ((this.seed * 214013 + 2531011) & 4294967295) >>> 0), (this.seed >>> 16) % (t + 1);
  }
};
PrinceJS.LevelBuilder.prototype.constructor = PrinceJS.LevelBuilder;
