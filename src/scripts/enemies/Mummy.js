import Phaser from 'phaser'
export default class Mummy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,spriteName)
    {
        super(scene,x,y,spriteName);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Stats
        this.health = 10;
        this.speed = 75;

        // Direction
        this.direction = -1;

        // Limits
        this.limit1 = 0;
        this.limit2 = 0;

        this.scene.anims.create(
            {
                key: 'walk',
                frames: this.scene.anims.generateFrameNumbers(spriteName, {start:0, end:17}),
                frameRate: 10,
                repeat: -1
            }
        );
        this.play('walk');
        this.setVelocityX(this.speed);
    }

    update()
    {
        if (this.x <= this.limit1 + 20) {
            this.setFlipX(false);
            this.setVelocityX(this.speed * 1);
        } 

        if (this.x >= this.limit2 + 10) {
            this.setFlipX(true);
            this.setVelocityX(this.speed * -1);
        }
    }

    receiveHit(damage) {
        if (this.health > 0) {
            this.health -= damage;

            if (this.health <= 0) {
                this.destroy();
            }
        }
    }
}
