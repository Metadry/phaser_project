import Phaser from 'phaser'
import Level from './scenes/Level'
// import MainScene from './scenes/MainScene'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [Level]
	// scene: [MainScene]
}

export default new Phaser.Game(config)
