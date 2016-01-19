/* global _ */
/* global PIXI */
/* global Phaser */
var config = require('../config');
var Player = require('../player');
var TiledLevel = require('../TiledLevel');
var enemy = require('../enemy');
var pauseUtils = require('../Pause');
var Score = require('../hud/score');
var Life = require('../hud/life');

var IMAGES = config.images;
var TILES = config.tiles;

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
    this._scoreText = new Score(this);

    //  Player life
    this._life = new Life(this);

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
    this.physics.arcade.collide(enemySprite, this.tiledMap.propsLayer, null, isObstacleTiles);
    enemy.updateMovement();

    this.physics.arcade.collide(this._player.sprite, this.tiledMap.propsLayer, null, isObstacleTiles);
    this.physics.arcade.collide(this._player.projectilesGroup, this.tiledMap.propsLayer, function(p) { p.kill(); }, isObstacleTiles);
    
    this.physics.arcade.collide(this._player.sprite, this.tiledMap.propsLayer, this.onCheckpointCollide, isCheckpointTile, this);

    this.physics.arcade.collide(this._player.sprite, this.tiledMap.propsLayer, this.onTrapCollide, isTrapTiles, this);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.arcade.overlap(this._player.sprite, this.pointsGroup, this.collectStar, null, this);

    this._player.update();
  },
  collectStar: function (playerSprite, star) {
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    this._score += 10;
    this._scoreText.update('' + this._score);
    // this._scoreText.text = 'score: ' + this._score;
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
  onTrapCollide: function() {
    var lifeCount = this._life.dec();
    if (lifeCount === 0) {
      this._life.setCount(3);
    }
    this._player.resetToCheckpoint();
  },
  // TODO: spikes should bounce player off not teleport him to checkpoint
  onSpikesCollide: function() {
    var lifeCount = this._life.dec();
    if (lifeCount === 0) {
      this._life.setCount(3);
    }
    this.player.bounce();
  },
  onCheckpointCollide: function(player, checkpoint) {
    this._player.setCheckpoint(checkpoint.worldX, checkpoint.worldY);
    // TODO: proper tile removal
    this.tiledMap.tilemap.removeTile(checkpoint.x, checkpoint.y, this.tiledMap.propsLayer);
  }, 
  toggleDebugMode: function() {
    this._debugMode = !this._debugMode;
    this.tiledMap.propsLayer.visible = this._debugMode;
  }
}

module.exports = Level1;


function isObstacleTiles(point, tile) {
  return tile.index === TILES.OBSTACLE ||
    tile.index === TILES.PLATFORM;
}

function isTrapTiles(point, tile) {
  return tile.index === TILES.TRAP ||
    tile.index === TILES.SPIKE;
}

function isCheckpointTile(point, tile) {
  return tile.index === TILES.CHECKPOINT;
}