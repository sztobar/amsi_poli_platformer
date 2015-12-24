var preload = require('./preload');
var IMAGES = require('./IMAGES');



var playerSprite;
var cursors;

exports.create = function(game) {
    // The playerSprite and its settings
    playerSprite = game.add.sprite(32, 32, IMAGES.PLAYER);

    //  We need to enable physics on the playerSprite
    game.physics.arcade.enable(playerSprite);

    game.camera.follow(playerSprite);

    //  playerSprite physics properties. Give the little guy a slight bounce.
    playerSprite.body.bounce.y = 0.2;
    playerSprite.body.gravity.y = 300;
    playerSprite.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    playerSprite.animations.add('left', [0, 1, 2, 3], 10, true);
    playerSprite.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();
};

exports.getSprite = function() {
    return playerSprite;
}

exports.updateMovement = function() {
    
    //  Reset the players velocity (movement)
    playerSprite.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        playerSprite.body.velocity.x = -150;

        playerSprite.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        playerSprite.body.velocity.x = 150;

        playerSprite.animations.play('right');
    }
    else
    {
        //  Stand still
        playerSprite.animations.stop();

        playerSprite.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && playerSprite.body.blocked.down)
    {
        playerSprite.body.velocity.y = -350;
    }

}