import { Area } from "../areas/Area";
import { EnemyConfig, EnemyFactory } from "./units/EnemyFactory";
import { AreaPopulator } from "./populators/AreaPopulator";
import { BuildingPopulator } from "./populators/BuildingPopulator";
import { SpawnManager } from "./spawn/SpawnManager";
import { PathManager } from "./path/PathManager";
import { circleSizeNames } from "../../globals/globalSizes";
import { Gameplay } from "../../scenes/Gameplay";
import { relativePosToRealPos } from "../base/position";

export class Camp {
	color: string;
	area: Area;
	buildingPopulators: BuildingPopulator[] = [];
	areaPopulator: AreaPopulator;
	numbOfBuildings = 3;
	enemyPhysicGroup: any;
	weaponPhysicGroup: any;
	scene: Gameplay;

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
		this.scene = scene;
		this.area = area;
		this.enemyPhysicGroup = enemyPhysicGroup;
		this.weaponPhysicGroup = weaponPhysicGroup;
	}

	spawnAreaUnits() {
		this.areaPopulator.startPopulating();
	}

	resetWave() {
		this.buildingPopulators.forEach(populator => (populator.enemyCount = 0));
	}

	spawnWaveUnits() {
		this.buildingPopulators.forEach(populator => populator.startPopulating());
	}

	addInteractionUnit() {
		let pos = this.area.exitPositions[0];
		let { x, y } = relativePosToRealPos(pos.column, pos.row);
		let enemyConfig: EnemyConfig = {
			scene: this.scene,
			color: this.area.color,
			size: "Normal",
			x: x,
			y: y,
			weaponType: "chain",
			physicsGroup: this.enemyPhysicGroup,
			weaponGroup: this.weaponPhysicGroup
		};
		let circle = EnemyFactory.createEnemy(enemyConfig);
		circle.state = "interaction";
		circle.purpose = "interaction";
		this.scene.events.emit("interaction-ele-added", circle);
	}

	establishCooperation(cooperationColor) {
		this.buildingPopulators.forEach(populator => {
			populator.establishCooperation(cooperationColor);
		});
		this.areaPopulator.establishCooperation(cooperationColor);
	}
}
