export default class Win extends Phaser.Scene {

    preload() {
        this.load.image('win', 'win.png');
        this.load.audio('jingle_win', 'sounds/effects/jingle_win.mp3');
    }

    create() {
        this.add.image(512, 384, 'win');
        this.sound.play('jingle_win', {volume: 0.2});
    }

}