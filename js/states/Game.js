var MrHop = MrHop || {};

MrHop.GameState = {
  init: function() {
    this.timer = 0;
    // pool floors
    this.floorPool = this.add.group();
    this.floorPool2 = this.add.group();

    // pool of platforms
    this.platformPool1 = this.add.group();
    this.platformPool2 = this.add.group();

    // gravity enable
    this.game.physics.arcade.gravity.y = 1000;

    // max jumping distance
    this.maxJumpDistance = 60;
    this.maxJumpDistance2 = 200;

    // Allow keyboard movement in game
    this.cursors = this.game.input.keyboard.createCursorKeys();

    // coins
    this.myCoins = 0;
    // speed level
    this.levelSpeed = 200;
  },
  create: function() {
    // this.background = this.game.add.sprite(0, 0, 'background');
    // this.background.scale.setTo(0.47);
    this.background = this.add.tileSprite(0,0, this.game.world.width, this.game.world.height, 'background');
    this.background.tileScale.y = 0.35;
    this.background.tileScale.x = 0.30;
    this.background.autoScroll(-this.levelSpeed/6, 0);
    // create the first player scaling to the game and enabling physics
    this.player = this.add.sprite(100,230, 'bot', 4);
    this.player.anchor.setTo(0.5);
    this.player.scale.setTo(0.35);
    this.player.animations.add('walk',[10,11], 10, true);
    this.player.animations.play('walk');
    this.game.physics.arcade.enable(this.player);
    // manually adjust the body box so extrmeities are not counted
    this.player.body.setSize(120, 155, 0, 50);
    // create the second player the same except with new gravity and scale
    this.player2 = this.add.sprite(100, 200, 'player');
    this.player2.anchor.setTo(0.5);
    this.player2.scale.setTo(1, -1);
    this.player2.animations.add('running', [0, 1, 2, 3, 2, 1], 15, true);
    this.game.physics.arcade.enable(this.player2);
    this.player2.body.gravity.y += -2000;
    this.player2.body.setSize(34, 60, 7, 5);
    this.player2.play('running');

    this.jump = this.add.audio('jumpSound');
    this.jump2 = this.add.audio('jumpSound2');
    this.death = this.add.audio('deathSound');
    this.soundtrack = this.add.audio('soundtrack');
    this.soundtrack.volume = 0.5;
    this.soundtrack.play();
    this.soundtrack.loop = true;
    // moving water
    this.water = this.add.tileSprite(0, this.game.world.height - 30, this.game.world.width, 30, 'water');
    this.water.autoScroll(-this.levelSpeed/2, 0);


    // hard code first platform
    this.current_platform = new MrHop.Platform(this.game, this.floorPool, 12, 0, 280, this.levelSpeed);
    // create a pool of platforms and add those platforms to the group
    this.platformPool1.add(this.background);
    this.platformPool1.add(this.water);

    this.platformPool1.add(this.current_platform);


    this.current_platformI1 = new MrHop.PlatformInverse(this.game,this.floorPool2, 12, 0, 40, this.levelSpeed);
    this.platformPool2.add(this.current_platformI1);
    // call the function which randomises tile generation
    this.loadLevel();



  },

  update: function() {

    this.timer+= this.game.time.elapsed / 700;
    console.log(this.timer);
    // iterate through the group of groups checking those alive so as to add collision to each player
    this.platformPool1.forEachAlive(function(platform, index) {
      this.game.physics.arcade.collide(this.player2, platform);
      this.game.physics.arcade.collide(this.player, platform);
      // check if platform needs to be killed by checking length more than one and its last element has left the screen
      if(platform.length && platform.children[platform.length - 1].right < 0) {
        platform.kill();
      }
    }, this);

    this.platformPool2.forEachAlive(function(platform, index) {
      this.game.physics.arcade.collide(this.player2, platform);
      this.game.physics.arcade.collide(this.player, platform);
      // check if platform needs to be killed
      if(platform.length && platform.children[platform.length - 1].right < 0) {
        platform.kill();
      }
    }, this);
    // checks that the player is touching the ground before increasing x
    if(this.player2.body.touching.up) {
      this.player2.body.velocity.x = this.levelSpeed;
    }
    else {
      //velocity does not change
      this.player2.body.velocity.x = 0;
    }

    if (this.player.body.touching.down) {
      this.player.body.velocity.x = this.levelSpeed;
    }
    else {
      //velocity does not change
      this.player.body.velocity.x = 0;
    }
    // checks whether selected is downn or the user is touching a cetain half of the screen
    if(this.cursors.left.isDown || (this.game.input.activePointer.isDown && this.game.input.y > (this.game.height/2))) {
      this.playerJump();

    }
    else if(this.cursors.left.isUp || (this.game.input.activePointer.isUp && this.game.input.y > (this.game.height/2))) {
      this.isJumping1 = false;
    }
    if(this.cursors.right.isDown || (this.game.input.activePointer.isDown && this.game.input.y < (this.game.height/2) && (this.game.input.y > 10))) {
      this.player2Jump();
    }
    else if(this.cursors.right.isUp || (this.game.input.activePointer.isUp && this.game.input.y < (this.game.height/2))) {
      this.isJumping2 =false;
    }

    if(this.current_platform.length && this.current_platform.children[this.current_platform.length - 1].right < this.game.world.width) {
      this.createPlatform();
    }
    if(this.current_platformI1.length && this.current_platformI1.children[this.current_platformI1.length - 1].right < this.game.world.width) {
      this.createPlatformI();
    }

    if(this.player.y > 300 || this.player2.y < 0) {
      this.gameOver();
    }
  },
  // great for debugging
  render: function() {
    // used for dubugging bounding box
    // this.game.debug.body(this.player);
    // this.game.debug.body(this.player2);
    // add the body info regarding selected
    // this.game.debug.bodyInfo(this.player2, 0, 30);
  },
  playerJump:function() {
    if(this.player.body.touching.down) {
      console.log("hello");
      this.jump.play();
      // starting point of the jump
      this.startJumpY = this.player.y;
      // keep track of the fact it is jumping
      this.isJumping1 = true;
      // true once peak jump is reached
      this.jumpPeaked1 = false;
      // the jumps value
      this.player.body.velocity.y = -400;
    }
    // confirms player is jumping as well as not peaked
    else if(this.isJumping1 && !this.jumpPeaked1) {
      // distance jumped worked out by workig out starting point of jump
      // then minuses playeers current position to find out how high jumped
      var distanceJumped = this.startJumpY - this.player.y;
      // confirms the distance jumped is less than the max distance determined previously
      if(distanceJumped <= this.maxJumpDistance) {
        // jump value
        this.player.body.velocity.y = -300;
      }
      else {
        // if max distance descend
        this.jumpPeaked1 = true;
      }
    }
  },
  player2Jump: function() {
    if(this.player2.body.touching.up) {
      console.log("down");
      this.jump2.play();
      // starting point of the jump
      this.startJumpY = this.player2.y;
      // keep track of the fact it is jumping
      this.isJumping2 = true;
      this.jumpPeaked2 = false;

      this.player2.body.velocity.y = 400;
    }
    else if(this.isJumping2 && !this.jumpPeaked2) {
      var distanceJumped = this.startJumpY + this.player2.y;

      if(distanceJumped <= this.maxJumpDistance2) {
        this.player2.body.velocity.y = 300;
      }
      else {
        this.jumpPeaked2 = true;
      }
    }
  },
  loadLevel: function() {
    // create rhe two styles of platforms
    this.createPlatform();
    this.createPlatformI();
  },
  createPlatform: function() {
    var nextPlatformdata = this.generatePlatform();

    // check the randomised data
    if(nextPlatformdata) {
      // add any killed off platforms to the group
      this.current_platform = this.platformPool1.getFirstDead();
      // if there are no dead platforms create new
      if(!this.current_platform) {
        this.current_platform = new MrHop.Platform(this.game, this.floorPool, nextPlatformdata.numTiles, this.game.world.width + nextPlatformdata.separation, nextPlatformdata.y, this.levelSpeed );
      }
      // if there is a dead one add it to the cycle
      else {
        this.current_platform.prepare(nextPlatformdata.numTiles, this.game.world.width + nextPlatformdata.separation, nextPlatformdata.y, this.levelSpeed );
      }
      // finally add it to the pool
      this.platformPool1.add(this.current_platform);
    }
  },
  createPlatformI: function() {
    var nextIPlatformdata = this.generatePlatformI();

    if(nextIPlatformdata) {
      console.log("hello");

      this.current_platformI1 = this.platformPool2.getFirstDead();

      if(!this.current_platformI1) {
        this.current_platformI1 = new MrHop.PlatformInverse(this.game, this.floorPool2, nextIPlatformdata.numTiles, this.game.world.width + nextIPlatformdata.separation, nextIPlatformdata.y, this.levelSpeed );
      }
      else {
        this.current_platformI1.prepare(nextIPlatformdata.numTiles, this.game.world.width + nextIPlatformdata.separation, nextIPlatformdata.y, this.levelSpeed );
      }
      this.platformPool2.add(this.current_platformI1);
    }
  },
  generatePlatform: function() {
    var data = {};
    //distance from previous tile
    var minSeparation = 60;
    var maxSeparation = 140;
    data.separation = minSeparation + Math.random() * (maxSeparation - minSeparation);
    //y in regards to previous
    var minDiffY = -120;
    var maxDiffY = 120;
    data.y = 280 - (Math.random() * 80);

    //number of tiles
    var minTiles = 3;
    var maxTiles = 5;
    data.numTiles= minTiles + Math.random() * (maxTiles - minTiles);

    return data;
  },
  generatePlatformI: function() {
    var data = {};
    //distance from previous tile
    var minSeparation = 60;
    var maxSeparation = 100;
    data.separation = minSeparation + Math.random() * (maxSeparation - minSeparation);
    var minDiffY = 0;
    var maxDiffY = 0;
    data.y = 40 + Math.random() * 40;

    //number of tiles
    var minTiles = 3;
    var maxTiles = 5;
    data.numTiles= minTiles + Math.random() * (maxTiles - minTiles);

    return data;
  },
  gameOver: function() {
    var message = Math.floor(this.timer);
    this.soundtrack.stop();
    this.state.start('Home', true, false, message);
  }

};
