/* global Phaser */
var Boot = require('./stages/Boot'),
    Preloader = require('./stages/Preloader'),
    MainMenu = require('./stages/MainMenu'),
    PlayerSelection = require('./stages/PlayerSelection'),
    Level1 = require('./levels/Level1');

var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');
game.state.add('Boot', Boot);
game.state.add('Preloader', Preloader);
game.state.add('MainMenu', MainMenu);
game.state.add('PlayerSelection', PlayerSelection);
game.state.add('Level1', Level1);
game.state.start('Boot');
