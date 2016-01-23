var IMAGES = require('./config').images;
import Cloud from './enemies/Cloud';
import Shooter from './enemies/Shooter';
import Walker from './enemies/Walker';

exports.create = function(game, position, type, map ) {
    var enemy;
    // The enemySprite and its settings
    switch (type){
        case 'shoot':
            enemy = new Shooter(game, position);
            defaultConfiguration(game, enemy.getSprite());
            break;
        case 'walk':
            enemy = new Walker(game, position);
            defaultConfiguration(game, enemy.getSprite());

            break;
        case 'fly':
            enemy = new Cloud(game, position, IMAGES.SMOG);
            break;
        default:
            enemy = new Cloud(game, position, IMAGES.BOR);
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

    enemySprite.anchor.x = 0.5;
    enemySprite.anchor.y = 0.5;
};
