(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global Phaser */
var path = '../assets/images/';

function Boot (game){};

Boot.prototype = {
	preload: function(){
		// preload the loading indicator first before anything else
		this.load.image('preloaderBar', path + 'loading-bar.png');
	},
	create: function(){
		// set scale options
		// this.input.maxPointers = 1;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		// start the Preloader state
		this.state.start('Preloader');
	}
};

module.exports = Boot;
},{}],2:[function(require,module,exports){
exports.LEFT = 0;
exports.RIGHT = 1;
},{}],3:[function(require,module,exports){
exports.PLAYER = 'player';
exports.ENEMY = 'swinia';
exports.SKY = 'sky';
exports.GROUND = 'ground';
exports.STAR = 'star'
exports.PROJECTILE = 'projectile'
 

},{}],4:[function(require,module,exports){
/* global _ */
/* global PIXI */
/* global Phaser */
var IMAGES = require('./images');
var Player = require('./Player');
var TiledLevel = require('./TiledLevel');
var enemy = require('./enemy');

function Level1(game) {
	this._player = null;
	this._platformsGroup = null;
  this._obstaclesLayer = null;
}

Level1.prototype = {
  create: function() {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.tiledMap = new TiledLevel(this.game, 'level1');
    
    // window.player for debugging purpose
    window.player = this._player = new Player(this, this.tiledMap.levelStart.x, this.tiledMap.levelStart.y);
    this._enemy = enemy.create(this);
    
    //  Finally some stars to collect
    this._starsGroup = this.add.group();
    //  We will enable physics for any star that is created in this group
    this._starsGroup.enableBody = true;
    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = this._starsGroup.create(i * 70, 0, IMAGES.STAR);
        //  Let gravity do its thing
        star.body.gravity.y = 300;
    }
    //  The score
    this._score = 0;
    this._scoreText = this.add.text(16, 16, 'score: ' + this._score, { fontSize: '32px', fill: '#000' });
    this._scoreText.fixedToCamera = true;
  
    this._debugMode = false;
    var spaceKey = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    spaceKey.onUp.add(this.toggleDebugMode, this);
  },
  update: function() {
    var enemySprite = enemy.getSprite();
    this.physics.arcade.collide(enemySprite, this.tiledMap.propsLayer);
    enemy.updateMovement();
    
    //  Collide the player and the stars with the platforms
    this.physics.arcade.collide(this._starsGroup, this.tiledMap.propsLayer);
    this.physics.arcade.collide(this._player.sprite, this.tiledMap.propsLayer);
    this.physics.arcade.collide(this._player.projectilesGroup, this.tiledMap.propsLayer, function(p) { p.kill(); });
    this.physics.arcade.collide(this._player.sprite, this.tiledMap.levelEnd, this.endLevel, null, this);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.arcade.overlap(this._player.sprite, this._starsGroup, this.collectStar, null, this);

    this._player.update();
  },
  collectStar: function (playerSprite, star) {
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    this._score += 10;
    this._scoreText.text = 'score: ' + this._score;
  },
  render: function() {
    if (this._debugMode) {
      this.game.debug.body(this._player.sprite);
      this.game.debug.text('Active Projectiles: ' + this._player.projectilesGroup.total, 32, 432); 
      this.game.debug.text('DEBUG MODE', 32, 464); 
    }
  },
  endLevel: function() {
    console.log('level 1 end');
    // TODO add level 2
		// this.state.start('Level2');
  },
  toggleDebugMode: function() {
    this._debugMode = !this._debugMode;
    this.tiledMap.propsLayer.visible = this._debugMode; 
  }
}

module.exports = Level1;
},{"./Player":5,"./TiledLevel":7,"./enemy":8,"./images":9}],5:[function(require,module,exports){
/* global Phaser */
/* global PIXI */
var IMAGES = require('./IMAGES');
var DIRECTIONS = require('./DIRECTIONS');

var FIRE_RATE = 250;

var VELOCITY = 250;
var JUMP_SPEED = 300;
var PROJECTILE_VELOCITY = VELOCITY * 2;

function Player(game, x, y) {
  this._game = game;
  
  // The playerSprite and its settings
  this.sprite = game.add.sprite(x, y, IMAGES.PLAYER);
  
  //  We need to enable physics on the playerSprite
  game.physics.arcade.enable(this.sprite);
  this.sprite.position.y -= this.sprite.height;
  this.sprite.body.setSize(32, 32, 0, this.sprite.height - 32);
  game.camera.follow(this.sprite);
  
  //  playerSprite physics properties. Give the little guy a slight bounce.
  this.sprite.body.bounce.y = 0;
  this.sprite.body.gravity.y = 600;
  this.sprite.body.collideWorldBounds = true;

  this.direction = DIRECTIONS.LEFT;
  //  Our two animations, walking left and right.
  this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
  this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
  this.sprite.animations.add('death', [4, 9, 10, 11], 10, true);
  this.sprite.animations.add('shootleft', [12], 10, true);
  this.sprite.animations.add('shootright', [13], 10, true);
  
  this._jumpKey = game.input.keyboard.addKey(Phaser.KeyCode.X);
  this._jumpKey.onDown.add(this.handleJumpKeyDown, this);
  this._jumpKey.onUp.add(this.handleJumpKeyUp, this);
  
  this._shootKey = game.input.keyboard.addKey(Phaser.KeyCode.Z);
  this._shootKey.onDown.add(this.handleShootKeyDown, this);
  this._shootKey.onUp.add(this.handleShootKeyUp, this);
  
  this._leftKey = game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
  this._rightKey = game.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
  //  Stop the following keys from propagating up to the browser
  game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT ]);

  this.projectilesGroup = game.add.group();
  this.projectilesGroup.enableBody = true;
  this.projectilesGroup.physicsBodyType = Phaser.Physics.ARCADE;
  this.projectilesGroup.createMultiple(5, IMAGES.PROJECTILE);
  this.projectilesGroup.setAll('anchor.x', 0.5);
  this.projectilesGroup.setAll('anchor.y', 0.5);
  this._nextFire = 0;
}

