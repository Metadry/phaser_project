export default class Hud extends Phaser.Physics.Arcade.Sprite {
    constructor(scene){
        super(scene);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.depth = 11;
        this.ammo = this.scene.add.graphics();
        this.ammo.depth = 11;
        this.healthBar = this.scene.add.graphics();
        this.healthBar.depth = 12;
        this.healthBG = this.scene.add.graphics();
        this.healthBG.depth = 11;
    }

    create(){
        // HUD - HealthBar
        this.healthBar.fillStyle(0x00ff00, 1);
        this.healthBar.fillRect(64, 20, 160, 20);
        let healthIcon = this.scene.add.image(30, 30, 'healthBar').setScale(0.15);
        this.healthBG.fillStyle(0x000000, 1);
        this.healthBG.fillRect(59, 15, 170, 30);

        // HUD - AmmoBar
        this.ammo.fillStyle(0xfd193e, 1);
        this.ammo.fillRect(59, 60, 150, 20); // Iteraciones por 30 puntos
        this.ammoHover = this.scene.add.image(135, 70, 'ammoHover').setScale(0.24, 0.25);
        this.ammoHover.depth = 12;
        let ammoIcon = this.scene.add.image(29, 70, 'ammoIcon').setScale(0.12);
        
        // HUD - InfiniteAmmoIcon
        this.infiniteAmmo = this.scene.add.image(76, 72, 'infiniteAmmo').setScale(0.05);

        // HUD - FIX TO CAMERA
        this.ammo.setScrollFactor(0);
        this.healthBar.setScrollFactor(0);
        this.healthBG.setScrollFactor(0);
        this.ammoHover.setScrollFactor(0, 0);
        ammoIcon.setScrollFactor(0, 0);
        healthIcon.setScrollFactor(0, 0);
        this.infiniteAmmo.setScrollFactor(0, 0);

        // HUD - SetVisible hudElements
        this.infiniteAmmo.setVisible(false); // Set infiniteAmmo disabled by default
        this.ammoHover.setVisible(true);
        this.ammo.setVisible(true);
    }

    updateAmmoBar(currentAmmo){
        this.ammo.clear();
        this.ammo.fillStyle(0xfd193e, 1);
        this.ammo.fillRect(59, 60, currentAmmo*30, 20);
        this.ammo.setScrollFactor(0);
    }
    
    updateHealthBar(currentHealth){
        this.healthBar.clear();
        this.healthBar.fillStyle(0x00ff00, 1);
        this.healthBar.fillRect(64, 20, currentHealth, 20);
        this.healthBar.setScrollFactor(0);
    }
    
    setMaxAmmo(){
        this.ammo.clear();
        this.ammo.fillStyle(0xfd193e, 1);
        this.ammo.fillRect(59, 60, 150, 20);
        this.ammo.setScrollFactor(0);
    }
    
    setInfiniteAmmo(){
        this.ammoHover.setVisible(false);
        this.ammo.setVisible(false);
        this.infiniteAmmo.setVisible(true);
    }
    
    notInfinite(){
        this.ammoHover.setVisible(true);
        this.ammo.setVisible(true);
        this.infiniteAmmo.setVisible(false);
    }
}