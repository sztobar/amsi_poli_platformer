/**
 * Created by mmitis on 23.01.16.
 */
var IMAGES = require('./../config').images;

export default class Walker {

    constructor(game, position, spriteMan){
        this.game = game;
        this.sprite = game.add.sprite(60, 48, spriteMan);
        this.right = false;
        this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
        this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
        this.sprite.die = this.die.bind(this);
        this.sprite.x = position[0];
        this.sprite.y = position[1];
        this.death = false;
        this.sprite.direction = true;
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

    updateMovement(player) {
        if(Phaser.Point.distance(player, this.sprite.body) < 640) {
            if (this.death == false) {
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
}