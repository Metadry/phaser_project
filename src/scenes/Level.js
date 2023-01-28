import Player from "../scripts/player/Player";
import AmmoPack from "../scripts/powerups/AmmoPack";
import ShootBoost from "../scripts/powerups/ShootBoost";
import MidAirJump from "../scripts/powerups/MidAirJump";
import Portal from "../scripts/environment/Portal";

export default class Level extends Phaser.Scene {

    preload() {
        // Player
        this.load.image('player', 'player/idle/idle-1.png');
        this.load.atlas('spritesPlayer', 'player_anim/player-anim.png', 'player_anim/player-anim-atlas.json');
        this.load.image('bullet', 'bullet.png');

        // Items
        this.load.image('ammoPack', 'items/ammoPack.png');
        this.load.image('shootBoost', 'items/shootBoost.png');
        this.load.image('midAirJump', 'items/midAirJump.png');

        // Environment
        this.load.image('portal', 'environment/portal.png');
        this.load.image('tiles', 'Tileset.png');
        this.load.image('items', 'Items.png');
        this.load.tilemapTiledJSON('Mapa', 'Mapa.json');

        // HUD
        this.load.image('healthBar', 'hudElements/healthBar.png');
        this.load.image('ammoIcon', 'hudElements/ammoIcon.png');
        this.load.image('ammoHover', 'hudElements/ammoHover.png');
        this.load.image('infiniteAmmo', 'hudElements/infiniteAmmo.png');

        this.load.spritesheet('tilesSprites', 'Tileset.png',
            { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('itemSprites', 'Items.png',
            { frameWidth: 32, frameHeight: 32 });

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
        this.add.tileSprite(0, 0, 2848, 1024, 'hg');

        var map = this.make.tilemap({ key: 'Mapa' });
        var tiles = map.addTilesetImage('Mapa', 'tiles');

        map.createLayer('BackGround', tiles, 0, 0);
        var platforms = map.createLayer('Foreground', tiles, 0, 0);
        map.createLayer('Stairs', tiles, 0, 0);
        var deathPlatforms = map.createLayer('TilesDeath', tiles, 0, 0);
        map.createLayer('Detail', tiles, 0, 0);
        map.createLayer('Detail2', tiles, 0, 0);
        map.createLayer('Detail3', tiles, 0, 0);
        var layerTilesMoveV = map.createLayer('TilesMoveV', tiles, 0, 0);
        var layerTilesMoveH = map.createLayer('TilesMoveH', tiles, 0, 0);
        var layerEndgame = map.createLayer('EndGame', tiles, 0, 0);

        platforms.setCollisionByExclusion(-1, true);
        deathPlatforms.setCollisionByExclusion(-1, true);

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

        // Player init
        this.start = { x: 100, y: 450 };
        this.player = new Player(this, this.start.x, this.start.y, 'player');
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.player, deathPlatforms, this.resetLevel, null, this);
        this.physics.add.collider(this.player.bulletStash, platforms, this.bulletHitBlock, null, this);

        this.initObjects(map);
    }

    update() {
        this.player.update();
    }

    initObjects(map) {
        // Consumables
        let ammoPackObjects = map.getObjectLayer('AmmoObject')['objects'];
        this.ammoPacks = [];
        for (let i = 0; i < ammoPackObjects.length; i++) {
            let ammoPack = new AmmoPack(this, ammoPackObjects[i].x, ammoPackObjects[i].y);
            this.physics.add.overlap(this.player, ammoPack, ammoPack.use, null, ammoPack);
            this.ammoPacks.push(ammoPack);
        }

        let shootBoostObjects = map.getObjectLayer('CollectableObject')['objects'];
        this.shootBoosts = [];
        for (let i = 0; i < shootBoostObjects.length; i++) {
            let shootBoost = new ShootBoost(this, shootBoostObjects[i].x, shootBoostObjects[i].y);
            this.physics.add.overlap(this.player, shootBoost, shootBoost.use, null, shootBoost);
            this.shootBoosts.push(shootBoost);
        }

        // Statics
        let midAirJumpObjects = map.getObjectLayer('DoubleJumpObject')['objects'];
        for (let i = 0; i < midAirJumpObjects.length; i++) {
            let midAirJump = new MidAirJump(this, midAirJumpObjects[i].x, midAirJumpObjects[i].y);
            this.physics.add.overlap(this.player, midAirJump, midAirJump.use, null, midAirJump);
        }

        let portalObjects = map.getObjectLayer('PortalObject')['objects'];
        let portals = [];
        for (let i = 0; i < portalObjects.length; i++) {
            let portal = new Portal(this, portalObjects[i].x, portalObjects[i].y);
            this.physics.add.overlap(this.player, portal, portal.teleportPlayer, null, portal);
            //this.physics.add.overlap(this.player.bulletStash, portal, portal.teleportObject, null, this);
            portals.push(portal);
        }

        portals[0].setTeleportPoint(portals[1]);
        portals[1].setTeleportPoint(portals[0]);
    }

    // Collision functions
    bulletHitBlock(bullet, platform) {
        bullet.stash();
    }

    teleportObject(object, portal) {
        portal.teleport(object, 16);
    }

    resetLevel(player) {
        player.reset(this.start);

        // Reset consumables
        for (let i = 0; i < this.ammoPacks.length; i++) {
            let ammoPack = this.ammoPacks[i];
            if (ammoPack.active == false) {
                ammoPack.enableBody(true, ammoPack.x, ammoPack.y, true, true);
            }
        }

        for (let i = 0; i < this.shootBoosts.length; i++) {
            let shootBoost = this.shootBoosts[i];
            if (shootBoost.active == false) {
                shootBoost.enableBody(true, shootBoost.x, shootBoost.y, true, true);
            }
        }
    }

}