var moment = require('moment');
module.exports = Scoreboard;
var IMAGES = require('./../config').images;
var path = '../../assets/images/';
function Scoreboard(game){}
var style = { font: "bold 32px Arial", fill: "#ecf0f1", boundsAlignH: "center", boundsAlignV: "middle" };
Scoreboard.prototype = {
    preload: function() {

    },

    create: function() {
        this._acceptKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this._acceptKey.onDown.add(this.changeMenuPos, this);
        this.game.add.tileSprite(0, 0, 640, 480, IMAGES.MAINMENU);
        //Defined Menu
        var scores = JSON.parse(localStorage.getItem("scoreboard") || "[]");

        this.game.add.text(320,  100 , "Tablica wyników" ,{ font: "bold 60px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" }
        ).anchor.set(0.5);

        this.game.stage.backgroundColor = '#1abc9c';
        var index = 1;
        if(scores.length > 0) {
            for (var score in scores) {
                if (scores.hasOwnProperty(score) && index < 6) {
                    var mn = scores[score],
                        textbox = this.game.add.text(40, 160 + (index * 50), index + '. ' + mn.name, style),
                        textbox_date = this.game.add.text(300, 160 + (index * 50), moment(mn.date).format('DD/MM H:mm'), style),
                        textbox_points = this.game.add.text(530, 160 + (index * 50), mn.score, style);
                    index++;
                }
            }
        } else {
            this.game.add.text(320,  350 , "Aktualnie lista jest pusta." ,{ font: "bold 3px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" }
            ).anchor.set(0.5);
        }
    },

    changeMenuPos: function(){
        if (this._acceptKey.isDown) {
            this.state.start('MainMenu', true, true);

        }
    }
};