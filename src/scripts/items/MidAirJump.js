export default class MidAirJump extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x + 16, y + 16, 'midAirJump');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.enabled = true;
    }

    preUpdate() {
        if (!this.enabled && this.body.touching.none) {
            this.enabled = true;
        }
    }

    use() {
        if (this.enabled) {
            this.enabled = false;
            this.scene.player.midAirJumpEnabled = true;
        }
    }
}