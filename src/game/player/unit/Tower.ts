import { Image } from "../../base/classes/BasePhaser";
import { damageable, poolable } from "../../base/interfaces";
import { healable } from "../../collision/HealerAura";
import { HealthBar } from "../../base/ui/HealthBar";
import { RectPolygon } from "../../base/polygons/RectPolygon";
import { Gameplay } from "../../../scenes/Gameplay";
import { HealthBarFactory } from "../../base/ui/HealthBarFactory";
import { Annotator } from "../../base/classes/Annotator";
import { gridPartHalfSize } from "../../base/globals/globalSizes";

//TODO: maybe allow Towers in Enemy camp again if they are expensive enough?
export abstract class Tower extends Image implements damageable, poolable, healable {
	healthbar: HealthBar;
	id: string;
	polygon: RectPolygon;
	color: string;

	constructor(scene: Gameplay, x, y, texture, physicsGroup: Phaser.Physics.Arcade.StaticGroup) {
		super({ scene, x, y, texture, physicsGroup });
		this.initUnitStats();
		this.healthbar = HealthBarFactory.createTowerHealthBar(scene, x, y);
	}

	private initUnitStats() {
		Annotator.annotate(this, "id", "immovable");

		this.polygon = new RectPolygon(
			this.x + this.scene.cameras.main.scrollX,
			this.y + this.scene.cameras.main.scrollY,
			2 * gridPartHalfSize,
			2 * gridPartHalfSize
		);
		this.color = "blue";
		this.setSize(this.polygon.width, this.polygon.height);
	}

	abstract damage(amount: number);

	destroy() {
		this.healthbar.destroy();
		super.destroy();
	}

	syncPolygon() {
		this.polygon.setPosition(this.x, this.y);
	}

	needsHealing() {
		return this.healthbar.value !== this.healthbar.defaultValue;
	}

	heal(amount: number) {
		this.healthbar.increase(amount);
	}
}
