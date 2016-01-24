module.exports = MainMenu;
function MainMenu(game){
    this.currentlySelected = 0;
};
var IMAGES = require('./../config').images;
var Speaker = require('../hud/speaker');
var path = '../../assets/images/';

var style = { font: "bold 32px Arial", fill: "#ecf0f1", boundsAlignH: "center", boundsAlignV: "middle" };
var selectedStyle = { font: "bold 32px Arial", fill: "#ff3333", boundsAlignH: "center", boundsAlignV: "middle" };

var menuTexts = [];
MainMenu.prototype = {
    preload: function() {
        this.load.spritesheet(IMAGES.MAINMENU, path + 'menu-tlo.png', 640, 480);
        this.load.spritesheet(IMAGES.MENUTITLE, path + 'menu-title.png', 267, 58);

        this.load.spritesheet(IMAGES.SPEAKER, path + 'speaker.png', 100, 100);


    },

    create: function() {

        this._upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this._downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this._acceptKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this._downKey.onDown.add(this.changeMenuPos, this);
        this._upKey.onDown.add(this.changeMenuPos, this);
        this._acceptKey.onDown.add(this.changeMenuPos, this);
        this.game.add.tileSprite(0, 0, 640, 480, IMAGES.MAINMENU);
        //Defined Menu
        var menu = [
            ['Start', 250, this.openPlayerSelection],
            ['Tablica wyników', 290, this.openScoreBoard],
            /*['Twórcy', 330, this.openCredits],*/
            ['Wyjście', 370, function(){}]
        ];

        /*this.game.add.text(320,  100 , "PoliticAmsi" ,{ font: "bold 80px Arial", fill: "#2c3e50", boundsAlignH: "center", boundsAlignV: "middle" }
        ).anchor.set(0.5);*/
        this.game.add.tileSprite(320, 100, 267, 58, IMAGES.MENUTITLE).anchor.set(0.5);

        this.game.stage.backgroundColor = '#1abc9c';
        for(var menuPos in menu){
            if(menu.hasOwnProperty(menuPos)){
                var mn = menu[menuPos],
                    textbox = this.game.add.text(320, mn[1], mn[0],  style);
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

    start : function(){
        this.currentlySelected = 0;
    },

    changeMenuPos: function(){
        if (this._upKey.isDown) {
            menuTexts[this.currentlySelected].setStyle(style);
            this.currentlySelected = this.currentlySelected == 0 ? menuTexts.length - 1  : this.currentlySelected - 1  ;
            menuTexts[this.currentlySelected].setStyle(selectedStyle);

        } else if (this._downKey.isDown) {
            menuTexts[this.currentlySelected].setStyle(style);
            this.currentlySelected = this.currentlySelected +1 >= menuTexts.length ? 0 : this.currentlySelected + 1  ;
            menuTexts[this.currentlySelected].setStyle(selectedStyle);
        } else if (this._acceptKey.isDown) {
            menuTexts[this.currentlySelected].events.onInputDown.dispatch();
        }
    },

    openPlayerSelection : function(){
        this.game.state.start('PlayerSelection');
    },
    openScoreBoard : function(){
        this.game.state.start('Scoreboard');

    },
    openCredits : function(){

    }
};