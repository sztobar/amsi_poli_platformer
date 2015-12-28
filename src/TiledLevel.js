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