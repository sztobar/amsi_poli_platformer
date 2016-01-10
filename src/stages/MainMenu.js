module.exports = MainMenu;
function MainMenu(game){
};
var nBack_frames =  0;
var style = { font: "bold 32px Arial", fill: "#ecf0f1", boundsAlignH: "center", boundsAlignV: "middle" };
var selectedStyle = { font: "bold 32px Arial", fill: "#ff3333", boundsAlignH: "center", boundsAlignV: "middle" };
var currentlySelected = -1;
var menuTexts = [];
MainMenu.prototype = {
    preload: function() {

    },

    create: function() {

        this._upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this._downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this._acceptKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this._downKey.onDown.add(this.changeMenuPos, this);
        this._upKey.onDown.add(this.changeMenuPos, this);
        this._acceptKey.onDown.add(this.changeMenuPos, this);

        //Defined Menu
        var menu = [
            ['Start', 250, this.openPlayerSelection],
            ['Tablica wyników', 290, this.openScoreBoard],
            ['Twórcy', 330, this.openCredits],
            ['Wyjście', 370, function(){}]
        ];

        this.game.add.text(this.game.world.centerX,  100 , "PoliticAmsi" ,{ font: "bold 80px Arial", fill: "#2c3e50", boundsAlignH: "center", boundsAlignV: "middle" }
        ).anchor.set(0.5);;

        this.game.stage.backgroundColor = '#1abc9c';
        for(var menuPos in menu){
            if(menu.hasOwnProperty(menuPos)){
                var mn = menu[menuPos],
                    textbox = this.game.add.text(this.game.world.centerX,mn[1], mn[0],  style);
                textbox.inputEnabled = true;
                textbox.events.onInputDown.add(mn[2], this);
                textbox.input.useHandCursor = true;
                textbox.anchor.set(0.5);
                menuTexts.push(textbox);
                currentlySelected = -1;
            }
        }

        menuTexts[0].setStyle(selectedStyle);
        currentlySelected = 0;

    },

    changeMenuPos: function(){
        if (this._upKey.isDown) {
            menuTexts[currentlySelected].setStyle(style);
            currentlySelected = currentlySelected == 0 ? menuTexts.length - 1  : currentlySelected - 1  ;
            menuTexts[currentlySelected].setStyle(selectedStyle);

        } else if (this._downKey.isDown) {
            menuTexts[currentlySelected].setStyle(style);
            currentlySelected = currentlySelected +1 >= menuTexts.length ? 0 : currentlySelected + 1  ;
            menuTexts[currentlySelected].setStyle(selectedStyle);
        } else if (this._acceptKey.isDown) {
            menuTexts[currentlySelected].events.onInputDown.dispatch();
        }
    },

    openPlayerSelection : function(){
        this.game.state.start('PlayerSelection');
    },
    openScoreBoard : function(){

    },
    openCredits : function(){

    }
};