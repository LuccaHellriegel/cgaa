import { Circle } from "./Circle";
import { damageable } from "../base/interfaces";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { EnvSetup } from "../setup/EnvSetup";
import { EventSetup } from "../setup/EventSetup";
import { Gameplay } from "../../scenes/Gameplay";
import { CampID } from "../setup/CampSetup";
import { ChainWeapon } from "../weapon/ChainWeapon";
import { EnemySize } from "./CircleFactory";

export class InteractionCircle extends Circle implements damageable {
	healthbar: HealthBar;
	stateHandler = { spotted: null, obstacle: null };

	constructor(
		scene: Gameplay,
		x: number,
		y: number,
		texture: string,
		campID: CampID,
		weapon: ChainWeapon,
		physicsGroup: Phaser.Physics.Arcade.Group,
		size: EnemySize,
		healthbar: HealthBar
	) {
		super(scene, x, y, texture, campID, weapon, physicsGroup);
		this.healthbar = healthbar;
		this.setImmovable(true);
		this.setSize(EnvSetup.gridPartSize, EnvSetup.gridPartSize);

		//Needed for gaining souls
		this.type = size;
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
