import { Path } from "../path/Path";
import { CircleControl } from "../ai/CircleControl";
import { damageable } from "../base/interfaces";
import { Circle } from "./Circle";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { CampID } from "../setup/CampSetup";
import { EnemyConfig } from "./CircleFactory";
import { GuardComponent } from "../ai/GuardComponent";

//TODO: remove duplication from DangerousCircle
export class King extends Circle implements damageable {
	healthbar: HealthBar;
	path: Path;
	campID: CampID;
	stateHandler: CircleControl;

	constructor(config: EnemyConfig, public velo: number) {
		super(config);
		this.healthbar = config.healthbar;
		//TODO: remove path, make stateHandler more general
		this.stateHandler = new CircleControl(this);
		this.stateHandler.setComponents([new GuardComponent(this, this.stateHandler)]);

		this.type = config.size;
	}

	damage(amount) {
		if (this.healthbar.decrease(amount)) {
			//TODO: win Game
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
		this.stateHandler.tick();
	}
}
