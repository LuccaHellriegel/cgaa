import { Area } from "../../areas/Area";
import { EnemyConfig, EnemyFactory } from "./EnemyFactory";
import { AreaPopulator } from "../populators/AreaPopulator";
import { BuildingPopulator } from "../populators/BuildingPopulator";
import { PathManager } from "../path/PathManager";
import {
	circleSizeNames,
	rectBuildinghalfHeight,
	wallPartHalfSize,
	rectBuildingHalfWidth
} from "../../../globals/globalSizes";
import { Gameplay } from "../../../scenes/Gameplay";
import { addInteractionEle } from "../../base/events/elements";
import { extractSpawnPosFromSpawnableMap } from "../../base/map/extract";
import { Building } from "./Building";
import { exitSymbol, wallSymbol } from "../../../globals/globalSymbols";
import { updateAreaMapWithBuilding } from "../../base/map/update";
import { EnemySpawnMap } from "../../spawn/EnemySpawnMap";
import { relativePosToRealPos } from "../../base/map/position";

export class Camp {
	color: string;
	area: Area;
	buildingPopulators: BuildingPopulator[] = [];
	areaPopulator: AreaPopulator;
	numbOfBuildings = 3;
	enemyPhysicGroup: any;
	weaponPhysicGroup: any;
	scene: Gameplay;
	SpawnableMapForBuildings: any;
	buildings: Building[] = [];

	constructor(
		scene,
		area: Area,
		enemySpawnMap: EnemySpawnMap,
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
		this.SpawnableMapForBuildings = JSON.parse(JSON.stringify(area.map));

		this.scene = scene;
		this.enemyPhysicGroup = enemyPhysicGroup;
		this.weaponPhysicGroup = weaponPhysicGroup;

		this.addDistanceBetweenWallAndSpawnPos();
		this.buildBuildings(this.numbOfBuildings, circleSizeNames, buildingPhysicGroup);

		this.areaPopulator = new AreaPopulator(enemyConfig, area, enemySpawnMap);
		this.buildings.forEach(building => {
			enemyConfig.size = building.spawnUnit;
			this.buildingPopulators.push(new BuildingPopulator({ ...enemyConfig }, building, enemySpawnMap, pathManager));
		});

		this.addInteractionUnit();
	}

	private addDistanceBetweenWallAndSpawnPos() {
		for (let row = 0; row < this.SpawnableMapForBuildings.length; row++) {
			for (let column = 0; column < this.SpawnableMapForBuildings[0].length; column++) {
				let isLeftWall = column === 0;
				let isRightWall = column === this.SpawnableMapForBuildings.length - 1;
				let isTopWall = row === 0;
				let isBottomWall = row === this.SpawnableMapForBuildings[0].length - 1;

				if (isTopWall) {
					this.SpawnableMapForBuildings[row + 1][column] = wallSymbol;
					this.SpawnableMapForBuildings[row + 2][column] = wallSymbol;
					continue;
				}

				if (isBottomWall) {
					this.SpawnableMapForBuildings[row - 1][column] = wallSymbol;
					this.SpawnableMapForBuildings[row - 2][column] = wallSymbol;
					continue;
				}

				if (isLeftWall) {
					this.SpawnableMapForBuildings[row][column + 1] = wallSymbol;
					this.SpawnableMapForBuildings[row][column + 2] = wallSymbol;
					continue;
				}

				if (isRightWall) {
					this.SpawnableMapForBuildings[row][column - 1] = wallSymbol;
					this.SpawnableMapForBuildings[row][column - 2] = wallSymbol;
					continue;
				}
			}
		}
	}

	private calculateRandBuildingSpawnPos() {
		let spawnablePos = extractSpawnPosFromSpawnableMap(this.SpawnableMapForBuildings);
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
		updateAreaMapWithBuilding(this.SpawnableMapForBuildings, building, this.area, false);
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
		let pos;
		for (let row = 0; row < this.area.map.length; row++) {
			for (let column = 0; column < this.area.map[0].length; column++) {
				if (this.area.map[row][column] === exitSymbol) {
					pos = { column: column + this.area.relativeTopLeftX, row: row + this.area.relativeTopLeftY };
					break;
				}
			}
		}

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