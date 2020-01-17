import { Image } from "../../base/classes/BasePhaser";
import { Gameplay } from "../../../scenes/Gameplay";
import { damageable } from "../../base/interfaces";
import { HealthBar } from "../../base/classes/HealthBar";
import { RectPolygon } from "../../base/polygons/RectPolygon";
import { createBuildingEnemySpawnObj } from "../../base/spawn/spawn";
import { realCoordinateToRelative } from "../../base/position";
import { removeEle } from "../../base/utils";
import { extendWithNewId } from "../../base/id";
import { CampBuildings } from "./CampBuildings";
import { WavePopulator } from "../wave/WavePopulator";
import { EnemyPool } from "../population/EnemyPool";
import { buildingGroupComposition } from "../wave/waveConfig";

export interface BuildingSpawnConfig {
	enemyPhysicGroup: Phaser.Physics.Arcade.Group;
	weaponPhysicGroup: Phaser.Physics.Arcade.Group;
}

export class Building extends Image implements damageable {
	healthbar: HealthBar;
	id: string;
	color: string;
	spawnUnit: any;
	polygon: any;

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

		extendWithNewId(this);

		new WavePopulator(
			scene,
			color,
			new EnemyPool(
				scene,
				1,
				buildingGroupComposition,

				{
					scene,
					color,
					size: "Big",
					x: 100,
					y: 100,
					weaponType: "rand",
					physicsGroup: config.enemyPhysicGroup,
					weaponGroup: config.weaponPhysicGroup
				}
			),
			createBuildingEnemySpawnObj(realCoordinateToRelative(x), realCoordinateToRelative(y), scene)
		);

		scene.cgaa.interactionElements.push(this);
	}

	damage(amount: number) {
		if (this.healthbar.decrease(amount)) {
			removeEle(this, (this.scene as Gameplay).cgaa.interactionElements);
			(this.scene as Gameplay).cgaa.interactionModus.notifyRemovalOfEle(this);

			let buildings: CampBuildings = (this.scene as Gameplay).cgaa.camps[this.color].buildings;
			buildings.remove(this);

			if (buildings.areDestroyed()) {
				this.scene.events.emit("destroyed-" + this.color);
				removeEle(this.color, (this.scene as Gameplay).cgaa.activeCamps);
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
