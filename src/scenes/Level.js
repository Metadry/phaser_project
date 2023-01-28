import Player from "../scripts/player/Player";
import AmmoPack from "../scripts/items/AmmoPack";
import ShootBoost from "../scripts/items/ShootBoost";
import MidAirJump from "../scripts/items/MidAirJump";
import Portal from "../scripts/environment/Portal";
import Mummy from '../scripts/enemies/Mummy'

export default class Level extends Phaser.Scene {

    preload() {
        // Player
        this.load.image('player', 'sprites/player/idle/idle-1.png');
        this.load.atlas('spritesPlayer', 'sprites/player/anim/player-anim.png', 'sprites/player/anim/player-anim-atlas.json');
        this.load.image('bullet', 'sprites/weapons/bullet.png');
        
        // Enemy
        this.load.spritesheet('mummy','enemies/mummy37x45.png', {frameWidth:37, frameHeight:45});
        
        // Items
        this.load.image('ammoPack', 'sprites/items/ammoPack.png');
        this.load.image('shootBoost', 'sprites/items/shootBoost.png');
        this.load.image('midAirJump', 'sprites/items/midAirJump.png');
        
        // Environment
        this.load.image('portal', 'sprites/interactables/portal.png');
        this.load.image('tiles', 'Tileset.png');
        this.load.image('items', 'Items.png');
        this.load.tilemapTiledJSON('Mapa', 'Mapa.json');
        
        this.load.spritesheet('tilesSprites', 'Tileset.png',
        { frameWidth: 32, frameHeight: 32 });
        
        this.load.spritesheet('itemSprites', 'Items.png',
            { frameWidth: 32, frameHeight: 32 });

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
        this.loadMap();

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

        this.initPlayer();
        this.initObjects();
    }

    update() {
        this.player.update();
        this.mummies.forEach(mummy => {
            mummy.update();
        });
    }

    loadMap() {
        this.add.tileSprite(0, 0, 2848, 1024, 'bg');

        this.map = this.make.tilemap({ key: 'Mapa' });
        let tiles = this.map.addTilesetImage('Mapa', 'tiles');

        this.map.createLayer('BackGround', tiles, 0, 0);
        this.platforms = this.map.createLayer('Foreground', tiles, 0, 0);
        this.map.createLayer('Stairs', tiles, 0, 0);
        this.deathPlatforms = this.map.createLayer('TilesDeath', tiles, 0, 0);
        this.map.createLayer('Detail', tiles, 0, 0);
        this.map.createLayer('Detail2', tiles, 0, 0);
        this.map.createLayer('Detail3', tiles, 0, 0);
        this.map.createLayer('TilesMoveV', tiles, 0, 0);
        this.map.createLayer('TilesMoveH', tiles, 0, 0);
        this.map.createLayer('EndGame', tiles, 0, 0);

        this.platforms.setCollisionByExclusion(-1, true);
        this.deathPlatforms.setCollisionByExclusion(-1, true);
    }

    initPlayer() {
        this.start = { x: 100, y: 450 };
        this.player = new Player(this, this.start.x, this.start.y, 'player');
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.deathPlatforms, this.resetLevel, null, this);
        this.physics.add.collider(this.player.bulletStash, this.platforms, this.bulletHitBlock, null, this);
    }

    initObjects() {
        this.initConsumables();
        this.initStatics();
        this.initEnemies();
    }

    initConsumables() {
        this.consumables = [];

        this.map.getObjectLayer('AmmoObject')['objects'].forEach(ammoPackObject => {
            let ammoPack = new AmmoPack(this, ammoPackObject.x, ammoPackObject.y);
            this.physics.add.overlap(this.player, ammoPack, ammoPack.use, null, ammoPack);
            this.consumables.push(ammoPack);
        });

        this.map.getObjectLayer('CollectableObject')['objects'].forEach(shootBoostObject => {
            let shootBoost = new ShootBoost(this, shootBoostObject.x, shootBoostObject.y);
            this.physics.add.overlap(this.player, shootBoost, shootBoost.use, null, shootBoost);
            this.consumables.push(shootBoost);
        });
    }

    initStatics() {
        this.map.getObjectLayer('DoubleJumpObject')['objects'].forEach(midAirJumpObject => {
            let midAirJump = new MidAirJump(this, midAirJumpObject.x, midAirJumpObject.y);
            this.physics.add.overlap(this.player, midAirJump, midAirJump.use, null, midAirJump);
        });

        let portals = [];
        this.map.getObjectLayer('PortalObject')['objects'].forEach(portalObject => {
            let portal = new Portal(this, portalObject.x, portalObject.y);
            this.physics.add.overlap(this.player, portal, portal.teleportPlayer, null, portal);
            this.physics.add.overlap(this.player.bulletStash, portal, portal.teleportObject, null, portal);
            portals.push(portal);
        });

        portals[0].setTeleportPoint(portals[1]);
        portals[1].setTeleportPoint(portals[0]);
    }

    initEnemies() {
        this.mummyObjects = this.map.getObjectLayer('MomiaSpawn')['objects'];
        this.mummies = [];
        for (let i = 0; i < this.mummyObjects.length; i++) {
            let mummy = new Mummy(this, this.mummyObjects[i].x, this.mummyObjects[i].y, 'mummy');
            this.physics.add.collider(mummy, this.platforms);
            this.physics.add.collider(this.player, mummy, this.onCollisionMummy, null, this);
            this.physics.add.collider(this.player.bulletStash, mummy, this.onHit, null, this);

            this.mummies.push(mummy);
        }

        this.mummyColliderObjects = this.map.getObjectLayer('MomiaObject')['objects'];
        let position = 0;
        this.mummies.forEach(mummy => {
            mummy.limit1 = this.mummyColliderObjects[position].x;
            mummy.limit2 = this.mummyColliderObjects[position+1].x;

            position = position + 2;
        });
    }

    // Collision functions
    bulletHitBlock(bullet) {
        bullet.stash();
    }

    resetLevel() {
        this.player.reset(this.start);

        // Reset used consumables
        this.resetConsumables();

        // Reset mummies
        this.resetMummies();
        
    }

    resetConsumables() {
        for (let i = 0; i < this.consumables.length; i++) {
            let consumable = this.consumables[i];
            if (consumable.active == false) {
                consumable.enableBody(true, consumable.x, consumable.y, true, true);
            }
        }
    }

    resetMummies() {
        this.mummies.forEach(mummy => {
            mummy.destroy();
        });

        this.initEnemies();
    }

    teleport(bullet, portal) {
        portal.teleport(bullet, 16);
    }

    onCollisionMummy(player) {
        this.player.receiveHit(2);
    }

    onHit(mummy, object) {
        object.stash();
        mummy.receiveHit(10);
    }

}