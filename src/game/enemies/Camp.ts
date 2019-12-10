import { Area } from "../areas/Area";
import { EnemyConfig, EnemyFactory } from "./units/EnemyFactory";
import { AreaPopulator } from "./populators/AreaPopulator";
import { BuildingPopulator } from "./populators/BuildingPopulator";
import { SpawnManager } from "./spawn/SpawnManager";
import { PathManager } from "./path/PathManager";
import {
	circleSizeNames,
	rectBuildinghalfHeight,
	wallPartHalfSize,
	rectBuildingHalfWidth,
	rectBuildingInWallParts
} from "../../globals/globalSizes";
import { Gameplay } from "../../scenes/Gameplay";
import { relativePosToRealPos } from "../base/position";
import { addInteractionEle } from "../base/events";
import { createBuildingSpawnableArr } from "../base/map";
import { updateBuildingSpawnableArr, extractSpawnPosFromSpawnableArr } from "./spawn/spawn";
import { Building } from "./buildings/Building";

export class Camp {
	color: string;
	area: Area;
	buildingPopulators: BuildingPopulator[] = [];
	areaPopulator: AreaPopulator;
	numbOfBuildings = 3;
	enemyPhysicGroup: any;
	weaponPhysicGroup: any;
	scene: Gameplay;
	spawnableArrForBuildings: any;
	buildings: Building[] = [];

	constructor(
		scene,
		area: Area,
		spawnManager: SpawnManager,
		pathManager: PathManager,
		color,
		enemyPhysicGroup,
		weaponPhysicGroup,
		buildingPhysicGroup
	) {
		let enemyConfig: EnemyConfig = {
			scene,
			color,
			size: "Big",
			x: 0,
			y: 0,
			weaponType: "rand",
			physicsGroup: enemyPhysicGroup,
			weaponGroup: weaponPhysicGroup
		};
		this.color = color;
		this.area = area;
		this.scene = scene;
		this.enemyPhysicGroup = enemyPhysicGroup;
		this.weaponPhysicGroup = weaponPhysicGroup;

		this.buildBuildings(this.numbOfBuildings, circleSizeNames, buildingPhysicGroup);

		this.areaPopulator = new AreaPopulator(enemyConfig, area, spawnManager);
		this.buildings.forEach(building => {
			enemyConfig.size = building.spawnUnit;
			this.buildingPopulators.push(new BuildingPopulator({ ...enemyConfig }, building, spawnManager, pathManager));
		});
	}

	private calculateBuildingSpawnableArrForArea(parts) {
		let spawnableArr = createBuildingSpawnableArr(parts);
		updateBuildingSpawnableArr(spawnableArr);
		return spawnableArr;
	}

	private calculateRandBuildingSpawnPos() {
		if (!this.spawnableArrForBuildings) {
			this.spawnableArrForBuildings = this.calculateBuildingSpawnableArrForArea(this.area.parts);
		} else {
			updateBuildingSpawnableArr(this.spawnableArrForBuildings);
		}
		let spawnablePos = extractSpawnPosFromSpawnableArr(this.spawnableArrForBuildings);
		let pos = spawnablePos[Phaser.Math.Between(0, spawnablePos.length - 1)];
		return relativePosToRealPos(pos.column + this.area.relativeTopLeftX, pos.row + this.area.relativeTopLeftY);
	}

	private checkIfBuildingCollidesWithBuildings(buildings, randX, randY) {
		let checkDiffCallback = (diffX, diffY) => {
			let inRowsOverOrUnderBuilding = diffY >= 2 * rectBuildinghalfHeight + 2 * wallPartHalfSize;
			let leftOrRightFromBuilding = diffX >= 2 * rectBuildingHalfWidth + 2 * wallPartHalfSize;
			if (!inRowsOverOrUnderBuilding && !leftOrRightFromBuilding) return true;
			return false;
		};
		for (let index = 0; index < buildings.length; index++) {
			const otherObject = buildings[index];
			let diffX = Math.abs(otherObject.x - randX);
			let diffY = Math.abs(otherObject.y - randY);
			if (checkDiffCallback(diffX, diffY)) return true;
		}
		return false;
	}

	private buildBuilding(spawnUnit, buildingPhysicGroup) {
		let { x, y } = this.calculateRandBuildingSpawnPos();
		let count = 0;
		while (this.checkIfBuildingCollidesWithBuildings(this.buildings, x, y)) {
			if (count > 100) throw "No building position found";
			let result = this.calculateRandBuildingSpawnPos();
			x = result.x;
			y = result.y;
			count++;
		}

		let building = new Building(this.scene, x, y, buildingPhysicGroup, spawnUnit, this.color);
		this.area.addBuildingToParts(building);
		this.buildings.push(building);
	}

	buildBuildings(numbOfBuildings, spawnUnits, buildingPhysicGroup) {
		for (let index = 0; index < numbOfBuildings; index++) {
			this.buildBuilding(spawnUnits[index], buildingPhysicGroup);
		}
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
			color: this.color,
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
		addInteractionEle(this.scene, circle);
	}

	establishCooperation(cooperationColor) {
		this.buildingPopulators.forEach(populator => {
			populator.establishCooperation(cooperationColor);
		});
		this.areaPopulator.establishCooperation(cooperationColor);
	}
}
