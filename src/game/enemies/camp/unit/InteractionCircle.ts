import { Circle } from "../../../base/classes/Circle";
import { damageable } from "../../../base/interfaces";
import { HealthBar } from "../../../base/classes/HealthBar";
import { removeFromInteractionElements } from "../../../base/events/interaction";

export class InterationCircle extends Circle implements damageable {
	healthbar: HealthBar;
	color: string;
	dontAttackList: any[] = [];

	constructor(config) {
		super(config);
		this.healthbar = config.healthbar;
		this.color = config.color;

		config.scene.events.once("cooperation-established-" + config.color, function(cooperationColor) {
			this.dontAttackList.push(cooperationColor);
		});
	}

	damage(amount) {
		super.damage(amount);
		if (this.healthbar.decrease(amount)) {
			this.destroy();
		}
	}

	destroy() {
		removeFromInteractionElements(this.scene, this);
		super.destroy();
		this.healthbar.bar.destroy();
		this.weapon.destroy();
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.healthbar.move(this.x, this.y);
	}
}
