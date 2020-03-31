import { damageable, healable } from "../base/interfaces";
import { poolable } from "../base/interfaces";
import { HealthBar } from "../ui/healthbar/HealthBar";
import { RectPolygon } from "../polygons/RectPolygon";
import { Gameplay } from "../../scenes/Gameplay";
import { HealthBarFactory } from "../ui/healthbar/HealthBarFactory";
import { EnvSetup } from "../setup/EnvSetup";
import { CampID } from "../setup/CampSetup";

export abstract class Towers extends Phaser.Physics.Arcade.StaticGroup {
	constructor(scene) {
		super(scene.physics.world, scene);
	}

	getActiveUnits() {
		return this.getChildren().filter(child => child.active);
	}

	getActiveElements() {
		return this.getActiveUnits();
	}

	abstract placeTower(x, y);
}

//TODO: make Tower that Spawns Units that walk to boss (? walking to dynamic positions might be to complicated)
export abstract class Tower extends Phaser.Physics.Arcade.Image implements damageable, poolable, healable {
	healthbar: HealthBar;
	id: string;
	polygon: RectPolygon;
	campID: CampID;

	constructor(scene: Gameplay, x, y, texture) {
		super(scene, x, y, texture);
		this.initUnitStats();
		this.healthbar = HealthBarFactory.createTowerHealthBar(scene, x, y);
	}

	private initUnitStats() {
		//Annotator.annotate(this, "id", "immovable");

		this.polygon = new RectPolygon(
			this.x + this.scene.cameras.main.scrollX,
			this.y + this.scene.cameras.main.scrollY,
			EnvSetup.gridPartSize,
			EnvSetup.gridPartSize
		);
		this.campID = "blue";
	}

	abstract damage(amount: number);

	abstract poolDestroy();

	place(x, y, _) {
		this.enableBody(true, x, y, true, true);
		this.healthbar.bar.setActive(true).setVisible(true);
		this.healthbar.move(x, y);
		this.setImmovable(true);
		this.setSize(this.polygon.width, this.polygon.height);
	}

	destroy() {
		this.healthbar.destroy();
		super.destroy();
	}

	syncPolygon() {
		this.polygon.setPosition(this.x, this.y);
	}

	heal(amount: number) {
		this.healthbar.increase(amount);
	}
}
