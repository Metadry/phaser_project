export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
        this.offset = 50;
        this.shootSpeed = 900;
        this.disableOffset = 50;
        this.storeX = 0;
        this.storeY = 0;
    }

    preUpdate() {
        if (this.x + this.disableOffset < this.scene.cameras.main.worldView.x
            || this.x - this.disableOffset > this.scene.cameras.main.worldView.x + this.scene.cameras.main.worldView.width) {
            this.stash();
        }
    }

    fire(x, y, flipX) {
        this.flipX = flipX;

        let offset = this.offset;
        let shootSpeed = this.shootSpeed;
        if (this.flipX) {
            offset *= -1;
            shootSpeed *= -1;
        }
        this.enableBody(true, x + offset, y - 8, true, true);
        this.setVelocityX(shootSpeed);
    }

    stash() {
        this.body.x = this.storeX;
        this.body.y = this.storeY;
        this.disableBody(true, true);
    }

    setStorePosition(storeX, storeY) {
        this.storeX = storeX;
        this.storeY = storeY;
    }
}