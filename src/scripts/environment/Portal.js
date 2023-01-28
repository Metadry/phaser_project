export default class Portal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, tpX, tpY) {
        super(scene, x + 48, y + 64, 'portal');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setSize(32, 50);
        this.body.setOffset(16, 14);

        this.tpX = tpX;
        this.tpY = tpY;
    }

    teleportPlayer() {
        if (Phaser.Input.Keyboard.JustDown(this.scene.player.cursors.up)) {
            this.teleport(this.scene.player, 0);
        }
    }

    teleportObject(portal, object) {
        this.teleport(object, 16);
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

        this.scene.sound.play('teleport');
        object.setX(this.tpX + offsetX);
        object.setY(this.tpY);
    }

    setTeleportPoint(portal) {
        this.tpX = portal.x;
        this.tpY = portal.y;
    }
}