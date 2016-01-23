var IMAGES = require('./config').images;
import Farmer from './enemies/Farmer';
import Pig from './enemies/Pig';

exports.create = function(game, position, type ) {
    var enemy;
    // The enemySprite and its settings
    switch (type){
        case 'farmer':
            enemy = new Farmer(game, position);
            break;
        case 'pig':
            enemy = new Pig(game, position);
            break;
        default:
            enemy = new Farmer(game, position);
            break;
    }
    defaultConfiguration(game, enemy.getSprite());

    return enemy;
};

var defaultConfiguration = (game, enemySprite) =>{
    game.physics.arcade.enable(enemySprite);
    //  enemySprite physics properties. Give the little guy a slight bounce.
    enemySprite.body.bounce.y = 0.1;
    enemySprite.body.gravity.y = 350;
    enemySprite.body.collideWorldBounds = true;

    enemySprite.anchor.x = 0.5;
    enemySprite.anchor.y = 0.5;
};
