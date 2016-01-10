module.exports = MainMenu;
function MainMenu(game){
};
var nBack_frames =  0;
var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
var currentlySelected = -1;
var menuTexts = [];
MainMenu.prototype = {
    preload: function() {

    },

    create: function() {

        this._upKey = game.input.keyboard.addKey(Phaser.KeyCode.UP);
        this._downKey = game.input.keyboard.addKey(Phaser.KeyCode.DOWN);

        //Defined Menu
        var menu = [
            ['Start', 250, this.openPlayerSelection],
            ['Tablica wyników', 290, this.openScoreBoard],
            ['Twórcy', 330, null],
            ['Wyjście', 370, null]
        ];

        this.game.stage.backgroundColor = '#707070';
        for(var menuPos in menu){
            if(menu.hasOwnProperty(menuPos)){
                var mn = menu[menuPos],
                    textbox = this.game.add.text(this.game.world.centerX,mn[1], mn[0],  style);
                textbox.inputEnabled = true;
                textbox.events.onInputDown.add(mn[2], this);

                textbox.anchor.set(0.5);
                menuTexts.push(textbox);
                currentlySelected = -1;
            }
        }
    },
    update: function() {
        if( nBack_frames > 0) {
            this.game.state.start('Game');
        }
    },
    openPlayerSelection : function(){

    },
    openScoreBoard : function(){

    }
};