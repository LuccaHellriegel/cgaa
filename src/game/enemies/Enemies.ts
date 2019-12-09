import { EnemyCircle } from "./units/EnemyCircle";
import { getRelativePosOfElements, getRelativePosOfElementsAndAroundElements } from "../base/position";
import { Area } from "../areas/Area";
import { EnemyConfig } from "./units/EnemyFactory";
import { AreaPopulator } from "./populators/AreaPopulator";
import { BuildingPopulator } from "./populators/BuildingPopulator";
import { Areas } from "../areas/Areas";

export class Enemies {
	enemyPhysicGroups = {};
	weaponPhysicGroups = {};
	units: EnemyCircle[] = [];

	constructor(scene, enemyPhysicGroups, weaponPhysicGroups) {
		this.enemyPhysicGroups = enemyPhysicGroups;
		this.weaponPhysicGroups = weaponPhysicGroups;
		this.setupEventListeners(scene);
	}

	private setupEventListeners(scene) {
		scene.events.on("enemy-spawned", (enemy: EnemyCircle) => {
			this.units.push(enemy);
		});
	}

	getRelativeEnemyPositions() {
		return getRelativePosOfElements(this.units);
	}

	getRelativeEnemyPositionsAndAroundEnemyPositions() {
		return getRelativePosOfElementsAndAroundElements(this.units, 1, 1);
	}

	spawnUnits(scene, areas: Areas, spawnManager, pathManager) {
		let areasWithBuildings = areas.getAreaWithBuildings();
		areasWithBuildings.forEach((area: Area) => {
			let enemyPhysicGroup = this.enemyPhysicGroups[area.color];
			let weaponPhysicGroup = this.weaponPhysicGroups[area.color];
			//TODO: is a share config, wtf?
			let enemyConfig: EnemyConfig = {
				scene,
				color: area.color,
				size: "Normal",
				x: 0,
				y: 0,
				weaponType: "rand",
				physicsGroup: enemyPhysicGroup,
				weaponGroup: weaponPhysicGroup
			};
			new AreaPopulator(enemyConfig, area, spawnManager).startPopulating();
			area.buildings.forEach(building => {
				new BuildingPopulator(enemyConfig, building, spawnManager, pathManager).startPopulating();
			});
		});
	}
}
