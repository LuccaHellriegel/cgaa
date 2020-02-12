import { Circle } from "./Circle";
import { damageable } from "../base/interfaces";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { Annotator } from "../base/Annotator";
import { EnvSetup } from "../setup/EnvSetup";
import { EventSetup } from "../setup/EventSetup";

export class InteractionCircle extends Circle implements damageable {
	healthbar: HealthBar;
	stateHandler = { spotted: null, obstacle: null };

	constructor(config) {
		super(config);
		this.healthbar = config.healthbar;
		Annotator.annotate(this, "immovable");
		this.setSize(EnvSetup.gridPartSize, EnvSetup.gridPartSize);
	}

	damage(amount) {
		super.damage(amount);
		if (this.healthbar.decrease(amount)) {
			this.destroy();
		}
	}

	destroy() {
		EventSetup.destroyInteractionCircle(this.scene, this.campID);
		super.destroy();
		this.healthbar.bar.destroy();
		this.weapon.destroy();
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.healthbar.move(this.x, this.y);
	}
}
