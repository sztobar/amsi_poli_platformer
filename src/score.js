/* global Phaser */
var IMAGES = require('./config').images;
var CHAR_WIDTH = 200;
var CHAR_HEIGHT = 200;

function Score(game) {
  this.game = game;
  this.font = this.game.add.retroFont(IMAGES.SCORE, CHAR_WIDTH, CHAR_HEIGHT, '0123456789', 3);
  this.update('0');
     
  var x = this.game.camera.view.width - 70;
  this.image = this.game.add.image(x, 16, this.font, 0);
  this.image.fixedToCamera = true;
  this.image.anchor.set(1, 0);
  this.image.scale.set(0.25);
  this.image.alpha = 0.9;
  
  this.icon = this.game.add.image(x + 52, 16, IMAGES.STAR);
  this.icon.fixedToCamera = true;
  this.icon.anchor.set(1, 0);
  this.icon.scale.set(2);
  this.icon.smoothed = false;
  this.icon.alpha = 0.9;
}

Score.prototype = {
  update: function(text) {
    this.font.setText(text, false, 0, 0, Phaser.RetroFont.ALIGN_RIGHT);
  }
};

module.exports = Score;