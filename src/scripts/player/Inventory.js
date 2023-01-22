import Bullet from './Bullet'

export default class Inventory extends Phaser.Physics.Arcade.Group {
	constructor(scene, ammo) {
		super(scene.physics.world, scene);

		this.ammo = ammo;

		this.createMultiple({
			classType: Bullet,
			frameQuantity: ammo,
			active: false,
			visible: false,
			key: 'bullet'
		})
	}

	fire(x, y, flipX) {
		const bullet = this.getFirstDead(false);
		if (bullet) {
			this.ammo -= 1;
			bullet.fire(x, y, flipX);
		}
	}

}