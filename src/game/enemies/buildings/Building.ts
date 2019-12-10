import { Image } from "../../base/classes/BasePhaser";
import { Gameplay } from "../../../scenes/Gameplay";
import { damageable } from "../../base/interfaces";
import { HealthBar } from "../../base/classes/HealthBar";
import { RectPolygon } from "../../base/polygons/RectPolygon";
import { rectBuildinghalfHeight } from "../../../globals/globalSizes";

export class Building extends Image implements damageable {
	healthbar: HealthBar;
	id: string;
	color: string;
	spawnUnit: any;
	health;
	polygon: any;
	destroyed = false;

	constructor(scene: Gameplay, x, y, physicsGroup, spawnUnit, color: string) {
		super({ scene, x, y, texture: color + spawnUnit + "Building", physicsGroup });
		this.color = color;
		this.spawnUnit = spawnUnit;
		this.setImmovable(true);

		this.polygon = new RectPolygon(x, y, this.width, this.height);
		this.healthbar = new HealthBar(x - 25, y - rectBuildinghalfHeight, {
			posCorrectionX: 0,
			posCorrectionY: -rectBuildinghalfHeight,
			healthWidth: 46,
			healthLength: 12,
			value: 100,
			scene
		});
		scene.events.emit("interaction-ele-added", this);
	}

	damage(amount: number) {
		if (this.healthbar.decrease(amount)) {
			this.scene.events.emit("interaction-ele-removed", this);
			this.destroy();
		}
	}

	destroy() {
		this.destroyed = true;
		super.destroy();
		this.healthbar.destroy();
	}

	syncPolygon() {}
}
