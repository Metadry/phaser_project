import Phaser from 'phaser'
import Player from '../scripts/player/Player'
export default class PlayerPlayground extends Phaser.Scene {
    preload() {
        this.load.image('sky', 'space3.png');
        this.load.image('ground', 'platform.png');
        this.load.image('bullet', 'bullet.png');
        this.load.spritesheet('player', 'player/player-spritesheet.png', { frameWidth: 71, frameHeight: 67 });
    }

    create() {
        this.add.image(400, 300, 'sky')
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 450, 'ground');
        this.platforms.create(-100, 500, 'ground');
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.player = new Player(this, 400, 300, 'player');
        this.player.create();

        this.cameras.main.startFollow(this.player);

        this.physics.add.collider(this.player, this.platforms);
    }

    update() {
        this.player.update();
    }
}
