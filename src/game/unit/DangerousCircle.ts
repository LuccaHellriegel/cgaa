import { Circle } from "./Circle";
import { damageable, poolable } from "../base/interfaces";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { CircleControl } from "../ai/CircleControl";
import { Point } from "../base/types";
import { EnemySize } from "./CircleFactory";
import { Gameplay } from "../../scenes/Gameplay";
import { CampID } from "../setup/CampSetup";
import { ChainWeapon } from "../weapon/ChainWeapon";

export class DangerousCircle extends Circle implements damageable, poolable {
	healthbar: HealthBar;
	pathArr: Point[];
	stateHandler: CircleControl;

	constructor(
		scene: Gameplay,
		x: number,
		y: number,
		texture: string,
		campID: CampID,
		weapon: ChainWeapon,
		physicsGroup: Phaser.Physics.Arcade.Group,
		size: EnemySize,
		healthbar: HealthBar,
		public velo: number
	) {
		super(scene, x, y, texture, campID, weapon, physicsGroup);
		this.healthbar = healthbar;
		this.stateHandler = new CircleControl(this);

		//Needed for gaining souls
		this.type = size;
	}

	damage(amount) {
		if (this.healthbar.decrease(amount)) {
			this.poolDestroy();
		} else {
			super.damage(amount);
		}
	}

	destroy() {
		super.destroy();
		this.weapon.destroy();
		this.healthbar.bar.destroy();
	}

	poolDestroy() {
		this.scene.events.emit("inactive-" + this.id, this.id);
		this.disableBody(true, true);
		this.setPosition(-1000, -1000);
		this.healthbar.bar.setActive(false).setVisible(false);
		this.healthbar.value = this.healthbar.defaultValue;

		//Weapon should not be reused until I finish implementing the circle pool
		this.weapon.disableBody(false, true);
	}

	poolActivate(x, y) {
		this.enableBody(true, x, y, true, true);
		this.healthbar.bar.setActive(true).setVisible(true);
		this.healthbar.move(x, y);
		this.weapon.enableBody(true, x, y, true, true);
		this.stateHandler.lastPositions.push({ x, y });
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.healthbar.move(this.x, this.y);
		this.stateHandler.tick();
	}

	heal(amount: number) {
		this.healthbar.increase(amount);
	}
}
