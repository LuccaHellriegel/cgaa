import { damageable } from "../../0_GameBase/engine/interfaces";
import { HealthBar } from "../healthbar/HealthBar";
import { Gameplay } from "../../../scenes/Gameplay";
import { CampID } from "../../0_GameBase/setup/CampSetup";
import { addToScene } from "../../0_GameBase/engine/phaser";
import { addID } from "../../0_GameBase/engine/data";
import { HealthBarFactory } from "../healthbar/HealthBarFactory";
import { EventSetup } from "../../0_GameBase/setup/EventSetup";

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
		this.scene.events.emit(EventSetup.unitKilledEvent, this.campID);
		EventSetup.destroyBuilding(this.scene, this.campID, this.id);
		super.destroy();
		this.healthbar.destroy();
	}
}
