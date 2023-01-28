export default class TrapH extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x + 8, y + 12.5, 'trap');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setImmovable(true);

        // Stats
        this.speed = (Math.random() * 50) + 50;
        
        // Limits
        this.limit1 = x - 50;
        this.limit2 = x + 50;

        this.setVelocityX(this.speed);
    }

    update()
    {
        if (this.x <= this.limit1) {
            this.setVelocityX(this.speed * 1);
        } 

        if (this.x >= this.limit2) {
            this.setVelocityX(this.speed * -1);
        }
    }
}