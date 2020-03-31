import { Shooter } from "../tower/shooter/Shooter";
import { StaticPool } from "./Pool";
import { Gameplay } from "../../scenes/Gameplay";
import { poolable } from "../base/interfaces";
import { Bullets } from "../tower/shooter/Bullet";

export class ShooterPool extends StaticPool {
	constructor(
		scene: Gameplay,
		numberOfUnits: number,
		unitGroup: Phaser.Physics.Arcade.StaticGroup,
		private bullets: Bullets
	) {
		super(scene, numberOfUnits, unitGroup);
		this.init();
	}

	protected createNewUnit(): poolable {
		return new Shooter(this.scene, -1000, -1000, this.unitGroup as Phaser.Physics.Arcade.StaticGroup, this.bullets);
	}
}
