export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
        this.offset = 50;
        this.shootSpeed = 900;
    }

    fire(x, y, flipX) {
        this.body.setSize(32, 32); // Try to move to constructor
        this.body.setAllowGravity(false); // Try to move to constructor

        this.setActive(true);
        this.setVisible(true);

        this.flipX = flipX;

        let offset = this.offset;
        let shootSpeed = this.shootSpeed;
        if (this.flipX) {
            offset *= -1;
            shootSpeed *= -1;
        }
        this.body.reset(x + offset, y - 8);
        this.setVelocityX(shootSpeed);
    }
}