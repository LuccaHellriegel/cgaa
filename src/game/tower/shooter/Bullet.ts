import { UnitSetup } from "../../setup/UnitSetup";
import { TowerSetup } from "../../setup/TowerSetup";
import { Shooter } from "./Shooter";
import { Gameplay } from "../../../scenes/Gameplay";

export class Bullets extends Phaser.Physics.Arcade.Group {
	constructor(scene) {
		super(scene.physics.world, scene);

		this.maxSize = TowerSetup.maxShooters * TowerSetup.maxBullets;

		this.createMultiple({
			frameQuantity: TowerSetup.maxShooters * 2,
			key: "bullet",
			active: false,
			visible: false,
			classType: Bullet,
		});
	}

	fireBullet(x, y, goalX, goalY, shooter: Shooter) {
		let bullet = this.getFirstDead(true);
		bullet.shoot(x, y, goalX, goalY, shooter);
	}
}

export class Bullet extends Phaser.Physics.Arcade.Sprite {
	goalX: number;
	goalY: number;
	amount: number = TowerSetup.bulletDamage;
	owner: Shooter;
	scene: Gameplay;

	constructor(scene, x, y) {
		super(scene, x, y, "bullet");
	}

	shoot(x, y, goalX, goalY, shooter) {
		this.enableBody(true, x, y, true, true);
		this.goalX = goalX;
		this.goalY = goalY;
		this.owner = shooter;
	}

	hitTarget() {
		this.disableBody(true, true);
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		if (this.goalX) {
			let dist = Phaser.Math.Distance.Between(this.x, this.y, this.goalX, this.goalY);
			if (dist > UnitSetup.normalCircleRadius) {
				this.scene.physics.moveTo(this, this.goalX, this.goalY, TowerSetup.bulletSpeed);
			} else {
				this.hitTarget();
			}
		}
	}
}
