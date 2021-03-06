/* global Phaser */
/* global PIXI */
var config = require('./config');
var IMAGES = config.images;
var SOUNDS = config.sounds;
var DIRECTIONS = config.directions;
var FIRE_RATE = 250;
var VELOCITY = 250;
var JUMP_SPEED = 300;
var PROJECTILE_VELOCITY = VELOCITY * 2;

class Player {

  constructor(game, x, y) {
    this._game = game;
    this._checkpoint = new Phaser.PIXI.Point(x, y);
    this.sprite = game.add.sprite(x, y, IMAGES['PLAYER_'+ this._game.game.currentSelectHero]);

    //  We need to enable physics on the playerSprite
    game.physics.arcade.enable(this.sprite);
    this.sprite.position.y -= this.sprite.height;
    this.sprite.body.setSize(32, 48, 0, this.sprite.height - 48);
    game.camera.follow(this.sprite);

    //  playerSprite physics properties. Give the little guy a slight bounce.
    this.sprite.body.bounce.y = 0;
    this.sprite.body.gravity.y = 600;
    this.sprite.body.collideWorldBounds = true;

    this.direction = DIRECTIONS.LEFT;
    //  Our two animations, walking left and right.
    this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);

    this.sprite.animations.add('shootleft', [12], 5, true);
    this.sprite.animations.add('shootright', [13], 5, true);

    var deathAnimation = this.sprite.animations.add('death', [9,10,9,10,11,10,11],5);
    deathAnimation.onComplete.add(this.afterDeath, this);

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

    this._1Key = game.input.keyboard.addKey(Phaser.KeyCode.ONE);
    this._2Key = game.input.keyboard.addKey(Phaser.KeyCode.TWO);
    this._3Key = game.input.keyboard.addKey(Phaser.KeyCode.THREE);
    this._4Key = game.input.keyboard.addKey(Phaser.KeyCode.FOUR);

    this.projectilesGroup = game.add.group();
    this.projectilesGroup.enableBody = true;
    this.projectilesGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.projectilesGroup.createMultiple(5, IMAGES.PROJECTILE);
    this.projectilesGroup.setAll('anchor.x', 0.5);
    this.projectilesGroup.setAll('anchor.y', 0.5);
    this.projectilesGroup.setAll('outOfBoundsKill', true);
    this.projectilesGroup.setAll('checkWorldBounds', true);
    this._nextFire = 0;
    this.immovable = false;
    this.invincible = false;

    this.jumpSound = this._game.add.audio(SOUNDS.JUMP, 0.1);
    this.damageSound = this._game.add.audio(SOUNDS.DAMAGE, 0.1);
    this.starSound = this._game.add.audio(SOUNDS.STAR, 0.1);
    this.checkpointSound = this._game.add.audio(SOUNDS.CHECKPOINT, 0.1);
    this.shootSound = this._game.add.audio(SOUNDS.SHOOT, 0.1);
  }

  update() {

    //  Reset the players velocity (movement)
    this.sprite.body.velocity.x = 0;

    if (this.immovable) {
      return;
    }

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
    } else if (this._shootKey.isDown && this.direction == DIRECTIONS.RIGHT) {
      //  Move to the right
      this.sprite.animations.play('shootright');
    } else if (this._shootKey.isDown && this.direction == DIRECTIONS.LEFT) {
      //  Move to the right
      this.sprite.animations.play('shootleft');
    }



	else {
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
      this.jumpSound.play();
    }

    if (this._makeShoot && this._game.time.now > this._nextFire && this.projectilesGroup.countDead() > 0) {
      this._nextFire = this._game.time.now + FIRE_RATE;
	    this.sprite.animations.play('shootright');
      this.shootSound.play();

      var projectile = this.projectilesGroup.getFirstDead();

      projectile.reset(this.sprite.position.x + this.sprite.width/2, this.sprite.position.y + this.sprite.height/2);
      if (this.direction === DIRECTIONS.RIGHT) {
        projectile.body.velocity.x = PROJECTILE_VELOCITY;
      } else {
        projectile.body.velocity.x = -PROJECTILE_VELOCITY;
      }
    }

    var cameraView = this._game.world.camera.view;
    this.projectilesGroup.children.forEach(function(projectile) {
      if (projectile.alive && !cameraView.intersects(projectile)) {
        projectile.kill();
      }
      projectile.rotation += 0.25;
    });



    // DEBUG PLAYER SPRITES
    // if (this._1Key.isDown) {
    //   this.sprite.loadTexture(IMAGES.PLAYER_1, this.sprite.frame);
    // }
    // if (this._2Key.isDown) {
    //   this.sprite.loadTexture(IMAGES.PLAYER_2, this.sprite.frame);
    // }
    // if (this._3Key.isDown) {
    //   this.sprite.loadTexture(IMAGES.PLAYER_3, this.sprite.frame);
    // }
    // if (this._4Key.isDown) {
    //   this.sprite.loadTexture(IMAGES.PLAYER_4, this.sprite.frame);
    // }

  }

  handleJumpKeyDown() {
    this._makeJump = true;
  }

  handleJumpKeyUp() {
    this._makeJump = false;
  }

  handleShootKeyDown() {
    this._makeShoot = true;
  }

  handleShootKeyUp(){
    this._makeShoot = false;
  }

  resetToCheckpoint() {
    this.sprite.position.set(this._checkpoint.x, this._checkpoint.y - this.sprite.body.height - 5);
    setTimeout(() => {
      this.immovable = false;
      this.blink();
    });
  }

  setCheckpoint(x, y) {
    this._checkpoint.set(x, y);
    this.checkpointSound.play();
  }

  die() {
    this.immovable = true;
    this.sprite.animations.play('death');
    this.damageSound.play();
  }

  afterDeath() {
    this.resetToCheckpoint();
  }

  blink() {
    const timer = this._timer = this._game.time.create(true);
    let i = 0;
    this.invincible = true;
    const repeats = 20;
    timer.repeat(100, repeats, () => {
      this.sprite.alpha = this.sprite.alpha === 1 ? 0.1 : 1;
      i++;
      if (i === repeats) {
        this.sprite.alpha = 1;
        this.invincible = false;
      }
    });
    timer.start();
  }
};

module.exports = Player;
