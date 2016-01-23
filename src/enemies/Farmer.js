/**
 * Created by mmitis on 23.01.16.
 */
var IMAGES = require('./../config').images;

export default class Farmer {

    constructor(game){
        this.game = game;
        this.sprite = game.add.sprite(60, 60, IMAGES.ENEMY);
        this.right = false;
        this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
        this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
        this.sprite.die = this.die.bind(this);
        this.death = false;
        var deathAnimation = this.sprite.animations.add('death', [4, 9, 10, 11], 10);
        deathAnimation.onComplete.add(this.afterDeath.bind(this), this);
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

    updateMovement() {
        if(this.death == false) {
            if (this.sprite.body.blocked.right) {
                this.right = false;
            }
            else if (this.sprite.body.blocked.left) {
                this.right = true;
            }

            if (this.right) {
                this.sprite.body.velocity.x = 100;
                this.sprite.animations.play('right');
            }
            else {
                this.sprite.body.velocity.x = -100;
                this.sprite.animations.play('left');
            }
        }
    };
}