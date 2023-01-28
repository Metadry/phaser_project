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
        var tilesItems = map.addTilesetImage('Items', 'items');
        var tiles = map.addTilesetImage('Mapa', 'tiles');

        var layerBackground = map.createLayer('BackGround', tiles, 0, 0);
        var layerForeground = map.createLayer('Foreground', tiles, 0, 0);
        var layerStairs = map.createLayer('Stairs', tiles, 0, 0);
        var layerPortal = map.createLayer('Portal', tiles, 0, 0);
        var layerTilesDeath = map.createLayer('TilesDeath', tiles, 0, 0);
        var layerDetail = map.createLayer('Detail', tiles, 0, 0);
        var layerDetail2 = map.createLayer('Detail2', tiles, 0, 0);
        var layerDetail3 = map.createLayer('Detail3', tiles, 0, 0);
        var layerTilesMoveV = map.createLayer('TilesMoveV', tiles, 0, 0);
        var layerTilesMoveH = map.createLayer('TilesMoveH', tiles, 0, 0);
        var layerEndgame = map.createLayer('EndGame', tiles, 0, 0);

        layerForeground.setCollisionByExclusion(-1, true);

        this.player = new Player(this, 100, 450, 'player');
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.physics.add.collider(this.player, layerForeground);
        this.physics.add.collider(this.player.bulletStash, layerForeground, this.bulletHitBlock, null, this);

        this.initObjects(map);
    }

    update() {
        this.player.update();
    }

    initObjects(map) {
        this.ammoPacks = map.getObjectLayer('AmmoObject')['objects'];
        for (let i = 0; i < this.ammoPacks.length; i++) {
            let ammoPack = new AmmoPack(this, this.ammoPacks[i].x, this.ammoPacks[i].y);
            this.physics.add.overlap(this.player, ammoPack, this.refillAmmo, null, this);
        }

        this.shootBoosts = map.getObjectLayer('CollectableObject')['objects'];
        for (let i = 0; i < this.shootBoosts.length; i++) {
            let shootBoost = new ShootBoost(this, this.shootBoosts[i].x, this.shootBoosts[i].y);
            this.physics.add.overlap(this.player, shootBoost, this.enableShootBoost, null, this);
        }

        this.midAirJumps = map.getObjectLayer('DoubleJumpObject')['objects'];
        for (let i = 0; i < this.midAirJumps.length; i++) {
            let midAirJump = new MidAirJump(this, this.midAirJumps[i].x, this.midAirJumps[i].y);
            this.physics.add.overlap(this.player, midAirJump, this.enableMidAirJump, null, this);
        }

        this.portalObjects = map.getObjectLayer('PortalObject')['objects'];
        this.portals = [];
        for (let i = 0; i < this.portalObjects.length; i++) {
            let portal = new Portal(this, this.portalObjects[i].x, this.portalObjects[i].y);
            portal.init();
            this.physics.add.overlap(this.player, portal, this.enableMidAirJump, null, this);
            this.physics.add.overlap(this.player.bulletStash, portal, this.teleport, null, this);
            //this.physics.add.overlap(this.player, portal, this.teleportPlayer, null, this);

            this.portals.push(portal);
        }

        this.portals[0].setTeleportPoint(this.portals[1].x);
        this.portals[1].setTeleportPoint(this.portals[0].x);

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

    teleport(bullet, portal) {
        portal.teleport(bullet, 16);
    }

}