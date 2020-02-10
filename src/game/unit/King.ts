import { Path } from "../path/Path";
import { EnemyState } from "./EnemyState";
import { damageable } from "../base/interfaces";
import { Circle } from "./Circle";
import { HealthBar } from "../ui/HealthBar";
import { CampID } from "../setup/CampSetup";
import { EnemyConfig } from "./CircleFactory";

//TODO: remove duplication from EnemyCircle
export class King extends Circle implements damageable {
	healthbar: HealthBar;
	path: Path;
	campID: CampID;
	barrier: any;
	stateHandler: EnemyState;

	constructor(config: EnemyConfig, public velo: number) {
		super(config);
		this.healthbar = config.healthbar;
		//TODO: remove path, make stateHandler more general
		this.stateHandler = new EnemyState(this);
		this.state = "guard";
	}

	damage(amount) {
		if (this.healthbar.decrease(amount)) {
			//TODO: win Game
			console.log("here");
			this.scene.events.emit("win");
			this.destroy();
		} else {
			super.damage(amount);
		}
	}

	destroy() {
		super.destroy();
		this.weapon.destroy();
		this.healthbar.bar.destroy();
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.healthbar.move(this.x, this.y);
		this.stateHandler.execute();
	}
}
