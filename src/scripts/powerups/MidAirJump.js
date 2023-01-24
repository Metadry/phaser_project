export default class MidAirJump extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'midAirJump');
    }

    preUpdate() {
        if (!this.active == false && this.body.touching.none) {
            this.active = true;
        }
    }
}