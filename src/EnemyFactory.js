var IMAGES = require('./config').images;
var LevelSetups = require('./LevelSetups');

import Cloud from './enemies/Cloud';
import Shooter from './enemies/Shooter';
import Walker from './enemies/Walker';
exports.create = function(game, position, type, map ) {

    var enemy;
    // The enemySprite and its settings
    switch (type){
        case 'shoot':
            enemy = new Shooter(game, position, LevelSetups.enemies[map-1].shoot, IMAGES.PROJECTILE );
            defaultConfiguration(game, enemy.getSprite());
            break;
        case 'walk':
            enemy = new Walker(game, position, LevelSetups.enemies[map-1].walker);
            defaultConfiguration(game, enemy.getSprite());

            break;
        case 'fly':
            enemy = new Cloud(game, position, LevelSetups.enemies[map-1].fly);
            break;
        default:
            enemy = new Shooter(game, position, LevelSetups.enemies[map-1].shoot, IMAGES.PROJECTILE);
            defaultConfiguration(game, enemy.getSprite());
            break;
    }

    return enemy;
};

var defaultConfiguration = (game, enemySprite) =>{
    game.physics.arcade.enable(enemySprite);
    //  enemySprite physics properties. Give the little guy a slight bounce.
    enemySprite.body.bounce.y = 0.1;
    enemySprite.body.gravity.y = 350;
    enemySprite.body.collideWorldBounds = true;
    enemySprite.colided = true;
    enemySprite.anchor.x = 0.5;
    enemySprite.anchor.y = 0.5;
};
