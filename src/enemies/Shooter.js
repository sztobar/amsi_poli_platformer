/**
 * Created by mmitis on 23.01.16.
 */
var config = require('./../config');
var IMAGES = config.images;
var SOUNDS = config.sounds;

export default class Shooter {

    constructor(game, position, spriteMan, spriteBullet){
        this.game = game;
        this.sprite = game.add.sprite(60, 48, spriteMan);
        this.right = false;
        this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
        this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
        this.sprite.animations.add('idle', [4], 10, true);

        this.sprite.animations.add('shotLeft', [2,12], 14, true);
        this.sprite.animations.add('shotRight', [7,13], 14, true);
        this.sprite.die = this.die.bind(this);
        this.sprite.x = position[0];
        this.sprite.y = position[1];
        this.death = false;
        this.sprite.direction = true;
        this.projectilesGroup = game.add.group();
        this.projectilesGroup.enableBody = true;
        this.projectilesGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.projectilesGroup.createMultiple(5, spriteBullet);
        this.projectilesGroup.setAll('anchor.x', 0.5);
        this.projectilesGroup.setAll('anchor.y', 0.5);
        this.projectilesGroup.setAll('outOfBoundsKill', true);
        this.projectilesGroup.setAll('checkWorldBounds', true);
        this._nextFire = 0;

        var deathAnimation = this.sprite.animations.add('death', [4, 9, 10, 11], 10);
        deathAnimation.onComplete.add(this.afterDeath.bind(this), this);
        this.shootSound = game.add.audio(SOUNDS.ENEMY_SHOOT, 0.1);
    };

    getSprite(){
        return this.sprite;
    }

    die() {
        this.death = true;
        this.sprite.body.velocity.x = 0;
        this.sprite.animations.play('death');
    }

    afterDeath(){
        this.sprite.kill();
    }


    shot(){
        this._nextFire = this.game.time.now + 1500;
        var projectile = this.projectilesGroup.getFirstDead();
        projectile.reset(this.sprite.position.x + this.sprite.width/2, this.sprite.position.y );
        if (this.sprite.direction) {
            projectile.body.velocity.x = -160;
        } else {
            projectile.body.velocity.x = 160;
        }
        this.shootSound.play();
    }

    updateMovement(player, physics, onHit) {
        physics.arcade.overlap(this.projectilesGroup, player , onHit , null, this);

        if(Phaser.Point.distance(player, this.sprite.body) < 640) {
            this.sprite.body.velocity.x = 0;
            if (this.death == false) {
                if(Phaser.Point.distance(player, this.sprite.body) < 200){
                    if(this.game.time.now > this._nextFire  && this.projectilesGroup.countDead() > 0) {
                        if (player.x < this.sprite.x) {
                            this.sprite.animations.play('shotLeft');
                            this.sprite.body.velocity.x = -10;
                            this.sprite.direction = true;
                        } else {
                            this.sprite.animations.play('shotRight');
                            this.sprite.body.velocity.x = 10;
                            this.sprite.direction = false;

                        }
                        this.shot(player);

                    }
                } else {

                    if(this.sprite.body.onWall() == true){
                        this.sprite.direction = !this.sprite.direction;
                    }
                    if(this.sprite.direction){
                        this.sprite.body.velocity.x = -30;
                        this.sprite.animations.play('left');
                    } else {
                        this.sprite.body.velocity.x = 30;
                        this.sprite.animations.play('right');
                    }
                }
            }
        }
        //Reset bullets
        var cameraView = this.game.world.camera.view;
        this.projectilesGroup.children.forEach(function(projectile) {
            if (projectile.alive && !cameraView.intersects(projectile)) {
                projectile.kill();
            }
            projectile.rotation += 0.25;
        });


    }
}
