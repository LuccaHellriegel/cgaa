import { Image } from "../base/BasePhaser";
import { damageable } from "../base/interfaces";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { Gameplay } from "../../scenes/Gameplay";
import { HealthBarFactory } from "../ui/healthbar/HealthBarFactory";
import { RectPolygon } from "../polygons/RectPolygon";
import { Annotator } from "../base/Annotator";
import { CampID } from "../setup/CampSetup";
import { EventSetup } from "../setup/EventSetup";

export class Building extends Image implements damageable {
	id: string;
	polygon: any;
	healthbar: HealthBar;
	scene: Gameplay;

	constructor(scene: Gameplay, x, y, physicsGroup, public spawnUnit, public campID: CampID) {
		super({ scene, x, y, texture: campID + spawnUnit + "Building", physicsGroup });

		this.healthbar = HealthBarFactory.createBuildingHealthBar(scene, x, y);

		this.polygon = new RectPolygon(x, y, this.width, this.height);

		Annotator.annotate(this, "id", "immovable");
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

	syncPolygon() {}
}
