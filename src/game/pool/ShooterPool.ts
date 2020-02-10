import { Shooter } from "../tower/shooter/Shooter";
import { Pool } from "./Pool";
import { Gameplay } from "../../scenes/Gameplay";
import { poolable } from "../base/interfaces";

//TODO: abstract TowerPool
export class ShooterPool extends Pool {
	constructor(
		scene: Gameplay,
		numberOfUnits: number,
		unitGroup: Phaser.Physics.Arcade.StaticGroup,
		private bulletGroup: Phaser.Physics.Arcade.Group
	) {
		super(scene, numberOfUnits, unitGroup);
	}

	protected createNewUnit(): poolable {
		return new Shooter(this.scene, -1000, -1000, this.unitGroup, this.bulletGroup);
	}

	static poolDestroy(shooter) {
		super.poolDestroy(shooter);
		shooter.bullets.forEach(bullet => bullet.reset());
	}

	poolActivate(shooter, x, y) {
		super.poolActivate(shooter, x, y);
		//TODO: why do I need this?
		shooter.bullets.forEach(bullet => bullet.reset());
	}
}
