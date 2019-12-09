import { Area } from "../areas/Area";
import { EnemyConfig } from "./units/EnemyFactory";
import { AreaPopulator } from "./populators/AreaPopulator";
import { BuildingPopulator } from "./populators/BuildingPopulator";
import { SpawnManager } from "./spawn/SpawnManager";
import { PathManager } from "./path/PathManager";

export class Camp {
	color: string;
	area: Area;
	buildingPopulators: BuildingPopulator[] = [];
	areaPopulator: AreaPopulator;
	numbOfBuildings = 2;

	constructor(scene, area, spawnManager: SpawnManager, pathManager: PathManager, enemyPhysicGroup, weaponPhysicGroup) {
		let enemyConfig: EnemyConfig = {
			scene,
			color: area.color,
			size: "Big",
			x: 0,
			y: 0,
			weaponType: "rand",
			physicsGroup: enemyPhysicGroup,
			weaponGroup: weaponPhysicGroup
		};
		area.buildBuildings(this.numbOfBuildings);
		this.areaPopulator = new AreaPopulator(enemyConfig, area, spawnManager);
		area.buildings.forEach(building => {
			this.buildingPopulators.push(new BuildingPopulator(enemyConfig, building, spawnManager, pathManager));
		});
	}
	spawnUnits() {
		this.areaPopulator.startPopulating();
		this.buildingPopulators.forEach(populator => populator.startPopulating());
	}
}
