PrinceJS.Tile = {};
PrinceJS.Tile.Base = function (e, t, n, i) {
  (this.game = e),
    (this.element = t),
    (this.modifier = n),
    (this.type = i),
    (this.key = i === PrinceJS.Level.TYPE_DUNGEON ? "dungeon" : "palace"),
    (this.back = this.game.make.sprite(0, 0, this.key, this.key + "_" + t)),
    (this.front = this.game.make.sprite(0, 0, this.key, this.key + "_" + t + "_fg")),
    (this.tileHeight = this.front.height),
    this.room,
    this.roomX,
    this.roomY,
    (this.frame = null),
    (this.crop = !1),
    (this.debris = !1);
};
PrinceJS.Tile.Base.prototype = {
  toggleMask: function (e) {
    this.frame !== null
      ? ((this.front.frameName = this.frame),
        this.decoration && this.front.removeChild(this.decoration),
        this instanceof PrinceJS.Tile.Button && this.active
          ? this.front.crop(new Phaser.Rectangle(0, 0, this.maskWidth(e), this.tileHeight - this.offsetY || 0))
          : this.front.crop(null),
        (this.frame = null),
        (this.crop = !1))
      : (this.initDecoration(),
        (this.frame = this.front.frameName),
        this.debris ? (this.front.frameName = this.debrisBack.frameName) : (this.front.frameName = this.back.frameName),
        this.decoration && this.front.addChild(this.decoration),
        this.front.crop(new Phaser.Rectangle(0, this.offsetY || 0, this.maskWidth(e), this.tileHeight)),
        (this.crop = !0));
  },
  initDecoration: function () {
    return (
      [10, 25].includes(this.element) &&
        (this.decoration = this.decoration || this.game.make.sprite(0, 0, this.key, this.front.frameName)),
      this.decoration
    );
  },
  maskWidth: function () {
    return this.element === PrinceJS.Level.TILE_EXIT_LEFT ? 31 : 33;
  },
  isWalkable: function () {
    return (
      this.element !== PrinceJS.Level.TILE_WALL &&
      this.element !== PrinceJS.Level.TILE_SPACE &&
      this.element !== PrinceJS.Level.TILE_TOP_BIG_PILLAR &&
      this.element !== PrinceJS.Level.TILE_TAPESTRY_TOP &&
      this.element !== PrinceJS.Level.TILE_LATTICE_SUPPORT &&
      this.element !== PrinceJS.Level.TILE_SMALL_LATTICE &&
      this.element !== PrinceJS.Level.TILE_LATTICE_LEFT &&
      this.element !== PrinceJS.Level.TILE_LATTICE_RIGHT
    );
  },
  isSafeWalkable: function () {
    return this.isWalkable() && !this.isDangerousWalkable();
  },
  isDangerousWalkable: function () {
    return this.element === PrinceJS.Level.TILE_LOOSE_BOARD || this.element === PrinceJS.Level.TILE_CHOPPER;
  },
  isJumpSpace: function () {
    return this.isSpace() && ![PrinceJS.Level.TILE_TAPESTRY_TOP].includes(this.element);
  },
  isSpace: function () {
    return (
      this.element === PrinceJS.Level.TILE_SPACE ||
      this.element === PrinceJS.Level.TILE_TOP_BIG_PILLAR ||
      this.element === PrinceJS.Level.TILE_TAPESTRY_TOP ||
      this.element === PrinceJS.Level.TILE_LATTICE_SUPPORT ||
      this.element === PrinceJS.Level.TILE_SMALL_LATTICE ||
      this.element === PrinceJS.Level.TILE_LATTICE_LEFT ||
      this.element === PrinceJS.Level.TILE_LATTICE_RIGHT
    );
  },
  isBarrier: function () {
    return (
      this.element === PrinceJS.Level.TILE_WALL ||
      this.element === PrinceJS.Level.TILE_GATE ||
      this.element === PrinceJS.Level.TILE_MIRROR ||
      this.element === PrinceJS.Level.TILE_TAPESTRY ||
      this.element === PrinceJS.Level.TILE_TAPESTRY_TOP
    );
  },
  isFreeFallBarrier: function () {
    return this.isBarrier() && ![PrinceJS.Level.TILE_TAPESTRY, PrinceJS.Level.TILE_TAPESTRY_TOP].includes(this.element);
  },
  isBarrierWalk: function () {
    return this.isBarrier() || this.isDangerousWalkable();
  },
  isBarrierLeft: function () {
    return this.element === PrinceJS.Level.TILE_WALL || this.element === PrinceJS.Level.TILE_MIRROR;
  },
  isBarrierRight: function () {
    return (
      this.element === PrinceJS.Level.TILE_GATE ||
      this.element === PrinceJS.Level.TILE_TAPESTRY ||
      this.element === PrinceJS.Level.TILE_TAPESTRY_TOP
    );
  },
  isSeeBarrier: function () {
    return (
      this.element === PrinceJS.Level.TILE_WALL ||
      this.element === PrinceJS.Level.TILE_TAPESTRY ||
      this.element === PrinceJS.Level.TILE_TAPESTRY_TOP
    );
  },
  isExitDoor: function () {
    return this.element === PrinceJS.Level.TILE_EXIT_LEFT || this.element === PrinceJS.Level.TILE_EXIT_RIGHT;
  },
  destroy: function () {
    this.back.destroy(), this.front.destroy();
  },
  getBounds: function () {
    let e = new Phaser.Rectangle(0, 0, 0, 0);
    return (e.height = 63), (e.width = 4), (e.x = this.roomX * 32 + 40), (e.y = this.roomY * 63), e;
  },
  getBoundsAbs: function () {
    return new Phaser.Rectangle(this.x, this.y, this.width, 63);
  },
  intersects: function (e) {
    return this.getBounds().intersects(e);
  },
  intersectsAbs: function (e) {
    return this.getBoundsAbs().intersects(e);
  },
  addDebris: function () {
    if ((this.game.sound.play("LooseFloorLands"), !this.debris)) {
      if (
        ((this.debris = !0),
        this.initDecoration() &&
          this.decoration.addChild(
            this.game.make.sprite(0, 0, this.key, this.key + "_" + PrinceJS.Level.TILE_DEBRIS + "_fg")
          ),
        this.element === PrinceJS.Level.TILE_LOOSE_BOARD)
      ) {
        this.sweep();
        return;
      }
      this.element === PrinceJS.Level.TILE_SPIKES &&
        (this.drop(), (this.element = PrinceJS.Level.TILE_FLOOR), this.revalidate()),
        this.element === PrinceJS.Level.TILE_TORCH
          ? (this.debrisElement = PrinceJS.Level.TILE_TORCH_WITH_DEBRIS)
          : this.element === PrinceJS.Level.TILE_FLOOR
          ? (this.debrisElement = PrinceJS.Level.TILE_DEBRIS)
          : (this.debrisElement = PrinceJS.Level.TILE_DEBRIS_ONLY),
        (this.debrisBack = this.game.make.sprite(0, 0, this.key, this.key + "_" + this.debrisElement)),
        this.back.addChild(this.debrisBack),
        (this.debrisFront = this.game.make.sprite(0, 0, this.key, this.key + "_" + PrinceJS.Level.TILE_DEBRIS + "_fg")),
        this.front.addChild(this.debrisFront);
    }
  },
  revalidate: function () {
    (this.back.frameName = this.key + "_" + this.element),
      (this.front.frameName = this.key + "_" + this.element + "_fg");
  }
};
PrinceJS.Tile.Base.prototype.constructor = PrinceJS.Tile.Base;
Object.defineProperty(PrinceJS.Tile.Base.prototype, "x", {
  get: function () {
    return this.back.x;
  },
  set: function (e) {
    (this.back.x = e), (this.front.x = e);
  }
});
Object.defineProperty(PrinceJS.Tile.Base.prototype, "y", {
  get: function () {
    return this.back.y;
  },
  set: function (e) {
    (this.back.y = e), (this.front.y = e);
  }
});
Object.defineProperty(PrinceJS.Tile.Base.prototype, "centerX", {
  get: function () {
    return this.back.centerX;
  }
});
Object.defineProperty(PrinceJS.Tile.Base.prototype, "centerY", {
  get: function () {
    return this.back.centerY;
  }
});
Object.defineProperty(PrinceJS.Tile.Base.prototype, "width", {
  get: function () {
    return this.back.width;
  }
});
Object.defineProperty(PrinceJS.Tile.Base.prototype, "height", {
  get: function () {
    return this.back.height;
  }
});
