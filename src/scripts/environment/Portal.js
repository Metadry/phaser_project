export default class Portal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, tp) {
        super(scene, x, y, 'portal');
        this.tp = tp;
    }

    init() {
        this.body.setSize(32, 50);
        this.body.setOffset(16, 14);
    }

    teleport(object, offset) {
        let offsetX;
        if (offset != 0) {
            offsetX = offset;
            if (object.body.velocity.x < 0) {
                offsetX *= -1;
            }
        }
        else {
            offsetX = 0;
        }

        object.setX(this.tp + offsetX);
        object.setY(this.y);
    }

    setTeleportPoint(x) {
        this.tp = x;
    }
}