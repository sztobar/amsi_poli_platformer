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
var Speaker = require('../hud/speaker');

var IMAGES = config.images;
var TILES = config.tiles;
var SOUNDS = config.sounds;

class LevelRender {

  constructor(game) {
  	this._player = null;
  	this._platformsGroup = null;
    this._obstaclesLayer = null;
  }

  create() {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.tiledMap = new TiledLevel(this.game, this.game.stageSetup.level);
    window.player = this._player = new Player(this, this.tiledMap.levelStart.x, this.tiledMap.levelStart.y);

    this.game.sound.play('background-music', 0.1, true);
    this.pointsGroup = this.tiledMap.createPointsGroup();
    this.checkpointsGroup = this.tiledMap.createCheckpointsGroup();

    this.enemiesFlyGroup = this.tiledMap.createEnemiesFlyGroup();
    this.enemiesShootGroup = this.tiledMap.createEnemiesShootGroup();
    this.enemiesBoss1Group = this.tiledMap.createEnemiesBoss1Group();
    this.enemiesWalkerGroup = this.tiledMap.createEnemiesWalkerGroup();

    this._enemies = this.game.add.physicsGroup();
    this._enemiesArray = [];

	  for (let enemyIndex in this.enemiesFlyGroup.children){
      let enemyObj = enemy.create(this, [ this.enemiesFlyGroup.children[enemyIndex].x, this.enemiesFlyGroup.children[enemyIndex].y-32 ], 'walk', this.game.stageSetup.level );
      this._enemies.add(enemyObj.getSprite());
      this._enemiesArray.push(enemyObj);
    }

    for (let enemyIndex in this.enemiesShootGroup.children){
      let enemyObj = enemy.create(this, [ this.enemiesShootGroup.children[enemyIndex].x, this.enemiesShootGroup.children[enemyIndex].y-32 ], 'shoot', this.game.stageSetup.level );
      this._enemies.add(enemyObj.getSprite());
      this._enemiesArray.push(enemyObj);
    }

	  for (let enemyIndex in this.enemiesBoss1Group.children){
      let enemyObj = enemy.create(this, [ this.enemiesBoss1Group.children[enemyIndex].x, this.enemiesBoss1Group.children[enemyIndex].y-32 ], 'boss1', this.game.stageSetup.level );
      this._enemies.add(enemyObj.getSprite());
      this._enemiesArray.push(enemyObj);
    }

    for (let enemyIndex in this.enemiesWalkerGroup.children){
      let enemyObj = enemy.create(this, [ this.enemiesWalkerGroup.children[enemyIndex].x, this.enemiesWalkerGroup.children[enemyIndex].y-32 ], 'fly', this.game.stageSetup.level );
      this._enemies.add(enemyObj.getSprite());
      this._enemiesArray.push(enemyObj);
    }

    this.blockGroup = this.tiledMap.createBlockGroup();
    for (let enemyBlock in this.blockGroup.children){
      this.blockGroup.children[enemyBlock].y = this.blockGroup.children[enemyBlock].y - 32;
      this.game.physics.arcade.enable(this.blockGroup.children[enemyBlock]);
      this.blockGroup.children[enemyBlock].body.collideWorldBounds = true;
      this.blockGroup.children[enemyBlock].body.bounce.y = 0;
      this.blockGroup.children[enemyBlock].body.gravity.y = 0;
      this.blockGroup.children[enemyBlock].body.immovable = true;
      this.blockGroup.children[enemyBlock].body.moves = false;
      this.blockGroup.children[enemyBlock].alpha = 0;
    }
    //  The score
    this._score = new Score(this, this.game.stageSetup.score);

    //  Player life
    this._life = new Life(this);
    this.speaker = new Speaker(this);
    this._debugMode = false;
    //Pause handling
    var pauseKey = this.input.keyboard.addKey(Phaser.KeyCode.P);
    pauseKey.onUp.add(function(){
      pauseUtils.pause(this.game);
    }, this);

    var spaceKey = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    spaceKey.onUp.add(this.toggleDebugMode, this);

    this.successSound = this.add.audio(SOUNDS.SUCCESS, 0.1);
    this.enemyDamageSound = this.add.audio(SOUNDS.ENEMY_DAMAGE, 0.1);
  }

  update() {
    this.physics.arcade.collide(this._enemies, this.tiledMap.propsLayer, null, isObstacleTiles);

    this._enemiesArray.forEach(function(item){
      item.updateMovement(this._player.sprite, this.physics, this.onKillPlayer.bind(this));
      item.projectilesGroup && this.physics.arcade.collide(item.projectilesGroup, this.tiledMap.propsLayer, function(p) { p.kill(); }, isObstacleTiles);
    }, this);

    this.physics.arcade.collide(this._enemies, this.blockGroup, this.directionEnemyChange, function(){ return true });

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
  }

  collectStar(playerSprite, star) {
    // Removes the star from the screen
    star.kill();
    // update score
    this._score.inc(10);
    this._player.starSound.play();
  }

  render() {
    if (this._debugMode) {
      this.game.debug.body(this._player.sprite);
      this.game.debug.text('Active Projectiles: ' + this._player.projectilesGroup.total, 32, 432);
      this.game.debug.text('DEBUG MODE', 32, 464);
    }
  }

  endLevel() {
    this.game.stageSetup.score = this._score._counter;
    this.successSound.play();
	  this.state.start('EndScore', true, true, this.game.stageSetup);
  }

  onTrapCollide() {
    if (this._player.immovable || this._player.invincible) { return; }
    var lifeCount = this._life.dec();
    if (lifeCount === 0) {
      // od dead reset life counter and subtract points
      this._life.setCount(3);
      this._score.dec(50);
    }
    this._player.die();
  }

  onKillPlayer(player, enemy) {
    if (_.get(enemy, 'animations.currentAnim.name') === 'death' || this._player.immovable || this._player.invincible) { return; }
    var lifeCount = this._life.dec();
    if (lifeCount === 0) {
      // od dead reset life counter and subtract points
      this._life.setCount(3);
      this._score.dec(50);
    }
    this._player.die();

    if (enemy.key === 'projectile') {
      enemy.kill();
    }
  }

  onShotEnemy(bullet, enemy){
    if (_.get(enemy, 'animations.currentAnim.name') === 'death') { return; }
    bullet.kill();
    enemy.die();
    this._score.inc(5);
    this.enemyDamageSound.play();
  }

  onCheckpointCollide(player, checkpoint) {
    this._player.setCheckpoint(checkpoint.position.x, checkpoint.position.y + checkpoint.height);
    checkpoint.kill();
  }

  toggleDebugMode() {
	  this.endLevel();
    //this._debugMode = !this._debugMode;
    //this.tiledMap.propsLayer.visible = this._debugMode;
  }

  directionEnemyChange(enemySprite, tile){
    if(enemySprite.colided){
      enemySprite.direction = !enemySprite.direction;
    }
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
