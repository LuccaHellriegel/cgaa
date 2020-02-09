import { Circle } from "./Circle";
import { damageable } from "../base/interfaces";
import { HealthBar } from "../ui/HealthBar";
import { EnemyState } from "./EnemyState";
import { PoolHelper } from "../pool/PoolHelper";
import { Point } from "../base/types";

export class EnemyCircle extends Circle implements damageable {
	healthbar: HealthBar;
	pathArr: Point[];
	barrier: any;
	stateHandler: EnemyState;

	constructor(config, public velo: number) {
		super(config);
		this.healthbar = config.healthbar;
		this.stateHandler = new EnemyState(this);
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
		PoolHelper.destroyEnemyCircle(this);
	}

	poolActivate(x, y) {
		PoolHelper.activateEnemyCircle(this, x, y);
		this.stateHandler.lastPositions.push({ x, y });
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.healthbar.move(this.x, this.y);
		this.stateHandler.execute();
	}

	//TODO: not "EnemyCircle" anymore, maybe Circle with State and Health?
	needsHealing() {
		return this.healthbar.value !== this.healthbar.defaultValue;
	}

	heal(amount: number) {
		this.healthbar.increase(amount);
	}
}
