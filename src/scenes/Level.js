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

        this.start = { x: 100, y: 450 };
        this.player = new Player(this, this.start.x, this.start.y, 'player');
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.player, deathPlatforms, this.player.reset, null, this.player);
        this.physics.add.collider(this.player.bulletStash, platforms, this.bulletHitBlock, null, this);

        this.initObjects(map);
    }

    update() {
        this.player.update();
    }

    initObjects(map) {
        this.ammoPacks = map.getObjectLayer('AmmoObject')['objects'];
        for (let i = 0; i < this.ammoPacks.length; i++) {
            let ammoPack = new AmmoPack(this, this.ammoPacks[i].x, this.ammoPacks[i].y);
            this.physics.add.overlap(this.player, ammoPack, ammoPack.use, null, ammoPack);
        }

        this.shootBoosts = map.getObjectLayer('CollectableObject')['objects'];
        for (let i = 0; i < this.shootBoosts.length; i++) {
            let shootBoost = new ShootBoost(this, this.shootBoosts[i].x, this.shootBoosts[i].y);
            this.physics.add.overlap(this.player, shootBoost, shootBoost.use, null, shootBoost);
        }

        this.midAirJumps = map.getObjectLayer('DoubleJumpObject')['objects'];
        for (let i = 0; i < this.midAirJumps.length; i++) {
            let midAirJump = new MidAirJump(this, this.midAirJumps[i].x, this.midAirJumps[i].y);
            this.physics.add.overlap(this.player, midAirJump, midAirJump.use, null, midAirJump);
        }

        this.portalObjects = map.getObjectLayer('PortalObject')['objects'];
        this.portals = [];
        for (let i = 0; i < this.portalObjects.length; i++) {
            let portal = new Portal(this, this.portalObjects[i].x, this.portalObjects[i].y);
            this.physics.add.overlap(this.player, portal, portal.teleportPlayer, null, portal);
            //this.physics.add.overlap(this.player.bulletStash, portal, portal.teleportObject, null, this);
            this.portals.push(portal);
        }

        this.portals[0].setTeleportPoint(this.portals[1]);
        this.portals[1].setTeleportPoint(this.portals[0]);
    }

    // Collision functions
    bulletHitBlock(bullet, platform) {
        bullet.stash();
    }

    teleportObject(object, portal) {
        portal.teleport(object, 16);
    }

}