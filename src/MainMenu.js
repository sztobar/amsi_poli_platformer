module.exports = MainMenu;
function MainMenu(game){
};

MainMenu.prototype = {
    preload: function() {

        // set background color and preload image

        
    },

    create: function() {
        this.game.stage.backgroundColor = '#707070';
        this.game.add.text(0,50, 'This is n-back training. You are presented with a 3x3 grid. One by one, one of the squares\nwill light up either red or blue.\n', {font:'14px Arial', fill: '#fff'});
        this.game.add.text(0, 90, 'You have to remember n moves back. If the square on the current move is the same as\nn moves ago, press 1\n', {font: '14px Arial', fill: '#fff'});
        this.game.add.text(0,130, 'If the color is the same as n moves ago, press 2.\nIf both color and grid are the same, press 3', {font: '14px Arial', fill: '#fff'});
        this.game.add.text(0,170, 'The example below shows a position and color match for n = 2, so you would press 3.\n', {font: '14px Arial', fill: '#fff'});
        this.game.add.text(0,210, 'Click on one of the buttons to start the game with your desired N and colors. \n', {font: '14px Arial', fill: '#fff'});

        var frame1 = this.game.add.sprite(16, 256, 'red0');
        var frame2 = this.game.add.sprite(200,256, 'blue1');
        var frame3 = this.game.add.sprite(384, 256, 'red0');
        frame1.scale.setTo(0.25, 0.25);
        frame2.scale.setTo(0.25, 0.25);
        frame3.scale.setTo(0.25, 0.25);

        button_2back1 = this.game.add.button(16, 500, '2back_1color', this.set2Back1, this);
        button_2back2 = this.game.add.button(160, 500, '2back_2color', this.set2Back2, this);
        button_3back1 = this.game.add.button(16, 600, '3back_1color', this.set3Back1, this);
        button_3back2 = this.game.add.button(160, 600, '3back_2color', this.set3Back2, this);
        button_4back1 = this.game.add.button(16, 700, '4back_1color', this.set4Back1, this);
        button_4back2 = this.game.add.button(160,700, '4back_2color', this.set4Back2, this);
    },
    update: function() {
        if( nBack_frames > 0) {
            this.game.state.start('Game');
        }
    },
    set2Back1: function() {
        nBack_frames = 2;
        nBack_colors = 1;
    },
    set2Back2: function() {
        nBack_frames = 2;
        nBack_colors = 2;
    },
    set3Back1: function() {
        nBack_frames = 3;
        nBack_colors = 1;
    },
    set3Back2: function() {
        nBack_frames = 3;
        nBack_colors = 2;
    },
    set4Back1: function() {
        nBack_frames = 4;
        nBack_colors = 1;
    },
    set4Back2: function() {
        nBack_frames = 4;
        nBack_colors = 2;
    }

};