import { Circle } from "../../../base/classes/Circle";
import { damageable } from "../../../base/interfaces";
import { HealthBar } from "../../../base/classes/HealthBar";
import { removeEle } from "../../../base/utils";
import { Gameplay } from "../../../../scenes/Gameplay";

export class InteractionCircle extends Circle implements damageable {
	healthbar: HealthBar;
	color: string;

	constructor(config) {
		super(config);
		this.healthbar = config.healthbar;
		this.color = config.color;
	}

	damage(amount) {
		super.damage(amount);
		if (this.healthbar.decrease(amount)) {
			removeEle(this, (this.scene as Gameplay).cgaa.interactionElements);
			(this.scene as Gameplay).cgaa.interactionModus.notifyRemovalOfEle(this);
			this.destroy();
		}
	}

	destroy() {
		super.destroy();
		this.healthbar.bar.destroy();
		this.weapon.destroy();
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.healthbar.move(this.x, this.y);
	}
}
