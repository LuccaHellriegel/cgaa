import { Image } from "../../../base/classes/BasePhaser";
import { Gameplay } from "../../../../scenes/Gameplay";
import { damageable } from "../../../base/interfaces";
import { HealthBar } from "../../../base/classes/HealthBar";
import { RectPolygon } from "../../../base/polygons/RectPolygon";
import { removeEle } from "../../../base/utils";
import { extendWithNewId } from "../../../base/id";
import { Buildings } from "./Buildings";

export interface BuildingSpawnConfig {
	enemyPhysicGroup: Phaser.Physics.Arcade.Group;
	weaponPhysicGroup: Phaser.Physics.Arcade.Group;
}

export class Building extends Image implements damageable {
	id: string;
	polygon: any;

	constructor(
		scene: Gameplay,
		x,
		y,
		physicsGroup,
		spawnUnit,
		private color: string,
		public healthbar: HealthBar,
		private campBuildings: Buildings
	) {
		super({ scene, x, y, texture: color + spawnUnit + "Building", physicsGroup });
		this.setImmovable(true);

		this.polygon = new RectPolygon(x, y, this.width, this.height);

		extendWithNewId(this);
		scene.cgaa.interactionElements.push(this);
	}

	damage(amount: number) {
		if (this.healthbar.decrease(amount)) {
			removeEle(this, (this.scene as Gameplay).cgaa.interactionElements);
			(this.scene as Gameplay).cgaa.interactionModus.notifyRemovalOfEle(this);

			this.campBuildings.remove(this);

			if (this.campBuildings.areDestroyed()) {
				this.scene.events.emit("destroyed-" + this.color);
			}
			this.destroy();
		}
	}

	destroy() {
		super.destroy();
		this.healthbar.destroy();
	}

	syncPolygon() {}
}
