import Phaser from 'phaser';
import hudConfig from '../scripts/hud/hudConfig';
import Portal from '../scripts/environment/Portal';
import Player from '../scripts/player/Player';
import MidAirJump from '../scripts/items/MidAirJump';

export default class PlayerPlayground extends Phaser.Scene {
    preload() {
        // Background
        this.load.image('sky', 'space3.png');
        this.load.image('ground', 'platform.png');

        // Environment
        this.load.image('portal', 'environment/portal.png');

        // Items
        this.load.image('ammoPack', 'items/ammoPack.png');
        this.load.image('shootBoost', 'items/shootBoost.png');
        this.load.image('midAirJump', 'items/midAirJump.png');

        // Player
        this.load.image('player', 'player/idle/idle-1.png');
        this.load.atlas('spritesPlayer', 'player_anim/player-anim.png', 'player_anim/player-anim-atlas.json');
        this.load.image('bullet', 'bullet.png');

        // HUD
        this.load.image('healthBar', 'hudElements/healthBar.png');
        this.load.image('ammoIcon', 'hudElements/ammoIcon.png');
        this.load.image('ammoHover', 'hudElements/ammoHover.png');
        this.load.image('infiniteAmmo', 'hudElements/infiniteAmmo.png');

        // Sounds
        this.load.audio('shoot', 'sounds/effects/shoot.mp3');
        this.load.audio('noAmmo', 'sounds/effects/noAmmo.mp3');
        this.load.audio('pickUp', 'sounds/effects/pickUp.mp3');
        this.load.audio('pickUpBoost', 'sounds/effects/pickUpBoost.mp3');
        this.load.audio('jump', 'sounds/effects/jump.mp3');
        this.load.audio('ground', 'sounds/effects/ground.mp3');
        this.load.audio('hurt', 'sounds/effects/hurt.mp3');
        this.load.audio('teleport', 'sounds/effects/teleport.mp3');
    }

    create() {
        this.add.image(400, 300, 'sky')
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 430, 'ground');
        this.platforms.create(-100, 500, 'ground');
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        
        // Player 
        this.player = new Player(this, 400, 200, 'player');
        this.cameras.main.startFollow(this.player);
        
        // HUD 
        // this.hud = new hudConfig(this, )

        // HUD - HealthBar
        this.healthBar = this.add.graphics();
        this.healthBar.fillStyle(0x00ff00, 1);
        this.healthBar.fillRect(59, 20, 160, 20);
        let healthIcon = this.add.image(30, 30, 'healthBar').setScale(0.15);

        // HUD - AmmoBar
        this.ammo = this.add.graphics();
        this.ammo.fillStyle(0xfd193e, 1);
        this.ammo.fillRect(59, 60, 150, 20); // Iteraciones por 30 puntos
        let ammoHover = this.add.image(135, 70, 'ammoHover').setScale(0.24, 0.25);
        let ammoIcon = this.add.image(29, 70, 'ammoIcon').setScale(0.12);

        // HUD - InfiniteAmmoIcon
        let infiniteAmmo = this.add.image(76, 72, 'infiniteAmmo').setScale(0.05);

        // HUD - FIX TO CAMERA
        this.ammo.setScrollFactor(0);
        this.healthBar.setScrollFactor(0);
        ammoHover.setScrollFactor(0, 0);
        ammoIcon.setScrollFactor(0, 0);
        healthIcon.setScrollFactor(0, 0);
        infiniteAmmo.setScrollFactor(0, 0);

        // HUD - SetVisible hudElements
        infiniteAmmo.setVisible(false); // Set infiniteAmmo disabled by default
        //ammoHover.setVisible(false);
        //this.ammo.setVisible(false);


        this.ammoPacks = this.physics.add.group({
            key: 'ammoPack',
            repeat: 1,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.shootBoosts = this.physics.add.group({
            key: 'shootBoost',
            repeat: 0,
            setXY: { x: 580, y: 0, stepX: 0 }
        });

        this.midAirJumps = this.physics.add.group({
            classType: MidAirJump,
            frameQuantity: 1,
            immovable: true,
            allowGravity: false,
            setXY: { x: 700, y: 450 },
            key: 'midAirJump'
        });

        this.portals = this.physics.add.group({
            classType: Portal,
            frameQuantity: 2,
            setXY: { x: 200, y: 450, stepX: 200 },
            key: 'portal'
        });

        this.initPortals();

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player.bulletStash, this.platforms, this.bulletHitBlock, null, this);
        this.physics.add.collider(this.ammoPacks, this.platforms);
        this.physics.add.collider(this.shootBoosts, this.platforms);
        this.physics.add.collider(this.portals, this.platforms);
        this.physics.add.overlap(this.player, this.ammoPacks, this.refillAmmo, null, this);
        this.physics.add.overlap(this.player, this.shootBoosts, this.enableShootBoost, null, this);
        this.physics.add.overlap(this.player, this.midAirJumps, this.enableMidAirJump, null, this);
        this.physics.add.overlap(this.player, this.portals, this.teleportPlayer, null, this);
        this.physics.add.overlap(this.player.bulletStash, this.portals, this.teleport, null, this);
    }

    update() {
        this.player.update();
    }

    initPortals() {
        this.portals.getChildren().forEach(portal => {
            portal.init();
        });

        this.portals.getChildren()[0].setTeleportPoint(this.portals.getChildren()[1].x);
        this.portals.getChildren()[1].setTeleportPoint(this.portals.getChildren()[0].x);
    }

    // Collision functions
    bulletHitBlock(bullet, platform) {
        bullet.stash();
    }

    refillAmmo(player, ammoPack) {
        this.sound.play('pickUp');
        ammoPack.disableBody(true, true);
        this.player.refillAmmo();
    }

    enableShootBoost(player, shootBoost) {
        this.sound.play('pickUpBoost');
        shootBoost.disableBody(true, true);
        this.player.shootBoostEnabled = true;
    }

    enableMidAirJump(player, midAirJump) {
        if (midAirJump.enabled) {
            midAirJump.enabled = false;
            this.player.midAirJumpEnabled = true;
        }
    }

    teleportPlayer(player, portal) {
        if (Phaser.Input.Keyboard.JustDown(player.cursors.up)) {
            portal.teleport(player, 0);
        }
    }

    teleport(object, portal) {
        portal.teleport(object, 16);
    }
}
