import { damageable, poolable } from "../../../base/interfaces";
import { HealthBar } from "../../../base/ui/HealthBar";
import { RectPolygon } from "../../../base/polygons/RectPolygon";
import { gridPartHalfSize } from "../../../base/globals/globalSizes";
import { Image } from "../../../base/classes/BasePhaser";
import { Gameplay } from "../../../../scenes/Gameplay";
import { HealthBarFactory } from "../../../base/ui/HealthBarFactory";
import { Annotator } from "../../../base/classes/Annotator";
import { HealerPool } from "./HealerPool";

//TODO: make this a buyable healing shooter
export class Healer extends Image implements damageable, poolable {
	healthbar: HealthBar;
	id: string;
	polygon: RectPolygon;
	color: string;

	constructor(scene: Gameplay, x, y, physicsGroup) {
		super({ scene, x, y, texture: "healer", physicsGroup });

		this.initGraphics();

		this.healthbar = HealthBarFactory.createHealerHealthBar(scene, x, y);

		this.initUnitStats();
	}

	private initGraphics() {
		this.polygon = new RectPolygon(
			this.x + this.scene.cameras.main.scrollX,
			this.y + this.scene.cameras.main.scrollY,
			2 * gridPartHalfSize,
			2 * gridPartHalfSize
		);

		this.setSize(this.polygon.width, this.polygon.height);
	}

	private initUnitStats() {
		Annotator.annotate(this, "id", "immovable");
		this.color = "blue";
	}

	syncPolygon() {
		this.polygon.setPosition(this.x, this.y);
	}

	destroy() {
		this.healthbar.destroy();
		super.destroy();
	}

	damage(amount: number) {
		if (this.healthbar.decrease(amount)) {
			HealerPool.poolDestroy(this);
		}
	}
}
