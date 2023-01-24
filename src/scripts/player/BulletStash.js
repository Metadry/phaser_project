import Bullet from './Bullet'

export default class BulletStash extends Phaser.Physics.Arcade.Group {
	constructor(scene, stashSize, storeX, storeY) {
		super(scene.physics.world, scene,
			{
				classType: Bullet,
				frameQuantity: stashSize,
				active: false,
				visible: false,
				allowGravity: false,
				setXY: {
					x: storeX,
					y: storeY
				},
				key: 'bullet'
			});

		this.getChildren().forEach(bullet => {
			bullet.setStorePosition(storeX, storeY);
			bullet.body.setSize(32, 32);
		});
	}

	fire(x, y, flipX) {
		const bullet = this.getFirstDead(false);
		if (bullet) {
			bullet.fire(x, y, flipX);
		}
	}

}