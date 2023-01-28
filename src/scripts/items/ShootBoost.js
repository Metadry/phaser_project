export default class AmmoPack extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x + 10.5, y + 12.5, 'shootBoost');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
    }

    use() {
        this.scene.sound.play('pickUpBoost');
        this.disableBody(true, true);
        this.scene.player.refillAmmo();
        this.scene.player.shootBoostEnabled = true;
        this.scene.player.hud.setinfiniteAmmo();
    }
}