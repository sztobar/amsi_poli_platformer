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
    this.tiledMap = new TiledLevel(this.game, this.game.stageSetup.level);

    // window.player for debugging purpose
    window.player = this._player = new Player(this, this.tiledMap.levelStart.x, this.tiledMap.levelStart.y);


    this.game.sound.play('background-music');
    this.pointsGroup = this.tiledMap.createPointsGroup();
    this.checkpointsGroup = this.tiledMap.createCheckpointsGroup();
    this._enemies = this.game.add.physicsGroup();
    this._enemiesArray = [];

    //Add enemy
    let enemyObj = enemy.create(this);
    this._enemies.add(enemyObj.getSprite());
    this._enemiesArray.push(enemyObj);


    //  The score
    this._score = new Score(this, this.game.stageSetup.score);

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
    this.physics.arcade.collide(this._enemies, this.tiledMap.propsLayer, null, isObstacleTiles);
    this._enemiesArray.forEach(function(item){
      item.updateMovement();
    }, this);

    this.physics.arcade.collide(this._player.sprite, this.tiledMap.propsLayer, null, isObstacleTiles);
    this.physics.arcade.collide(this._player.projectilesGroup, this.tiledMap.propsLayer, function(p) { p.kill(); }, isObstacleTiles);

    this.physics.arcade.overlap(this._player.sprite, this.tiledMap.propsLayer, this.onTrapCollide, isTrapTiles, this);

    this.physics.arcade.overlap(this._player.sprite, this.pointsGroup, this.collectStar, null, this);
    this.physics.arcade.overlap(this._player.sprite, this.checkpointsGroup, this.onCheckpointCollide, null, this);

    this.physics.arcade.overlap(this._player.sprite, this._enemies , this.onKillPlayer , null, this);

    //Enemy actions
    this.physics.arcade.overlap(this._player.sprite, this._enemies , this.onKillPlayer , null, this);
    this.physics.arcade.overlap(this._player.projectilesGroup,this._enemies , this.onShotEnemy , null, this);

    //End level
    this.physics.arcade.overlap(this._player.sprite, this.tiledMap.getEndPoint() , this.endLevel , null, this);

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
     this.game.stageSetup.score = this._score._counter;
	 this.state.start('EndScore', true, true, this.game.stageSetup);
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
  onShotEnemy : function( bullet, enemy){
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
};

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
