import { Area } from "../areas/Area";
import { EnemyConfig } from "./units/EnemyFactory";
import { AreaPopulator } from "./populators/AreaPopulator";
import { BuildingPopulator } from "./populators/BuildingPopulator";
import { SpawnManager } from "./spawn/SpawnManager";
import { PathManager } from "./path/PathManager";
import { circleSizeNames } from "../../globals/globalSizes";

export class Camp {
	color: string;
	area: Area;
	buildingPopulators: BuildingPopulator[] = [];
	areaPopulator: AreaPopulator;
	numbOfBuildings = 3;

	constructor(
		scene,
		area: Area,
		spawnManager: SpawnManager,
		pathManager: PathManager,
		enemyPhysicGroup,
		weaponPhysicGroup
	) {
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
		area.buildBuildings(this.numbOfBuildings, circleSizeNames);
		this.areaPopulator = new AreaPopulator(enemyConfig, area, spawnManager);
		area.buildings.forEach(building => {
			enemyConfig.size = building.spawnUnit;
			this.buildingPopulators.push(new BuildingPopulator({ ...enemyConfig }, building, spawnManager, pathManager));
		});
	}

	spawnAreaUnits() {
		this.areaPopulator.startPopulating();
	}

	spawnWaveUnits() {
		this.buildingPopulators.forEach(populator => populator.startPopulating());
	}
}
