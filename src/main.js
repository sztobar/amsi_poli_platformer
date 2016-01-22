/* global Phaser */
var Boot = require('./stages/Boot'),
    Preloader = require('./stages/Preloader'),
    MainMenu = require('./stages/MainMenu'),
    PlayerSelection = require('./stages/PlayerSelection'),
    LevelRenderer = require('./stages/LevelRenderer'),
    Scoreboard = require('./stages/Scoreboard'),
    EndScore = require('./stages/EndScore');

var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game');
game.state.add('Boot', Boot);
game.state.add('Preloader', Preloader);
game.state.add('MainMenu', MainMenu);
game.state.add('EndScore', EndScore);
game.state.add('Scoreboard', Scoreboard);
game.state.add('PlayerSelection', PlayerSelection);
game.state.add('LevelRenderer', LevelRenderer);
game.state.start('Boot');
