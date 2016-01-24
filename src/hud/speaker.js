var IMAGES = require('../config').images;

var on = true;

module.exports = class Speaker {
  constructor(game) {
    this.game = game;
    var x = this.game.camera.view.width - 70;
    var y = this.game.camera.view.height - 50;
    var sprite = this.sprite = game.add.sprite(x, y, IMAGES.SPEAKER);
    sprite.scale.set(0.5, 0.5);
    sprite.inputEnabled = true;
    sprite.input.useHandCursor = true;
    sprite.events.onInputDown.add(this.onClick, this);
    sprite.fixedToCamera = true;
    sprite.alpha = 0.9;
    
    this.sprite.animations.add('on', [0], 10, true);
    this.sprite.animations.add('off', [1], 10, true);
    
    this.setFrame();
  }
  
  onClick() {
   on = !on;
   this.game.sound.mute = !on;
   this.setFrame();
  }
  
  setFrame() {
   this.sprite.animations.play(on ? 'on' : 'off');
  }
}