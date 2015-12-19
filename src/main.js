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