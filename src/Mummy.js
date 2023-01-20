import Phaser from 'phaser'
export default class Mummy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,spriteName)
    {
        super(scene,x,y,spriteName);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.cursores = this.scene.input.keyboard.createCursorKeys();
        this.scene.anims.create(
            {
                key: 'walk',
                frames: this.scene.anims.generateFrameNumbers(spriteName, {start:0, end:18}),
                frameRate: 10,
                repeat: -1
            }
        );
        this.play('walk');
    }

    update()
    {
        this.setVelocityX(0);
        this.setVelocityY(0);
        if(this.cursores.up.isDown)
        {
            this.setVelocityY(-200);
        }
        if(this.cursores.down.isDown)
        {
            this.setVelocityY(200);
        }
        if(this.cursores.left.isDown)
        {
            this.setVelocityX(-200);
        }
        if(this.cursores.right.isDown)
        {
            this.setVelocityX(200);
        }
    }
}
