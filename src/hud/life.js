/* global Phaser */
var IMAGES = require('../config').images;
var CHAR_WIDTH = 200;
var CHAR_HEIGHT = 200;

function Life(game) {
  this.game = game;

  var x = 16;
  var y = 16;
  this.images = this.createImages(x, y);

  this.setCount(3);
}

Life.prototype = {
  createImage: function(x, y) {
    var image = this.game.add.image(x, y, IMAGES.HEART);
    image.fixedToCamera = true;
    image.scale.set(0.2);
    image.alpha = 0.9;
    return image;
  },
  createImages: function(x, y) {
    var images = [];
    for (var i = 0, len = 3; i < len; i++) {
      images[i] = this.createImage(x + (i * 50), y);
    }
    return images;
  },
  setCount: function(count) {
    this._count = count;
    for (var i = 0, len = 3; i < len; i++) {
      if (i < 3 - count) {
        this.images[i].alpha = 0.2;
      } else {
        this.images[i].alpha = 0.9;
      }
    }
  },
  inc: function() {
    if (this._count < 3) {
      this.setCount(this._count + 1);
    }
    return this._count;
  },
  dec: function() {
    if (this._count > 0) {
      this.setCount(this._count - 1);
    }
    return this._count;
  }
};

module.exports = Life;
