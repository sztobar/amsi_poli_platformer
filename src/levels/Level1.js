/* global _ */
/* global PIXI */
/* global Phaser */
var IMAGES = require('./../config').images;
var Player = require('./../player');
var TiledLevel = require('./../TiledLevel');
var enemy = require('./../enemy');
var pauseUtils = require('./../Pause');

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
    
    this.pointsGroup = this.tiledMap.createPointsGroup();
    //  The score
    this._score = 0;
    this._scoreText = this.add.text(16, 16, 'score: ' + this._score, { fontSize: '32px', fill: '#000' });
    this._scoreText.fixedToCamera = true;

    this._debugMode = false;

    //Pause handling
    var pauseKey = this.input.keyboard.addKey(Phaser.KeyCode.P);
    pauseKey.onUp.add(function(){
      pauseUtils.pause(this.game);
    }, this);


    var spaceKey = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    spaceKey.onUp.add(this.toggleDebugMode, this);
  },
  update: function() {
    var enemySprite = enemy.getSprite();
    this.physics.arcade.collide(enemySprite, this.tiledMap.propsLayer);
    enemy.updateMovement();
    
    //  Collide the player and the stars with the platforms
    this.physics.arcade.collide(this._player.sprite, this.tiledMap.propsLayer);
    this.physics.arcade.collide(this._player.projectilesGroup, this.tiledMap.propsLayer, function(p) { p.kill(); });
    this.physics.arcade.collide(this._player.sprite, this.tiledMap.levelEnd, this.endLevel, null, this);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.arcade.overlap(this._player.sprite, this.pointsGroup, this.collectStar, null, this);

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