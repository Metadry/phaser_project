export default class MidAirJump extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'midAirJump');
        this.enabled = true;
    }

    preUpdate() {
        if (!this.enabled && this.body.touching.none) {
            this.enabled = true;
        }
    }
}