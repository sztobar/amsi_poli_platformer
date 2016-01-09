/* global Phaser */
var Boot = require('./Boot');
var Preloader = require('./Preloader');
var MainMenu = require('./MainMenu');
var Level1 = require('./Level1');

var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');
game.state.add('Boot', Boot);
game.state.add('Preloader', Preloader);
game.state.add('MainMenu', MainMenu);
game.state.add('Level1', Level1);
game.state.start('Boot');
