import { damageable } from "../../base/interfaces";
import { HealthBar } from "../../base/classes/HealthBar";
import { RectPolygon } from "../../base/polygons/RectPolygon";
import { gridPartHalfSize } from "../../base/globals/globalSizes";
import { extendWithNewId } from "../../base/id";
import { Image } from "../../base/classes/BasePhaser";
import { removeEle } from "../../base/utils";
import { Gameplay } from "../../../scenes/Gameplay";

export class Square extends Image implements damageable {
	healthbar: HealthBar;
	id: string;
	polygon: RectPolygon;
	color: string;

	constructor(scene: Gameplay, x, y, physicsGroup) {
		super({ scene, x, y, texture: "square", physicsGroup });
		this.setImmovable(true);

		this.polygon = new RectPolygon(
			x + scene.cameras.main.scrollX,
			y + scene.cameras.main.scrollY,
			2 * gridPartHalfSize,
			2 * gridPartHalfSize
		);

		this.setSize(this.polygon.width, this.polygon.height);

		this.healthbar = new HealthBar(x, y, {
			scene,
			posCorrectionX: -26,
			posCorrectionY: -38,
			healthWidth: 46,
			healthLength: 12,
			value: 100
		});
		this.healthbar.move(x, y);

		this.color = "blue";
		extendWithNewId(this);
		scene.cgaa.interactionElements.push(this);
	}

	damage(amount: number) {
		if (this.healthbar.decrease(amount)) {
			removeEle(this, (this.scene as Gameplay).cgaa.interactionElements);
			this.destroy();
		}
	}

	syncPolygon() {
		this.polygon.setPosition(this.x, this.y);
	}

	destroy() {
		this.healthbar.destroy();
		super.destroy();
	}
}