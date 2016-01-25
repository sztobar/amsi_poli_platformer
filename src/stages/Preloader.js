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
		
		// players
        this.load.spritesheet(IMAGES.PLAYER_1, path + 'wippler.png', 32, 48);
        this.load.spritesheet(IMAGES.PLAYER_2, path + 'macierewicz.png', 32, 48);
        this.load.spritesheet(IMAGES.PLAYER_3, path + 'braun.png', 32, 48);
        this.load.spritesheet(IMAGES.PLAYER_4, path + 'liroy.png', 32, 48);

		//stuff
        this.load.image(IMAGES.PROJECTILE, path + 'projectile.png');
        this.load.image(IMAGES.STAR, path + 'glos.png');
		
		//hud
        this.load.image(IMAGES.HEART, path + 'heart.png');
        this.load.spritesheet(IMAGES.SCORE, path + 'score.png');			
        this.load.spritesheet(IMAGES.SPEAKER, path + 'speaker.png', 100, 100);
        this.load.spritesheet(IMAGES.TILES_PROPS, './../../assets/images/tiles-props.png', 32, 32);
		//this.load.image('tiles-props', './../../assets/images/tiles-props.png');						<--- tu był powod wyswietlania calego png z chorogiewka

        switch(this.game.stageSetup.level){
			case 1:
                console.log('Loaded 1 level');
                this.load.tilemap('level1', './../../assets/mapa-wies/mapa-wies.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.image('tiles', './../../assets/mapa-wies/tileset.png');
                this.load.image('background', './../../assets/mapa-wies/wies-tlo.png');
                this.load.audio('background-music', ['./../../assets/music/muzyka-wies.mp3']);
           		//wies enemies
				this.load.spritesheet(IMAGES.FARMER, path + 'farmer.png', 32, 48);
				this.load.spritesheet(IMAGES.PIG, path + 'swinia.png', 32, 48);
				this.load.spritesheet(IMAGES.COMPOST, path + 'kompost.png', 60, 36);
				break;

            case 2:
                console.log('Loaded 2 level');
                this.load.tilemap('level2', './../../assets/mapa-miasto/mapa-miasto.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.image('tiles', './../../assets/mapa-miasto/tileset.png');
                this.load.image('background', './../../assets/mapa-miasto/miasto-tlo.png');
                this.load.audio('background-music', ['./../../assets/music/muzyka-miasto.mp3']);
                //miasto enemies
				this.load.spritesheet(IMAGES.BIZNESMAN, path + 'biznesmen.png', 32, 48);
				this.load.spritesheet(IMAGES.SKATEBOARD, path + 'skate.png', 32, 48);
				this.load.spritesheet(IMAGES.SMOG, path + 'smog.png', 60, 36);
				break;

            case 3:
                console.log('Loaded 3 level');
                this.load.tilemap('level3', './../../assets/mapa-sejm/mapa-sejm.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.image('tiles', './../../assets/mapa-sejm/tileset.png');
                this.load.image('background', './../../assets/mapa-sejm/sejm-tlo.png');
                this.load.audio('background-music', ['./../../assets/music/muzyka-sejm.mp3']);
           		//sejm enemies
				this.load.spritesheet(IMAGES.BOR, path + 'bor.png', 32, 48);
				this.load.spritesheet(IMAGES.JOURNALIST, path + 'journalist.png', 32, 48);
				this.load.spritesheet(IMAGES.CORUPT, path + 'korupcja.png', 60, 36);
				break;
			
			case 4:
                console.log('Loaded 4 level');
                this.load.tilemap('level4', './../../assets/mapa-euro/mapa-euro.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.image('tiles', './../../assets/mapa-euro/tileset.png');
                this.load.image('background', './../../assets/mapa-euro/euro-tlo.png');
                this.load.audio('background-music', ['./../../assets/music/muzyka-euro.mp3']);
                //euro enemies
				this.load.spritesheet(IMAGES.MOGHERINI, path + 'mogherini.png', 32, 48);
				this.load.spritesheet(IMAGES.JUNCKER, path + 'juncker.png', 32, 48);
				this.load.spritesheet(IMAGES.POPRAWNOSC, path + 'poprawnosc.png', 60, 36);
				break;
			
			case 5:
                console.log('Loaded 5 level');
                this.load.tilemap('level5', './../../assets/mapa-boss/mapa-boss.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.image('tiles', './../../assets/mapa-boss/tileset.png');
                this.load.image('background', './../../assets/mapa-boss/mapa-boss.png');
                this.load.audio('background-music', ['./../../assets/music/muzyka-miasto.mp3']);
				//bosses
				this.load.spritesheet(IMAGES.MERKEL, path + 'merkel.png', 32, 48);
				this.load.spritesheet(IMAGES.GRONKIEWICZ, path + 'gronkiewicz.png', 32, 48);
				this.load.spritesheet(IMAGES.KACZYNSKI, path + 'kaczynski.png', 32, 48);
				this.load.spritesheet(IMAGES.PAWLAK, path + 'pawlak.png', 32, 48);
                break;
        }
    },
    create: function(){
        // start the MainMenu state
        this.state.start('LevelRenderer');
    }
};
