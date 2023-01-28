export default class TrapV extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'trap');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setImmovable(true);

        // Stats
        this.speed = (Math.random() * 100) + 75;
        
        // Limits
        this.limit1 = y - 100;
        this.limit2 = y + 100;

        this.setVelocityY(this.speed);
    }

    update()
    {   
        if (this.y <= this.limit1) {
            this.setVelocityY(this.speed * 1);
        } 

        else if (this.y >= this.limit2) {
            this.setVelocityY(this.speed * -1);
        }

        if (this.body.velocity.y == 0) {
            this.setVelocityY(this.speed);
        }
    }
}