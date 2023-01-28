import Phaser from 'phaser'
<<<<<<< Updated upstream

import Level from './scenes/Level'
=======
import MainScene from './scenes/MainScene'
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
	scene: [Level]
=======
	scene: [MainScene]
>>>>>>> Stashed changes
}

export default new Phaser.Game(config)
