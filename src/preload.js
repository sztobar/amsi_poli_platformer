var IMAGES = require('./IMAGES');
var path = '../assets/images/';

function preload(game) {

    game.load.image(IMAGES.SKY, path + 'sky.png');
    game.load.image(IMAGES.GROUND, path + 'platform.png');
    game.load.image(IMAGES.STAR, path + 'star.png');
    game.load.spritesheet(IMAGES.PLAYER, path + 'dude.png', 32, 48);
    game.load.image(IMAGES.FIREBALL, path + 'fireball.png');

} 

module.exports = preload;
