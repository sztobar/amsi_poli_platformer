/* global PIXI */
/* global Phaser */
var IMAGES = require('./../config').images;
var path = '../../assets/images/';

var GAME_WIDTH = exports.GAME_WIDTH = 640;
var GAME_HEIGHT = exports.GAME_HEIGHT = 960;

module.exports = Preloader;

function Preloader(game){
};

Preloader.prototype = {
	preload: function() {

		// set background color and preload image
		this.stage.backgroundColor = '#B4D9E7';
		this.preloadBar = this.add.sprite((GAME_WIDTH-311)/2, (GAME_HEIGHT-27)/2, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);


    this.load.image(IMAGES.SKY, path + 'sky.png');
    this.load.image(IMAGES.GROUND, path + 'platform.png');

    this.load.spritesheet(IMAGES.PLAYER_1, path + 'wippler.png', 32, 48);
    this.load.spritesheet(IMAGES.PLAYER_2, path + 'macierewicz.png', 32, 48);
    this.load.spritesheet(IMAGES.PLAYER_3, path + 'braun.png', 32, 48);
    this.load.spritesheet(IMAGES.PLAYER_4, path + 'liroy.png', 32, 48);

    this.load.image(IMAGES.PROJECTILE, path + 'projectile.png');
    this.load.image(IMAGES.STAR, path + 'glos.png');
    this.load.spritesheet(IMAGES.ENEMY, path + 'farmer.png', 60, 48);
    this.load.image(IMAGES.FIREBALL, path + 'fireball.png');
    this.load.image(IMAGES.HEART, path + 'heart.png');

    this.load.spritesheet(IMAGES.SCORE, path + 'score.png');


    this.load.tilemap('level1', './../../assets/mapa-wies/mapa-wies.json', null, Phaser.Tilemap.TILED_JSON);

    //  Next we load the tileset. This is just an image, loaded in via the normal way we load images:
    this.load.image('tiles', './../../assets/mapa-wies/tileset.png');
    this.load.image('tiles-props', './../../assets/images/tiles-props.png');
    this.load.image('background', './../../assets/mapa-wies/wies-tlo.png');

	},
	create: function(){
		// start the MainMenu state
		this.state.start('Level1');
	}
};
