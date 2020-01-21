import { HealthBar } from "../../base/ui/HealthBar";
import { Circle } from "../../base/classes/Circle";
import { damageable } from "../../base/interfaces";
import { PoolHelper } from "../../base/pool/PoolHelper";
import { EnemyState } from "./EnemyState";
import { Path } from "../path/Path";

export class EnemyCircle extends Circle implements damageable {
	healthbar: HealthBar;
	path: Path;
	color: string;
	barrier: any;
	stateHandler: EnemyState;

	constructor(config, public velo: number) {
		super(config);
		this.healthbar = config.healthbar;
		this.color = config.color;
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
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.healthbar.move(this.x, this.y);
		this.stateHandler.execute();
	}
}
