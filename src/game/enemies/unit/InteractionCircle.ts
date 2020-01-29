import { Circle } from "../../base/classes/Circle";
import { damageable } from "../../base/interfaces";
import { HealthBar } from "../../base/ui/HealthBar";
import { Gameplay } from "../../../scenes/Gameplay";
import { Annotator } from "../../base/classes/Annotator";
import { gridPartHalfSize } from "../../base/globals/globalSizes";

export class InteractionCircle extends Circle implements damageable {
	healthbar: HealthBar;
	color: string;

	constructor(config) {
		super(config);
		this.healthbar = config.healthbar;
		this.color = config.color;
		Annotator.annotate(this, "immovable");
		this.setSize(2 * gridPartHalfSize, 2 * gridPartHalfSize);
	}

	damage(amount) {
		super.damage(amount);
		if (this.healthbar.decrease(amount)) {
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
