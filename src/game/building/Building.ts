import { damageable } from "../base/interfaces";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { Gameplay } from "../../scenes/Gameplay";
import { HealthBarFactory } from "../ui/healthbar/HealthBarFactory";
import { CampID } from "../setup/CampSetup";
import { EventSetup } from "../setup/EventSetup";
import { addToScene } from "../base/phaser";
import { addID } from "../base/data";

export class Building extends Phaser.Physics.Arcade.Image implements damageable {
	id: string;
	polygon: any;
	healthbar: HealthBar;
	scene: Gameplay;

	constructor(scene: Gameplay, x, y, addBuildingToPhysics, public spawnUnit, public campID: CampID) {
		super(scene, x, y, Building.buildingTexture(campID, spawnUnit));
		addBuildingToPhysics(this);
		addToScene(this, scene);
		addID(this);

		this.setImmovable(true);

		this.healthbar = HealthBarFactory.createBuildingHealthBar(scene, x, y);

		//Needed for gaining souls
		this.type = spawnUnit;
	}

	static buildingTexture(campID, spawnUnit) {
		return campID + spawnUnit + "Building";
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
