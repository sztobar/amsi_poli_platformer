/* global Phaser */
/* global _ */
/* global PIXI */
var config = require('./config');
var _ = require('lodash');

var TILES = config.tiles;
var IMAGES = config.images;

function TiledLevel(game, id ) {
  this.game = game;
  this.tilemap = this.game.add.tilemap('level' + id);

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
  this.enemies = [];
  var layer = this.propsLayer.layer;
  for (var y = 0; y < layer.height; y++) {
    for (var x = 0; x < layer.width; x++) {
      var tile = layer.data[y][x];
      if(tile.index > 23){
        console.log(tile);
      }
      if (tile.index === TILES.PLATFORM) {
        tile.setCollision(false, false, true, false);
      }
      else if (tile.index === TILES.ENEMYFLY || tile.index === TILES.ENEMYSHOOT || tile.index === TILES.ENEMYWALKER) {

         this.enemies.push({ x: tile.x , y : tile.y});
      }
      else if (tile.index === TILES.SPIKE ||
          tile.index === TILES.TRAP ||
          tile.index === TILES.OBSTACLE) {
        tile.setCollision(true, true, true, true);
      }
    }
  }
}

TiledLevel.prototype = {
  createPointsGroup: function() {
    var group  = this.game.add.group();
    group.enableBody = true;
    this.tilemap.createFromObjects('objects', TILES.POINT, IMAGES.STAR, -1, true, false, group, Phaser.Sprite, true);
    return group;
  },
  createCheckpointsGroup: function() {
    var group  = this.game.add.group();
    group.enableBody = true;
    this.tilemap.createFromObjects('objects', TILES.CHECKPOINT, IMAGES.TILES_PROPS, 6, true, false, group, Phaser.Sprite, true);
    return group;
  },
  createEnemiesWalkerGroup: function() {
    var group  = this.game.add.group();
    this.tilemap.createFromObjects('objects', TILES.ENEMYFLY, IMAGES.TILES_PROPS, 7, false, false, group, Phaser.Sprite, false);
    return group;
  },
  createEnemiesShootGroup: function() {
    var group  = this.game.add.group();
    this.tilemap.createFromObjects('objects', TILES.ENEMYSHOOT, IMAGES.TILES_PROPS, 8, false, false, group, Phaser.Sprite, false);
    return group;
  },
  createEnemiesFlyGroup: function() {
    var group  = this.game.add.group();
    this.tilemap.createFromObjects('objects', TILES.ENEMYWALKER, IMAGES.TILES_PROPS, 9, false, false, group, Phaser.Sprite, false);
    return group;
  },
  getEndPoint : function(){
    return this.levelEnd;
  },
  getTrapTiles: function(onCollideCb, onCollideCtx) {
    var trapTiles = [];
    var layer = this.propsLayer.layer;
    for (var y = 0; y < layer.height; y++) {
      for (var x = 0; x < layer.width; x++) {
        var tile = layer.data[y][x];
        if (tile &&
          tile.index === TILES.TRAP ||
          tile.index === TILES.SPIKE) {
            tile.setCollision(true, true, true, true);
            trapTiles.push(tile);
        }
      }
    }
    return trapTiles;
  }
}

module.exports = TiledLevel;