Player.prototype = {
  update: function() {
  
    //  Reset the players velocity (movement)
    this.sprite.body.velocity.x = 0;

    if (this._leftKey.isDown) {
      //  Move to the left
      this.sprite.body.velocity.x = -VELOCITY;
      this.sprite.animations.play('left');
      this.direction = DIRECTIONS.LEFT;
    } else if (this._rightKey.isDown) {
      //  Move to the right
      this.sprite.body.velocity.x = VELOCITY;
      this.sprite.animations.play('right');
      this.direction = DIRECTIONS.RIGHT;
    } else {
      //  Stand still
      this.sprite.animations.stop();
      this.sprite.frame = 4;
    }
    
    
    if (this.sprite.body.onFloor()) {
      this._jumps = 2;
    }
    
    if (this._jumps > 0 && this._makeJump) {
      this.sprite.body.velocity.y = -JUMP_SPEED;
      this._makeJump = false;
      this._jumps--;
    }
    
    if (this._makeShoot && this._game.time.now > this._nextFire && this.projectilesGroup.countDead() > 0) {
      this._nextFire = this._game.time.now + FIRE_RATE;

      var projectile = this.projectilesGroup.getFirstDead();

      projectile.reset(this.sprite.position.x + this.sprite.width/2, this.sprite.position.y + this.sprite.height/2);
      if (this.direction === DIRECTIONS.RIGHT) {
        projectile.body.velocity.x = PROJECTILE_VELOCITY;
      } else {
        projectile.body.velocity.x = -PROJECTILE_VELOCITY;        
      }
    //  Allow the player to jump if they are touching the ground.
    }
    
    var cameraView = this._game.world.camera.view;
    this.projectilesGroup.children.forEach(function(projectile) {
      if (projectile.alive && !cameraView.intersects(projectile)) {
        projectile.kill();
      }
      projectile.rotation += 0.25;
    });
  },
  handleJumpKeyDown() {
    this._makeJump = true;
  },
  handleJumpKeyUp() {
    this._makeJump = false;
  },
  handleShootKeyDown() {
    this._makeShoot = true;
  },
  handleShootKeyUp() {
    this._makeShoot = false;
  }
};

