import { damageable } from "../engine/interfaces";
import { HealthBar } from "../healthbar/HealthBar";
import { Gameplay } from "../scenes/Gameplay";
import { addToScene } from "../engine/phaser";
import { addID } from "../engine/id";
import { BuildingSetup } from "../config/BuildingSetup";
import { CampID } from "../config/CampSetup";
import { EventSetup } from "../config/EventSetup";

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

		this.healthbar = new HealthBar(x - 25, y - BuildingSetup.halfBuildingHeight, {
			posCorrectionX: 0,
			posCorrectionY: 0,
			healthWidth: 46,
			healthLength: 12,
			value: 100,
			scene: scene,
		});

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
