import { damageable } from "../base/interfaces";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { Gameplay } from "../../scenes/Gameplay";
import { HealthBarFactory } from "../ui/healthbar/HealthBarFactory";
import { CampID } from "../setup/CampSetup";
import { EventSetup } from "../setup/EventSetup";

export class Building extends Phaser.Physics.Arcade.Image implements damageable {
	id: string;
	polygon: any;
	healthbar: HealthBar;
	scene: Gameplay;

	constructor(scene: Gameplay, x, y, addBuilding, public spawnUnit, public campID: CampID) {
		super(scene, x, y, campID + spawnUnit + "Building");
		scene.add.existing(this);

		addBuilding(this);

		this.healthbar = HealthBarFactory.createBuildingHealthBar(scene, x, y);

		//Needed for gaining souls
		this.type = spawnUnit;

		this.id = "_" + Math.random().toString(36).substr(2, 9);

		this.setImmovable(true);
	}

	damage(amount: number) {
		if (this.healthbar.decrease(amount)) {
			this.destroy();
		}
	}

	destroy() {
		EventSetup.destroyBuilding(this.scene, this.campID, this.id);
		super.destroy();
		this.healthbar.destroy();
	}
}
