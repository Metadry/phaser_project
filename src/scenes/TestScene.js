import Phaser from 'phaser'
import Portal from '../scripts/environment/Portal';
import Player from '../scripts/player/Player'
import MidAirJump from '../scripts/items/MidAirJump';
import Mummy from '../scripts/enemies/Mummy'

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

        // Enemy
        this.load.spritesheet('mummy','mummy37x45.png', {frameWidth:37, frameHeight:45});
    }

    create() {
        this.add.image(400, 300, 'sky')
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 430, 'ground');
        this.platforms.create(-100, 500, 'ground');
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.player = new Player(this, 400, 300, 'player');
        this.cameras.main.startFollow(this.player);

        this.mummy = new Mummy(this, 500, 300, 'mummy');

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
        this.physics.add.collider(this.ammoPacks, this.platforms);
        this.physics.add.collider(this.shootBoosts, this.platforms);
        this.physics.add.collider(this.portals, this.platforms);
        this.physics.add.collider(this.mummy, this.platforms);

        this.physics.add.overlap(this.player, this.ammoPacks, this.refillAmmo, null, this);
        this.physics.add.overlap(this.player, this.shootBoosts, this.enableShootBoost, null, this);
        this.physics.add.overlap(this.player, this.midAirJumps, this.enableMidAirJump, null, this);
        this.physics.add.overlap(this.player, this.portals, this.teleportPlayer, null, this);
        this.physics.add.overlap(this.player.bulletStash, this.portals, this.teleport, null, this);
        this.physics.add.overlap(this.player.bulletStash, this.mummy, this.onHit, null, this);
        this.physics.add.overlap(this.player, this.mummy, this.onCollisionMummy, null, this);
    }

    update() {
        this.player.update();
        this.mummy.update();
    }

    initPortals() {
        this.portals.getChildren().forEach(portal => {
            portal.init();
        });

        this.portals.getChildren()[0].setTeleportPoint(this.portals.getChildren()[1].x);
        this.portals.getChildren()[1].setTeleportPoint(this.portals.getChildren()[0].x);
    }

    // Collision functions
    refillAmmo(player, ammoPack) {
        ammoPack.disableBody(true, true);
        this.player.refillAmmo();
    }

    enableShootBoost(player, shootBoost) {
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

    onCollisionMummy(player) {
        this.player.receiveHit(2);
    }

    onHit(object, mummy) {
        object.destroy(true);
        this.mummy.receiveHit(10);
    }
}
