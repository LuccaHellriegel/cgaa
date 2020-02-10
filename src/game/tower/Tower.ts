import { Image } from "../base/BasePhaser";
import { damageable } from "../base/interfaces";
import { poolable } from "../base/interfaces";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { RectPolygon } from "../polygons/RectPolygon";
import { Gameplay } from "../../scenes/Gameplay";
import { HealthBarFactory } from "../ui/healthbar/HealthBarFactory";
import { Annotator } from "../base/Annotator";
import { EnvSetup } from "../setup/EnvSetup";
import { healable } from "../collision/HealerAura";
import { CampID } from "../setup/CampSetup";

//TODO: maybe allow Towers in Enemy camp again if they are expensive enough?
//TODO: make Tower that Spawns Units that walk to boss (? walking to dynamic positions might be to complicated)
export abstract class Tower extends Image implements damageable, poolable, healable {
	healthbar: HealthBar;
	id: string;
	polygon: RectPolygon;
	campID: CampID;

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
			EnvSetup.gridPartSize,
			EnvSetup.gridPartSize
		);
		this.campID = "blue";
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
