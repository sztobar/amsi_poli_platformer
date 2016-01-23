/* global PIXI */
/* global Phaser */
var IMAGES = require('./../config').images;
var path = '../../assets/images/';

var GAME_WIDTH = exports.GAME_WIDTH = 640;
var GAME_HEIGHT = exports.GAME_HEIGHT = 960;

module.exports = Preloader;

function Preloader(game){
    this.game = game;
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
        this.load.spritesheet(IMAGES.ENEMY, path + 'farmer.png', 32, 48);
        this.load.image(IMAGES.FIREBALL, path + 'fireball.png');
        this.load.image(IMAGES.HEART, path + 'heart.png');

        this.load.spritesheet(IMAGES.SCORE, path + 'score.png');

        switch(this.game.stageSetup.level){
            case 1:
                console.log('Loaded 1 level');
                this.load.tilemap('level1', './../../assets/mapa-wies/mapa-wies.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.image('tiles', './../../assets/mapa-wies/tileset.png');
                this.load.image('background', './../../assets/mapa-wies/wies-tlo.png');
                this.load.audio('background-music', ['./../../assets/music/muzyka-wies.mp3']);
                break;
            case 2:
                console.log('Loaded 2 level');
                this.load.tilemap('level2', './../../assets/mapa-miasto/mapa-miasto.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.image('tiles', './../../assets/mapa-miasto/tileset.png');
                this.load.image('background', './../../assets/mapa-miasto/miasto-tlo.png');
                this.load.audio('background-music', ['./../../assets/music/muzyka-miasto.mp3']);
                break;
            case 2:
                console.log('Loaded 3 level');
                this.load.tilemap('level3', './../../assets/mapa-euro/mapa-euro.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.image('tiles', './../../assets/mapa-euro/tileset.png');
                this.load.image('background', './../../assets/mapa-euro/euro-tlo.png');
                this.load.audio('background-music', ['./../../assets/music/muzyka-euro.mp3']);
                break;
            case 4:
                console.log('Loaded 4 level');
                this.load.tilemap('level43', './../../assets/mapa-sejm/mapa-sejm.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.image('tiles', './../../assets/mapa-sejm/tileset.png');
                this.load.image('background', './../../assets/mapa-sejm/sejm-tlo.png');
                this.load.audio('background-music', ['./../../assets/music/muzyka-sejm.mp3']);
                break;

        }
        this.load.image('tiles-props', './../../assets/images/tiles-props.png');
        this.load.spritesheet(IMAGES.TILES_PROPS, './../../assets/images/tiles-props.png', 32, 32);
    },
    create: function(){
        // start the MainMenu state
        this.state.start('LevelRenderer'  );
    }
};
