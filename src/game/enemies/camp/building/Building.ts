import { Image } from "../../../base/classes/BasePhaser";
import { Gameplay } from "../../../../scenes/Gameplay";
import { damageable } from "../../../base/interfaces";
import { HealthBar } from "../../../base/ui/HealthBar";
import { RectPolygon } from "../../../base/polygons/RectPolygon";
import { removeEle } from "../../../base/utils";
import { extendWithNewId } from "../../../base/id";
import { Buildings } from "./Buildings";
import { HealthBarFactory } from "../../../base/ui/HealthBarFactory";

export interface BuildingSpawnConfig {
	enemyPhysicGroup: Phaser.Physics.Arcade.Group;
	weaponPhysicGroup: Phaser.Physics.Arcade.Group;
}

export class Building extends Image implements damageable {
	id: string;
	polygon: any;
	public healthbar: HealthBar;

	constructor(scene: Gameplay, x, y, physicsGroup, spawnUnit, color: string, private campBuildings: Buildings) {
		super({ scene, x, y, texture: color + spawnUnit + "Building", physicsGroup });

		this.healthbar = HealthBarFactory.createBuildingHealthBar(scene, x, y);

		this.setImmovable(true);

		this.polygon = new RectPolygon(x, y, this.width, this.height);

		extendWithNewId(this);
	}

	damage(amount: number) {
		if (this.healthbar.decrease(amount)) {
			(this.scene as Gameplay).cgaa.interactionModus.notifyRemovalOfEle(this);
			this.campBuildings.remove(this);
			this.destroy();
		}
	}

	destroy() {
		super.destroy();
		this.healthbar.destroy();
	}

	syncPolygon() {}
}
