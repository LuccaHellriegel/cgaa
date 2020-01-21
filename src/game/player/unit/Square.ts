import { damageable } from "../../base/interfaces";
import { HealthBar } from "../../base/ui/HealthBar";
import { RectPolygon } from "../../base/polygons/RectPolygon";
import { gridPartHalfSize } from "../../base/globals/globalSizes";
import { extendWithNewId } from "../../base/id";
import { Image } from "../../base/classes/BasePhaser";
import { removeEle } from "../../base/utils";
import { Gameplay } from "../../../scenes/Gameplay";
import { HealthBarFactory } from "../../base/ui/HealthBarFactory";

//TODO: make this a buyable healing tower
export class Square extends Image implements damageable {
	healthbar: HealthBar;
	id: string;
	polygon: RectPolygon;
	color: string;

	constructor(scene: Gameplay, x, y, physicsGroup) {
		super({ scene, x, y, texture: "square", physicsGroup });

		this.initGraphics();

		this.healthbar = HealthBarFactory.createSquareHealthBar(scene, x, y);

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
		this.setImmovable(true);
		this.color = "blue";
		extendWithNewId(this);
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
