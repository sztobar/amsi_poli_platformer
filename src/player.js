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
