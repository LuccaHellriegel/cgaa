import { Shooter } from "./Shooter";
import { Pool } from "../../../base/pool/Pool";
import { poolable } from "../../../base/interfaces";
import { Gameplay } from "../../../../scenes/Gameplay";

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
}