module.exports = Player;

},{"./DIRECTIONS":2,"./IMAGES":3}],6:[function(require,module,exports){
/* global Phaser */
var IMAGES = require('./IMAGES');
var path = '../assets/images/';

var GAME_WIDTH = exports.GAME_WIDTH = 640;
var GAME_HEIGHT = exports.GAME_HEIGHT = 960;

module.exports = Preloader; 

function Preloader(game){
};

Preloader.prototype = {
	preload: function() {
    
		// set background color and preload image
		this.stage.backgroundColor = '#B4D9E7';
		this.preloadBar = this.add.sprite((GAME_WIDTH-311)/2, (GAME_HEIGHT-27)/2, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);
    

    this.load.image(IMAGES.SKY, path + 'sky.png');
    this.load.image(IMAGES.GROUND, path + 'platform.png');
    this.load.spritesheet(IMAGES.PLAYER, path + 'pawlak.png', 32, 48);
    this.load.image(IMAGES.PROJECTILE, path + 'projectile.png');
    this.load.image(IMAGES.STAR, path + 'glos.png');
    this.load.spritesheet(IMAGES.ENEMY, path + 'farmer.png', 60, 48);
    this.load.image(IMAGES.FIREBALL, path + 'fireball.png');

      
    this.load.tilemap('level1', '../assets/mapa-wies/mapa-wies.json', null, Phaser.Tilemap.TILED_JSON);

    //  Next we load the tileset. This is just an image, loaded in via the normal way we load images:
    this.load.image('tiles', '../assets/mapa-wies/tileset.png');
    this.load.image('tiles-props', '../assets/images/tiles-props.png');
    this.load.image('background', '../assets/mapa-wies/wies-tlo.png');
    
	},
	create: function(){
		// start the MainMenu state
		this.state.start('Level1');
	}
};
},{"./IMAGES":3}],7:[function(require,module,exports){
/* global Phaser */
/* global _ */
/* global PIXI */

var OBSTACLE_TILE = 17;
var PLATFORM_TILE = 18;

function TiledLevel(game, name) {
  this.game = game;
  this.tilemap = this.game.add.tilemap(name);
  
  this.tilemap.addTilesetImage('tileset', 'tiles');
  this.tilemap.addTilesetImage('tiles-props', 'tiles-props');
  
  this.backgroundSprite = this.game.add.sprite(0, -100, 'background');
  this.backgroundSprite.fixedToCamera = true;
  this.backgroundSprite.scale = new PIXI.Point(0.5, 0.5);
  
  this.obstaclesLayer = this.tilemap.createLayer('tileset');
  this.obstaclesLayer.resizeWorld();
  
  this.propsLayer = this.tilemap.createLayer('tileset properties');
  // comment below to see tiles properties
  this.propsLayer.visible = false;
  
  this.tilemap.setLayer(this.propsLayer);
  
  this.levelStart = _.find(this.tilemap.objects.objects, function(obj) { return obj.name === 'start' });
  var endObject = _.find(this.tilemap.objects.objects, function(obj) { return obj.name === 'end' });
  this.levelEnd = game.add.sprite(endObject.x, endObject.y);
  game.physics.arcade.enable(this.levelEnd);
  this.levelEnd.anchor.y = 1;
  this.levelEnd.enableBody = true;
  this.levelEnd.body.immovable = true;
  
  var layer = this.propsLayer.layer;
  for (var y = 0; y < layer.height; y++) {
    for (var x = 0; x < layer.width; x++) {
      var tile = layer.data[y][x];

      if (tile && tile.index === PLATFORM_TILE) {
        tile.setCollision(false, false, true, false);
      }
    }
  }
  
  this.tilemap.setCollisionByIndex(OBSTACLE_TILE);
}

module.exports = TiledLevel;
},{}],8:[function(require,module,exports){
var IMAGES = require('./IMAGES');



var enemySprite;
var right = true;

exports.create = function(game) {
    // The enemySprite and its settings
    enemySprite = game.add.sprite(60, 60, IMAGES.ENEMY);

    //  We need to enable physics on the enemySprite
    game.physics.arcade.enable(enemySprite);

    //game.camera.follow(enemySprite);

    //  enemySprite physics properties. Give the little guy a slight bounce.
    enemySprite.body.bounce.y = 0.1;
    enemySprite.body.gravity.y = 350;
    enemySprite.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    enemySprite.animations.add('left', [0, 1, 2, 3], 10, true);
    enemySprite.animations.add('right', [4, 5, 6, 7], 10, true);

};

exports.getSprite = function() {
    return enemySprite;
}

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
}
},{"./IMAGES":3}],9:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],10:[function(require,module,exports){
/* global Phaser */
var Boot = require('./Boot');
var Preloader = require('./Preloader');
var Level1 = require('./Level1');

var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');
game.state.add('Boot', Boot);
game.state.add('Preloader', Preloader);
game.state.add('Level1', Level1);
game.state.start('Boot');

},{"./Boot":1,"./Level1":4,"./Preloader":6}]},{},[10]);
