/**
 * Created by mmitis on 23.01.16.
 */
var IMAGES = require('./../config').images;

export default class Cloud {

    constructor(game, position, spriteMan){
        this.game = game;
        this.sprite = game.add.sprite(36, 60, spriteMan);
        this.right = false;
        this.sprite.animations.add('left', [0, 1, 2, 3], 8, true);

        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.setSize(60, 36, 0, this.sprite.height - 48);
        this.sprite.die = this.die.bind(this);
        this.sprite.x = position[0];
        this.sprite.y = position[1];
        this.yMax = position[1] + 70;
        this.yMin = position[1] - 70;
        this.sprite.enableBody = true;
        this.sprite.physicsBodyType = Phaser.Physics.ARCADE;

        this.death = false;
        this.direction = true;

        var deathAnimation = this.sprite.animations.add('death', [4, 5, 6, 7], 8);
          deathAnimation.onComplete.add(this.afterDeath.bind(this), this);
    };

    getSprite(){
        return this.sprite;
    }

    die() {
        this.death = true;
        this.sprite.body.velocity.y = 0;
        this.sprite.animations.play('death');
    }

    afterDeath(){
        this.sprite.kill();
    }

    updateMovement(player, physics) {
        if (this.death == false) {
            if (Phaser.Point.distance(player, this.sprite.body) < 200) {
                   physics.arcade.moveToObject(this.sprite, player, 100);
            } else {
                if (this.sprite.y > this.yMax) {
                    this.direction = true;
                    this.sprite.y = this.yMax;
                }
                if (this.sprite.y < this.yMin) {
                    this.direction = false;
                    this.sprite.y = this.yMin;
                }

                if (this.direction) {
                    this.sprite.body.velocity.y = -60;
                } else {
                    this.sprite.body.velocity.y = 60;
                }
            }
            if (player.x < this.sprite.x) {
                this.sprite.animations.play('left');
            } else {
                this.sprite.animations.play('right');
            }
        } else {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
        }
    }
}
