import { Circle } from "./Circle";
import { damageable, poolable } from "../base/interfaces";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { CircleControl } from "../ai/CircleControl";
import { PoolHelper } from "../pool/PoolHelper";
import { Point } from "../base/types";
import { EnemyConfig } from "./CircleFactory";

export class DangerousCircle extends Circle implements damageable, poolable {
	healthbar: HealthBar;
	pathArr: Point[];
	stateHandler: CircleControl;

	constructor(config: EnemyConfig, public velo: number) {
		super(config);
		this.healthbar = config.healthbar;
		this.stateHandler = new CircleControl(this);

		//Needed for gaining souls
		console.log(config.size);
		this.type = config.size;
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
		PoolHelper.genericDestroy(this);
		this.weapon.disableBody(true, true);
	}

	poolActivate(x, y) {
		PoolHelper.genericActivate(this, x, y);
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
