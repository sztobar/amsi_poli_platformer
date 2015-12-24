(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.PLAYER = 'dude';
exports.SKY = 'sky';
exports.GROUND = 'ground';
exports.STAR = 'star'
exports.FIREBALL = 'fireball'
 
},{}],2:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],3:[function(require,module,exports){
var preload = require('./preload');
var IMAGES = require('./images');
var player = require('./player');

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

var obstaclesLayer;

function create() {
    
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // load tiled map
    var map = game.add.tilemap('level');
    map.addTilesetImage('tileset', 'tiles');
    game.add.sprite(0, 0, 'background');
    obstaclesLayer = map.createLayer('tileset');
    obstaclesLayer.resizeWorld();
    map.setCollisionBetween(0, 10);
    game.physics.enable(obstaclesLayer, Phaser.Physics.ARCADE);
    obstaclesLayer.body.immovable = true;
    
    
    
    //  A simple background for our game
    // game.add.sprite(0, 0, IMAGES.SKY);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, IMAGES.GROUND);

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, IMAGES.GROUND);
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, IMAGES.GROUND);
    ledge.body.immovable = true;
    
    player.create(game);
    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, IMAGES.STAR);

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    
}

function update() {
    
    var playerSprite = player.getSprite();

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(playerSprite, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(stars, obstaclesLayer);
    game.physics.arcade.collide(playerSprite, obstaclesLayer);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(playerSprite, stars, collectStar, null, this);

    player.updateMovement();
}

function collectStar (playerSprite, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}

function render() {
  
    game.debug.bodyInfo(player.getSprite(), 32, 500);
  
}
},{"./images":2,"./player":4,"./preload":5}],4:[function(require,module,exports){
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
    if (cursors.up.isDown && playerSprite.body.touching.down)
    {
        playerSprite.body.velocity.y = -350;
    }

}
},{"./IMAGES":1,"./preload":5}],5:[function(require,module,exports){
var IMAGES = require('./IMAGES');
var path = '../assets/images/';

function preload(game) {

    game.load.image(IMAGES.SKY, path + 'sky.png');
    game.load.image(IMAGES.GROUND, path + 'platform.png');
    game.load.image(IMAGES.STAR, path + 'star.png');
    game.load.spritesheet(IMAGES.PLAYER, path + 'braun.png', 32, 48);
    game.load.image(IMAGES.FIREBALL, path + 'fireball.png');

      
    game.load.tilemap('level', '../assets/mapa-wies/mapa-wies2.json', null, Phaser.Tilemap.TILED_JSON);

    //  Next we load the tileset. This is just an image, loaded in via the normal way we load images:

    game.load.image('tiles', '../assets/mapa-wies/tileset.png');
    game.load.image('background', '../assets/mapa-wies/wies-tlo.png');

} 

module.exports = preload;

},{"./IMAGES":1}]},{},[3]);
