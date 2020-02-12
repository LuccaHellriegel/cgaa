import { Healer } from "../tower/healer/Healer";
import { Pool } from "./Pool";
import { Gameplay } from "../../scenes/Gameplay";
import { poolable } from "../base/interfaces";

export class HealerPool extends Pool {
	constructor(
		scene: Gameplay,
		numberOfUnits: number,
		unitGroup: Phaser.Physics.Arcade.StaticGroup,
		private healingGroup: Phaser.Physics.Arcade.StaticGroup
	) {
		super(scene, numberOfUnits, unitGroup);
	}

	protected createNewUnit(): poolable {
		return new Healer(this.scene, -1000, -1000, this.unitGroup, this.healingGroup);
	}

	static poolDestroy(healer) {
		super.poolDestroy(healer);
		healer.aura.disableBody(true, true);
		healer.aura.setPosition(-1000, -1000);
		healer.aura.deactivate();
	}

	poolActivate(healer, x, y) {
		super.poolActivate(healer, x, y);
		healer.aura.enableBody(true, x, y, true, false);
		healer.aura.setVisible(false);
		healer.aura.activate();
	}
}
