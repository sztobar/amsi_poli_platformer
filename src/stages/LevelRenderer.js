/* global _ */
/* global PIXI */
/* global Phaser */
var config = require('../config');
var Player = require('../player');
var TiledLevel = require('../TiledLevel');
var enemy = require('../EnemyFactory');
var pauseUtils = require('../Pause');
var Score = require('../hud/score');
var Life = require('../hud/life');

var IMAGES = config.images;
var TILES = config.tiles;

function LevelRender(game) {
	this._player = null;
	this._platformsGroup = null;
  this._obstaclesLayer = null;
}

LevelRender.prototype = {
  create: function() {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.tiledMap = new TiledLevel(this.game, 'level1');

    // window.player for debugging purpose
    window.player = this._player = new Player(this, this.tiledMap.levelStart.x, this.tiledMap.levelStart.y);
    window.enemy = this._enemy = enemy.create(this);


    this.pointsGroup = this.tiledMap.createPointsGroup();
    this.checkpointsGroup = this.tiledMap.createCheckpointsGroup();
    this._enemies = this.game.add.physicsGroup();

    this._enemies.add(enemy.getSprite());
    //  The score
    this._score = new Score(this);

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

    this.physics.arcade.overlap(this._player.sprite, this.tiledMap.propsLayer, this.onTrapCollide, isTrapTiles, this);

    this.physics.arcade.overlap(this._player.sprite, this.pointsGroup, this.collectStar, null, this);
    this.physics.arcade.overlap(this._player.sprite, this.checkpointsGroup, this.onCheckpointCollide, null, this);

    this.physics.arcade.overlap(this._player.sprite, this._enemies , this.onKillPlayer , null, this);

    this.physics.arcade.overlap(this._player.sprite, enemy.getSprite() , this.onKillPlayer , null, this);
    this.physics.arcade.overlap(this._player.projectilesGroup, enemy.getSprite() , this.onShotEnemy , null, this);

    this._player.update();
  },
  collectStar: function (playerSprite, star) {
    // Removes the star from the screen
    star.kill();
    // update score
    this._score.inc(10);
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
    if (this._player.immovable) { return; }
    var lifeCount = this._life.dec();
    if (lifeCount === 0) {
      // od dead reset life counter and subtract points
      this._life.setCount(3);
      this._score.dec(50);
    }
    this._player.die();
  },
  onKillPlayer : function (player, enemy) {
    if (this._player.immovable) { return; }
    var lifeCount = this._life.dec();
    if (lifeCount === 0) {
      // od dead reset life counter and subtract points
      this._life.setCount(3);
      this._score.dec(50);
    }
    this._player.die();
  },
  onShotEnemy : function( enemy, bullet){
      bullet.kill();
      enemy.die();

  },
  onCheckpointCollide: function(player, checkpoint) {
    this._player.setCheckpoint(checkpoint.position.x, checkpoint.position.y + checkpoint.height);
    checkpoint.kill();
  }, 
  toggleDebugMode: function() {
    this._debugMode = !this._debugMode;
    this.tiledMap.propsLayer.visible = this._debugMode;
  }
}

module.exports = LevelRender;


function isObstacleTiles(point, tile) {
  return tile.index === TILES.OBSTACLE ||
    tile.index === TILES.PLATFORM;
}

function isTrapTiles(point, tile) {
  return (
    tile.index === TILES.TRAP ||
    tile.index === TILES.SPIKE
  );
}
