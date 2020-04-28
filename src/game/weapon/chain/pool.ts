import { ChainWeapon } from "./weapon";
import { unitAmountConfig } from "./const";

export class ChainWeapons extends Phaser.Physics.Arcade.Group {
	constructor(scene, private ownerSizeName, amount) {
		super(scene.physics.world, scene);
		this.createMultiple({
			frameQuantity: amount,
			key: ownerSizeName + "chainWeapon",
			active: false,
			visible: false,
			classType: ChainWeapon,
		});
		this.getChildren().forEach((child) => (child as Phaser.Physics.Arcade.Sprite).disableBody());
	}

	placeWeapon(x, y) {
		let weapon: ChainWeapon = this.getFirstDead(true);

		if (weapon.initialized) {
			weapon.enable(x, y);
		} else {
			weapon.init(this.ownerSizeName, x, y, unitAmountConfig[this.ownerSizeName].amount);
		}
		return weapon;
	}
}
