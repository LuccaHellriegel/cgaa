import { Image } from "../../base/classes/BasePhaser";
import { Gameplay } from "../../../scenes/Gameplay";
import { damageable } from "../../base/interfaces";
import { HealthBar } from "../../base/classes/HealthBar";
import { RectPolygon } from "../../base/polygons/RectPolygon";
import { removeEle, addToInteractionElements, removeFromInteractionElements } from "../../base/events/elements";
import { BuildingPopulator } from "../populators/BuildingPopulator";
import { createBuildingEnemySpawnObj } from "../../base/spawn/spawn";
import { EnemyConfig } from "./EnemyFactory";
import { realCoordinateToRelative } from "../../base/position";

export interface BuildingSpawnConfig {
	enemyDict;
	pathDict;
	enemyPhysicGroup: Phaser.Physics.Arcade.Group;
	weaponPhysicGroup: Phaser.Physics.Arcade.Group;
}

export class Building extends Image implements damageable {
	healthbar: HealthBar;
	id: string;
	color: string;
	spawnUnit: any;
	polygon: any;
	populator: BuildingPopulator;

	constructor(
		scene: Gameplay,
		x,
		y,
		physicsGroup,
		spawnUnit,
		color: string,
		healthbar: HealthBar,
		config: BuildingSpawnConfig
	) {
		super({ scene, x, y, texture: color + spawnUnit + "Building", physicsGroup });
		this.color = color;
		this.spawnUnit = spawnUnit;
		this.setImmovable(true);

		this.polygon = new RectPolygon(x, y, this.width, this.height);
		this.healthbar = healthbar;

		let enemySpawnObj = createBuildingEnemySpawnObj(
			realCoordinateToRelative(x),
			realCoordinateToRelative(y),
			config.enemyDict
		);
		let enemyConfig: EnemyConfig = {
			scene,
			color,
			size: "Big",
			x: -100,
			y: -100,
			weaponType: "rand",
			physicsGroup: config.enemyPhysicGroup,
			weaponGroup: config.weaponPhysicGroup
		};
		this.populator = new BuildingPopulator(enemyConfig, enemySpawnObj, config.pathDict);

		addToInteractionElements(scene, this);
	}

	damage(amount: number) {
		if (this.healthbar.decrease(amount)) {
			removeFromInteractionElements(this.scene, this);
			removeEle(this.scene, "building", this);
			this.destroy();
		}
	}

	destroy() {
		super.destroy();
		this.healthbar.destroy();
		this.populator.destroy();
		this.populator = undefined;
	}

	syncPolygon() {}
}
