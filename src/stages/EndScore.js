module.exports = EndScore;
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
    create: function () {
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
        var texts = {};
        if (this.game.stageSetup.level == 4) {
            texts = {
                title: 'Gra ukończona',
                score: 'Wynik końcowy:' + this.stageSetup.score
            };
            menu = [
                ['Do menu!', 330, this.toMainMenu],
                ['Zagraj jeszcze raz', 370, this.repeatGame]
            ];
            this.saveScore(this.game.currentSelectHero, this.stageSetup.score);
        } else {
            texts = {
                title: 'Poziom ukończony',
                score: 'Aktualny Wynik:' + this.stageSetup.score
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


    },

    saveScore: function(hero, score){
        if(typeof(Storage) !== "undefined") {
           var scoreboard = JSON.parse(localStorage.getItem("scoreboard") || "[]");

           var heroLabels = {
               1 : 'Braun',
               2 : 'Macierewicz',
               3 : 'Nie znam naziwska',
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
        this.state.start('Preloader');
    }
    ,
    repeatLevel: function () {
        var self = this;
        this.game.stageSetup = {
            level: 1,
            score: self.game.stageSetup.score
        };
        this.state.start('Preloader');
    }
    ,
    nextLevel: function () {
        var self = this;
        this.game.stageSetup = {
            level: self.game.stageSetup.level + 1,
            score: self.game.stageSetup.score
        };
        this.state.start('Preloader');
    }
    ,
    toMainMenu: function () {
        this.state.start('MainMenu');
    }


}
;