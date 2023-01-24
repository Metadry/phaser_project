export default class Portal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, tpX, tpY) {
        super(scene, x, y, 'portal');
        this.tpX = tpX;
        this.tpY = tpY;
    }

    init() {
        this.body.setSize(32, 50);
        this.body.setOffset(16, 14);
    }

    teleport(object) {
        let side = object.flipX ? -1 : 1;
        object.setX(this.tpX + side * this.body.width);
        object.setY(this.y);
    }

    setTeleportPortal(object) {
        this.setTeleportPoint(object.x, object.y);
    }

    setTeleportPoint(x, y) {
        this.tpX = x;
        this.tpY = y;
    }
}