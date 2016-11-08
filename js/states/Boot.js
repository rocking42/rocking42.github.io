var MrHop = MrHop || {};

MrHop.BootState = {
  init: function() {
    this.game.stage.backgroundColor = '#fff';
    // scales the game to the screen width
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // center the page horizontally and vertically
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    // initialize arcade physics
    this.game.physics.startSystem(Phaser.Physics.ARACADE);
  },
  // preload loading image assets
  preload: function() {
    this.load.image('preloadbar', 'assets/images/preloader-bar.png');
  },
  // start the loading screen
  create: function() {
    this.state.start('Preload');
  }
};
