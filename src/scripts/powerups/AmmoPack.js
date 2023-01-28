export default class AmmoPack extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x + 8, y + 12.5, 'ammoPack');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.allowGravity = false;
    }

    use() {
        this.scene.sound.play('pickUp');
        this.disableBody(true, true);
        this.scene.player.refillAmmo();
    }
}