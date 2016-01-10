
module.exports = {


    unpause: function(game){
        // Only act if paused
        if(game.paused){
            game.paused = false;
        }
    },

    pause : function(game){
        if(!game.paused) {
            game.paused = true;
            var menu = game.add.graphics(0, 0);
            menu.inputEnabled = true;
            menu.beginFill(0x000000, 1);
            menu.bounds = new PIXI.Rectangle(0, 0, 300, 200);
            menu.drawRect(0, 0, 300, 200);
            return menu;
        } else {
            this.unpause(game);
        }

    }

};