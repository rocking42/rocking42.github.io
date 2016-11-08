var MrHop = MrHop || {};

MrHop.HomeState = {
  init: function(message) {
    this.message = message;
  },
  create: function() {
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.background = this.game.add.sprite(0,0, 'background');
    this.background.inputEnabled = true;
    this.background.scale.setTo(0.55, 0.4);
    // starts the game when clicked
    var style = {font: '32px Arial', fill: '#260404'};
    // Adds the text for the homepage

    var homeText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 40, "Touch or press cursors to start", style);
    this.background.events.onInputDown.add(function() {


      this.state.start('Game');
    }, this);
    if(this.message) {
      this.score = this.game.add.text(this.game.world.centerX, 120, "You ran for " + this.message + " Seconds", style);
      this.score.anchor.setTo(0.5);

    }



    homeText.anchor.setTo(0.5);
  },
  update: function() {
    if(this.cursors.left.isDown || this.cursors.right.isDown) {

      this.state.start('Game');

    }
  }
};
