import { UnitSetup } from "../../setup/UnitSetup";
import { TowerSetup } from "../../setup/TowerSetup";

export class Bullets extends Phaser.Physics.Arcade.Group {
	constructor(scene) {
		super(scene.physics.world, scene);

		this.maxSize = TowerSetup.maxShooters * TowerSetup.maxBullets;

		this.createMultiple({
			frameQuantity: TowerSetup.maxShooters * 2,
			key: "bullet",
			active: false,
			visible: false,
			classType: Bullet
		});
	}

	fireBullet(x, y, goalX, goalY) {
		let bullet = this.getFirstDead(false);

		if (bullet) {
			bullet.shoot(x, y, goalX, goalY);
		}
	}
}

export class Bullet extends Phaser.Physics.Arcade.Sprite {
	goalX: number;
	goalY: number;
	amount: number = TowerSetup.bulletDamage;

	constructor(scene, x, y) {
		super(scene, x, y, "bullet");
	}

	shoot(x, y, goalX, goalY) {
		this.body.reset(x, y);
		this.setActive(true);
		this.setVisible(true);
		this.goalX = goalX;
		this.goalY = goalY;
	}

	hitTarget() {
		this.setActive(false);
		this.setVisible(false);
		this.setVelocity(0, 0);
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		if (this.goalX) {
			let dist = Phaser.Math.Distance.Between(this.x, this.y, this.goalX, this.goalY);
			if (dist > UnitSetup.normalCircleRadius) {
				this.scene.physics.moveTo(this, this.goalX, this.goalY, 185);
			} else {
				this.hitTarget();
			}
		}
	}
}
