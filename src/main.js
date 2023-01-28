import Phaser from 'phaser'

import Juego from './scenes/Juego'

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
	scene: [Juego]
}

export default new Phaser.Game(config)
