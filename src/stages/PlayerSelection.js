module.exports = PlayerSelection;

var IMAGES = require('./../config').images;
var path = '../../assets/images/';

function PlayerSelection(game){

};

PlayerSelection.prototype = {
    preload: function() {
        this.load.spritesheet(IMAGES.PLAYER_1_AV, path + 'PlayerAvatars/player_1.png', 150, 150);
        this.load.spritesheet(IMAGES.PLAYER_2_AV, path + 'PlayerAvatars/player_2.png', 150, 150);
        this.load.spritesheet(IMAGES.PLAYER_3_AV, path + 'PlayerAvatars/player_3.png', 150, 150);
        this.load.spritesheet(IMAGES.PLAYER_4_AV, path + 'PlayerAvatars/player_4.png', 150, 150)

    },
    create: function() {
        var self = this;
        this.game.stage.backgroundColor = '#1abc9c';
        this.game.add.text(this.game.world.centerX,  60 , "Wybierz bohatera" ,{ font: "bold 30px Arial", fill: "ecf0f1", boundsAlignH: "center", boundsAlignV: "middle" }
        ).anchor.set(0.5);;



        var sprite_av1 = this.game.add.sprite(100,  110, IMAGES.PLAYER_1_AV);
        sprite_av1.inputEnabled = true;
        sprite_av1.events.onInputDown.add(function(){
            console.log(1);
            self.loadGame(1);
        }, this);

        var sprite_av2 = this.game.add.sprite(390, 110, IMAGES.PLAYER_2_AV);
        sprite_av2.inputEnabled = true;
        sprite_av2.events.onInputDown.add(function(){
            console.log(2);
            self.loadGame(2);
        }, this);

        var sprite_av3 = this.game.add.sprite(100,  300, IMAGES.PLAYER_3_AV);
        sprite_av3.inputEnabled = true;
        sprite_av3.events.onInputDown.add(function(){
            console.log(3);
            self.loadGame(3);
        }, this);

        var sprite_av4 = this.game.add.sprite(390, 300, IMAGES.PLAYER_4_AV);
        sprite_av4.inputEnabled = true;
        sprite_av4.events.onInputDown.add(function(){
            console.log(4);
            self.loadGame(4);
        }, this);
    },
    update: function() {

    },
    loadGame : function(hero_num){
        this.game.currentSelectHero = hero_num;
        this.game.state.start('Preloader');
    }
};