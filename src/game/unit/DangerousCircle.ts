import { Circle } from "./Circle";
import { damageable } from "../base/interfaces";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { CircleControl } from "../ai/CircleControl";
import { PoolHelper } from "../pool/PoolHelper";
import { Point } from "../base/types";
import { EnemyConfig } from "./CircleFactory";

export class DangerousCircle extends Circle implements damageable {
	healthbar: HealthBar;
	pathArr: Point[];
	barrier: any;
	stateHandler: CircleControl;

	constructor(config: EnemyConfig, public velo: number) {
		super(config);
		this.healthbar = config.healthbar;
		this.stateHandler = new CircleControl(this);
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
		PoolHelper.destroyDangerousCircle(this);
	}

	poolActivate(x, y) {
		PoolHelper.activateDangerousCircle(this, x, y);
		this.stateHandler.lastPositions.push({ x, y });
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.healthbar.move(this.x, this.y);
		this.stateHandler.tick();
	}

	needsHealing() {
		return this.healthbar.value !== this.healthbar.defaultValue;
	}

	heal(amount: number) {
		this.healthbar.increase(amount);
	}
}
