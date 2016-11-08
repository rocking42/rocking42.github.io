var MrHop = MrHop || {};

MrHop.Platform = function(game, floorPool, numTiles, x, y, speed) {
  Phaser.Group.call(this, game);
  // define the tile size
  this.tileSize = 40;
  this.game = game;
  this.enableBody = true;
  this.floorPool = floorPool;
  // call and pass the parameters into the prepare function
  this.prepare(numTiles, x, y, speed);
  // define a loop that adds tiles for each loop
};
// create a new platform method to be called in the game
MrHop.Platform.prototype = Object.create(Phaser.Group.prototype);
// assign the method to the prototype
MrHop.Platform.prototype.constructor = MrHop.Platform;

// create the reusable sprite function
MrHop.Platform.prototype.prepare = function(numTiles, x, y, speed) {

  // make alive
  this.alive = true;


  var i = 0;
  while(i < numTiles) {

    var floorTile = this.floorPool.getFirstExists(false);
    // checks if there is a floor tile if not adds a floor tile
    if(!floorTile) {
      floorTile = new Phaser.Sprite(this.game, x + i * this.tileSize, y, 'floor');
    }
    // else reuse the dead floor tile
    else {
      floorTile.reset(x + i * this.tileSize, y );
    }

    // scale a tile for when inverse is called in the future
    floorTile.scale.setTo(1);
    // add the tile
    this.add(floorTile);
    i++;
  }
  // set physics properties
  this.setAll('body.immovable', true);
  this.setAll('body.allowGravity', false);
  // moves the tile backwards
  this.setAll('body.velocity.x', -speed);
};

MrHop.Platform.prototype.kill = function() {
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
