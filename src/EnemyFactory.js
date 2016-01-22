var IMAGES = require('./config').images;

var enemySprite;
var right = true;


exports.create = function(game, type) {
    // The enemySprite and its settings
    enemySprite = game.add.sprite(60, 60, IMAGES.ENEMY);

    //  We need to enable physics on the enemySprite
    game.physics.arcade.enable(enemySprite);

    //  enemySprite physics properties. Give the little guy a slight bounce.
    enemySprite.body.bounce.y = 0.1;
    enemySprite.body.gravity.y = 350;
    enemySprite.body.collideWorldBounds = true;

    //enemySprite.animations.add('death', [4, 9, 10, 11], 10);
    //deathAnimation.onComplete.add(this.afterDeath, this);

    enemySprite.anchor.x = 0.5;
    enemySprite.anchor.y = 0.5;
    //  Our two animations, walking left and right.
    enemySprite.animations.add('left', [0, 1, 2, 3], 10, true);
    enemySprite.animations.add('right', [5, 6, 7, 8], 10, true);
    enemySprite.die = function(){
        enemySprite.kill();
    };
};

exports.getSprite = function() {
    return enemySprite;
};

exports.updateMovement = function() {
	if (enemySprite.body.blocked.right)
	{
		right = false;
	}
	else if (enemySprite.body.blocked.left)
	{
		right = true;
	}
	
    if (right)
    {
        enemySprite.body.velocity.x = 100;
		enemySprite.animations.play('right');
    } 
    else 
    {
        enemySprite.body.velocity.x = -100;
		enemySprite.animations.play('left');
    } 
};