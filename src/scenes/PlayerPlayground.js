import Phaser from 'phaser'
import Player from '../scripts/player/Player'
export default class PlayerPlayground extends Phaser.Scene {
    preload() {
        this.load.image('sky', 'space3.png');
        this.load.image('ground', 'platform.png');
        this.load.image('bullet', 'bullet.png');
        this.load.image('ammoPack', 'ammoPack.png');
        this.load.image('infiniteAmmoPack', 'infiniteAmmoPack.png');
        this.load.spritesheet('player', 'player/player-spritesheet.png', { frameWidth: 71, frameHeight: 67 });
        this.load.image('player', 'player/idle/idle-1.png');
        this.load.atlas('spritesPlayer', 'player_anim/player-anim.png', 'player_anim/player-anim-atlas.json');
    }

    create() {
        this.add.image(400, 300, 'sky')
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 450, 'ground');
        this.platforms.create(-100, 500, 'ground');
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.player = new Player(this, 400, 300, 'player');
        this.cameras.main.startFollow(this.player);

        this.ammoPacks = this.physics.add.group({
            key: 'ammoPack',
            repeat: 2,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.infiniteAmmos = this.physics.add.group({
            key: 'infiniteAmmoPack',
            repeat: 0,
            setXY: { x: 600, y: 0, stepX: 0 }
        });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.ammoPacks, this.platforms);
        this.physics.add.collider(this.infiniteAmmos, this.platforms);
        this.physics.add.overlap(this.player, this.ammoPacks, this.refillAmmo, null, this);
        this.physics.add.overlap(this.player, this.infiniteAmmos, this.setInfiniteAmmo, null, this);
    }

    update() {
        this.player.update();
    }

    refillAmmo(player, ammoPack) {
        ammoPack.disableBody(true, true);
        this.player.refillAmmo();
    }

    setInfiniteAmmo(player, infiniteAmmo) {
        infiniteAmmo.disableBody(true, true);
        this.player.infiniteAmmo = true;
    }
}
