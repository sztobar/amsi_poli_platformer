var IMAGES = require('./IMAGES');
var path = '../assets/images/';

function preload(game) {

    game.load.image(IMAGES.SKY, path + 'sky.png');
    game.load.image(IMAGES.GROUND, path + 'platform.png');
    game.load.image(IMAGES.STAR, path + 'star.png');
    game.load.spritesheet(IMAGES.PLAYER, path + 'braun.png', 32, 48);
    game.load.image(IMAGES.FIREBALL, path + 'fireball.png');

      
    game.load.tilemap('level', '../assets/mapa-wies/mapa-wies2.json', null, Phaser.Tilemap.TILED_JSON);

    //  Next we load the tileset. This is just an image, loaded in via the normal way we load images:

    game.load.image('tiles', '../assets/mapa-wies/tileset.png');
    game.load.image('background', '../assets/mapa-wies/wies-tlo.png');

} 

module.exports = preload;
