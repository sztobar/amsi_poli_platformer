module.exports = PlayerSelection;

var IMAGES = require('./../config').images;
var path = '../../assets/images/';
var borderSprite, playerTab, currentPosX = 0, currentPosY = 0;
var sizeAvatar = 150;

function PlayerSelection(game){

};

PlayerSelection.prototype = {
    preload: function() {
        this.load.spritesheet(IMAGES.PLAYER_1_AV, path + 'PlayerAvatars/player_1.png', sizeAvatar, sizeAvatar);
        this.load.spritesheet(IMAGES.PLAYER_2_AV, path + 'PlayerAvatars/player_2.png', sizeAvatar, sizeAvatar);
        this.load.spritesheet(IMAGES.PLAYER_3_AV, path + 'PlayerAvatars/player_3.png', sizeAvatar, sizeAvatar);
        this.load.spritesheet(IMAGES.PLAYER_4_AV, path + 'PlayerAvatars/player_4.png', sizeAvatar, sizeAvatar);

    },
    create: function() {
        var self = this;
        this.game.stage.backgroundColor = '#1abc9c';
        this.game.add.text(this.game.world.centerX,  60 , "Wybierz bohatera" ,{ font: "bold 30px Arial", fill: "ecf0f1", boundsAlignH: "center", boundsAlignV: "middle" }
        ).anchor.set(0.5);;


        this._upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this._downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this._leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this._rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this._acceptKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this._downKey.onDown.add(this.changeMenuPos, this);
        this._upKey.onDown.add(this.changeMenuPos, this);
        this._rightKey.onDown.add(this.changeMenuPos, this);
        this._leftKey.onDown.add(this.changeMenuPos, this);
        this._acceptKey.onDown.add(this.changeMenuPos, this);

        playerTab = [
            [1,3],
            [2,4]
        ];

        borderSprite = this.game.add.graphics( 166 , 96 );
        borderSprite.beginFill(0xFF3333, 1);
        borderSprite.bounds = new PIXI.Rectangle(0, 0, sizeAvatar + 8, sizeAvatar + 8 );
        borderSprite.drawRect(0, 0, sizeAvatar + 8, sizeAvatar + 8);

        for(var row = 0; row < playerTab.length; row++){
            for(var col = 0; col < playerTab[row].length; col++){
                var sprite = this.game.add.sprite(col*(sizeAvatar+20) + 170, row*(sizeAvatar+20) + 100, IMAGES['PLAYER_' + playerTab[row][col] + '_AV']);
                sprite.inputEnabled = true;
                sprite.input.useHandCursor = true;
                sprite.champSelectedY = col;
                sprite.champSelectedX = row;
                sprite.events.onInputDown.add(this.clickPlayer, this);
            }
        }
    },
    changeMenuPos: function(){
        if (this._upKey.isDown) {
            currentPosY = 0 <= currentPosY - 1 ? currentPosY - 1: playerTab.length - 1;
        } else if (this._downKey.isDown) {
            currentPosY = playerTab.length > currentPosY + 1 ? currentPosY + 1 : 0;
        } else if (this._leftKey.isDown) {
            currentPosX = 0 <= currentPosX - 1 ? currentPosX - 1: playerTab[currentPosY].length - 1;
        } else if (this._rightKey.isDown) {
            currentPosX = playerTab[currentPosY].length > currentPosX + 1 ? currentPosX + 1: 0;
        }
        else if (this._acceptKey.isDown) {
            this.loadGame();
        }
        this.setNewPosition();
    },

    setNewPosition : function(){
        borderSprite.x = currentPosX *(sizeAvatar+20) + 166;
        borderSprite.y = currentPosY *(sizeAvatar+20) + 96;
    },

    update: function() {

    },
    clickPlayer : function(spriteE){
        currentPosX = spriteE.champSelectedX;
        currentPosY = spriteE.champSelectedY;
        this.setNewPosition();
        this.loadGame();

    },
    loadGame : function(){
        this.game.stageSetup = {
            level : 1,
            score : 0
        };
        this.game.currentSelectHero = playerTab[currentPosY][currentPosX];
        this.game.state.start('Preloader');
    }
};