export default class Hud extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, spriteName){
        super(scene, x, y, spriteName);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        this.hudlLayer = this.scene.physics.add.group(); 

    }

    updateAmmoBar(){
        
    }
}