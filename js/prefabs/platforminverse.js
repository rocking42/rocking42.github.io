var MrHop = MrHop || {};
// example making smaller tiles and flipping the tiles
MrHop.PlatformInverse = function(game,floorPool, numTiles, x, y, speed) {
  Phaser.Group.call(this, game);

  this.tileSize = 40;
  this.game = game;
  this.enableBody = true;
  this.floorPool = floorPool;

  this.prepare(numTiles, x, y, speed);
};

MrHop.PlatformInverse.prototype = Object.create(Phaser.Group.prototype);
MrHop.PlatformInverse.prototype.constructor = MrHop.PlatformInverse;

MrHop.PlatformInverse.prototype.prepare = function(numTiles, x, y, speed) {

    // make alive
    this.alive = true;

    var i = 0;
    while(i < numTiles) {

    var floorTile = this.floorPool.getFirstExists(false);
    // checks if there is a floor tile if not adds a floor tile
    if(!floorTile) {
      floorTile = new Phaser.Sprite(this.game, x + i * this.tileSize, y, 'snow');
    }
    // else reuse the dead floor tile
    else {
      floorTile.reset(x + i * this.tileSize, y );
    }

    // scale a tile for when inverse is called in the future
    floorTile.scale.setTo(0.32, -0.32);
    // add the tile
    this.add(floorTile);
    i++;
  }
  // set physics properties
  this.setAll('body.immovable', true);
  this.setAll('body.allowGravity', false);
  this.setAll('body.velocity.x', -speed);

};

MrHop.PlatformInverse.prototype.kill = function() {
  this.alive = false;
  this.callAll('kill');

  var sprites = [];
  this.forEach(function(tile) {
    sprites.push(tile);
  }, this);

  sprites.forEach(function(tile) {
    this.floorPool.add(tile);
  }, this);
};
