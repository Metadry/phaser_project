import Phaser from 'phaser'

import Level from './scenes/Level'

const config = {
	type: Phaser.AUTO,
	width: 1024,
	height: 768,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 500 }
			//debug: true
		}
	},
	scene: [Level]
}

export default new Phaser.Game(config)
