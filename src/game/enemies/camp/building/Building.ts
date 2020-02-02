import { Image } from "../../../base/classes/BasePhaser";
import { Gameplay } from "../../../../scenes/Gameplay";
import { damageable } from "../../../base/interfaces";
import { HealthBar } from "../../../base/ui/HealthBar";
import { RectPolygon } from "../../../base/polygons/RectPolygon";
import { Buildings } from "./Buildings";
import { HealthBarFactory } from "../../../base/ui/HealthBarFactory";
import { Annotator } from "../../../base/classes/Annotator";

export class Building extends Image implements damageable {
	id: string;
	polygon: any;
	public healthbar: HealthBar;

	constructor(scene: Gameplay, x, y, physicsGroup, spawnUnit, color: string, private buildings: Buildings) {
		super({ scene, x, y, texture: color + spawnUnit + "Building", physicsGroup });

		this.healthbar = HealthBarFactory.createBuildingHealthBar(scene, x, y);

		this.polygon = new RectPolygon(x, y, this.width, this.height);

		Annotator.annotate(this, "id", "immovable");
	}

	damage(amount: number) {
		if (this.healthbar.decrease(amount)) {
			(this.scene as Gameplay).cgaa.interactionModus.notifyRemovalOfEle(this);
			this.buildings.remove(this);
			this.destroy();
		}
	}

	destroy() {
		super.destroy();
		this.healthbar.destroy();
	}

	syncPolygon() {}
}
