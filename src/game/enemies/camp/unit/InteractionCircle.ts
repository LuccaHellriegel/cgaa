import { Circle } from "../../../base/classes/Circle";
import { damageable } from "../../../base/interfaces";
import { HealthBar } from "../../../base/classes/HealthBar";
import { removeEle } from "../../../base/utils";
import { Gameplay } from "../../../../scenes/Gameplay";

export class InteractionCircle extends Circle implements damageable {
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
		removeEle(this, (this.scene as Gameplay).cgaa.interactionElements);
		(this.scene as Gameplay).cgaa.interactionModus.notifyRemovalOfEle(this);
		super.destroy();
		this.healthbar.bar.destroy();
		this.weapon.destroy();
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.healthbar.move(this.x, this.y);
	}
}
