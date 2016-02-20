module.exports = EndScore;
var config = require('../config');
var path = '../../assets/images/';
var Speaker = require('../hud/speaker');

var SOUNDS = config.sounds;
var IMAGES = config.images;

function EndScore(game) {
    this.game = game;
    this.currentlySelected = -1;
};

var style = {font: "bold 32px Arial", fill: "#ecf0f1", boundsAlignH: "center", boundsAlignV: "middle"};
var selectedStyle = {font: "bold 32px Arial", fill: "#ff3333", boundsAlignH: "center", boundsAlignV: "middle"};
var menuTexts = [];

EndScore.prototype = {
    init: function (stageSetup) {
        this.stageSetup = stageSetup;
    },
	preload: function() {
        this.load.spritesheet(IMAGES.MAINMENU, path + 'menu-tlo.png', 640, 480);
        this.load.spritesheet(IMAGES.MENUTITLE, path + 'menu-title.png', 267, 58);
        this.load.spritesheet(IMAGES.SPEAKER, path + 'speaker.png', 100, 100);

        this.load.audio('menu-music', ['./../../assets/music/muzyka-end.mp3']);
        this.load.audio(SOUNDS.SUCCESS, ['./../../assets/sound/success.wav']);
	},
    create: function () {
        this.game.backgroundMusic = this.sound.play('menu-music', 0.1, true);

        this.successSound = this.add.audio(SOUNDS.SUCCESS, 0.1);
        this.successSound.play();
        this._upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this._downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this._acceptKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this._downKey.onDown.add(this.changeMenuPos, this);
        this._upKey.onDown.add(this.changeMenuPos, this);
        this._upKey.onDown.add(this.changeMenuPos, this);
        this._acceptKey.onDown.add(this.changeMenuPos, this);
        this._acceptKey.onDown.add(this.changeMenuPos, this);
        var menu;
        var self = this;
        this.game.stage.backgroundColor = '#1abc9c';
        this.game.add.tileSprite(0, 0, 640, 480, IMAGES.MAINMENU);

        var texts = {};
        if (this.game.stageSetup.level == 5) {
            texts = {
                title: 'Gra ukończona',
                score: 'Wynik końcowy:' + this.stageSetup.levelScore
            };
            menu = [
                ['Do menu!', 330, this.toMainMenu],
                ['Powtórz poziom', 370, this.repeatGame]
            ];
            this.saveScore(this.game.currentSelectHero, this.stageSetup.levelScore);
        } else {
            texts = {
                title: 'Poziom ukończony',
                score: 'Aktualny Wynik:' + this.stageSetup.levelScore
            };
            menu = [
                ['Kolejny poziom', 330, this.nextLevel],
                ['Powtórz poziom', 370, this.repeatLevel]
            ];
        }
        this.game.add.text(320, 100, texts.title, {
                font: "bold 70px Arial",
                fill: "#2c3e50",
                boundsAlignH: "center",
                boundsAlignV: "middle"
            }
        ).anchor.set(0.5);

        this.game.add.text(320, 160, texts.score, {
                font: "bold 40px Arial",
                fill: "#d35400",
                boundsAlignH: "center",
                boundsAlignV: "middle"
            }
        ).anchor.set(0.5);



        menuTexts = [];
        for (var menuPos in menu) {
            if (menu.hasOwnProperty(menuPos)) {
                var mn = menu[menuPos],
                    textbox = this.game.add.text(320, mn[1], mn[0], style);
                textbox.inputEnabled = true;
                textbox.events.onInputDown.add(mn[2], this);
                textbox.input.useHandCursor = true;
                textbox.anchor.set(0.5);
                menuTexts.push(textbox);
                this.currentlySelected = -1;
            }
        }

        menuTexts[0].setStyle(selectedStyle);
        this.currentlySelected = 0;

        this.speaker = new Speaker(this);


    },

    saveScore: function(hero, score){
        if(typeof(Storage) !== "undefined") {
           var scoreboard = JSON.parse(localStorage.getItem("scoreboard") || "[]");

           var heroLabels = {
               1 : 'Braun',
               2 : 'Macierewicz',
               3 : 'Wippler',
               4 : 'Liroy'
           };
           scoreboard.push({
               name : heroLabels[hero],
               score: score,
               date : new Date()
           });

          scoreboard.sort(function(scoreA, scoreB){
              return scoreA.score < scoreB.score;
          });

          localStorage.setItem('scoreboard', JSON.stringify(scoreboard));

        }
    },
    changeMenuPos: function () {
        if (this._upKey.isDown) {
            menuTexts[this.currentlySelected].setStyle(style);
            this.currentlySelected = this.currentlySelected == 0 ? menuTexts.length - 1 : this.currentlySelected - 1;
            menuTexts[this.currentlySelected].setStyle(selectedStyle);

        } else if (this._downKey.isDown) {
            menuTexts[this.currentlySelected].setStyle(style);
            this.currentlySelected = this.currentlySelected + 1 >= menuTexts.length ? 0 : this.currentlySelected + 1;
            menuTexts[this.currentlySelected].setStyle(selectedStyle);
        } else if (this._acceptKey.isDown) {
            menuTexts[this.currentlySelected].events.onInputDown.dispatch();
        }
    }
    ,
    repeatGame: function () {
        var self = this;
        this.game.stageSetup = {
            level: self.game.stageSetup.level,
            score: self.game.stageSetup.score
        };

        this.game.sound.remove(this.game.backgroundMusic);
        this.state.start('Preloader');
    }
    ,
    repeatLevel: function () {
        var self = this;
        this.game.stageSetup = {
            level: self.game.stageSetup.level,
            score: self.game.stageSetup.score
        };

        this.game.sound.remove(this.game.backgroundMusic);
        this.state.start('Preloader');
    }
    ,
    nextLevel: function () {
        var self = this;
        this.game.stageSetup = {
            level: self.game.stageSetup.level + 1,
            score: self.game.stageSetup.levelScore
        };

        this.game.sound.remove(this.game.backgroundMusic);
        this.state.start('Preloader');
    }
    ,
    toMainMenu: function () {
        this.state.start('MainMenu');
    }


}
;