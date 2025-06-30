PrinceJS.Tile.Star = function (t, e, s) {
  (this.game = t), (this.back = this.game.make.sprite(e, s, "cutscene")), (this.state = 1), this.update();
};
PrinceJS.Tile.Star.prototype.update = function () {
  switch (this.game.rnd.between(1, 10)) {
    case 1:
      this.state > 0 && this.state--;
      break;
    case 2:
      this.state < 2 && this.state++;
      break;
  }
  this.back.frameName = "star" + this.state;
};
PrinceJS.Tile.Star.prototype.constructor = PrinceJS.Tile.Star;
