import { CampID, CampSetup } from "../setup/CampSetup";
import { Building } from "../building/Building";
import { BuildingFactory } from "../building/BuildingFactory";
import { CampPopulator } from "../populator/CampPopulator";
import { Gameplay } from "../../scenes/Gameplay";
import { EnemySpawnObj } from "../spawn/EnemySpawnObj";
import { Enemies } from "../unit/Enemies";
import { EnvSetup } from "../setup/EnvSetup";
import { RealDict } from "../base/Dict";
import { RelPos } from "../base/RelPos";
import { CircleFactory } from "../unit/CircleFactory";
import { InteractionCircle } from "../unit/InteractionCircle";
import { CampsState } from "./CampsState";
import { UnitSetup } from "../setup/UnitSetup";
import { Pool } from "../pool/Pool";
import { DangerousCirclePool } from "../pool/CirclePool";
import { Area, GameMap, areaRealSpawnDict, buildingSpawnDict, RelativeMap } from "../env/environment";

function getAllBuildingRelevantPositions(column, row) {
	let positions: number[][] = [];
	let rows = [row - 1, row, row + 1];
	for (let index = 0, length = rows.length; index < length; index++) {
		positions.push([column - 3, rows[index]]);
		positions.push([column - 2, rows[index]]);
		positions.push([column - 1, rows[index]]);
		positions.push([column, rows[index]]);
		positions.push([column + 1, rows[index]]);
		positions.push([column + 2, rows[index]]);
		positions.push([column + 3, rows[index]]);
	}
	return positions;
}

function updateObj(column, row, obj) {
	let positionArr = getAllBuildingRelevantPositions(column, row);
	for (let index = 0, positionLength = positionArr.length; index < positionLength; index++) {
		let id = positionArr[index][0] + " " + positionArr[index][1];
		if (obj[id] !== undefined) obj[id] = EnvSetup.buildingSymbol;
	}
}

function IDToIntArr(id: string): RelPos {
	let arr = id.split(" ");
	return new RelPos(parseInt(arr[1]), parseInt(arr[0]));
}

function getRandomSpawnPosition(middle: RelPos, obj, keys) {
	let key = keys[Phaser.Math.Between(0, keys.length - 1)];
	let isWalkable = obj[key] === EnvSetup.walkableSymbol;
	let tries = 0;
	while (!isWalkable && tries < 100) {
		key = keys[Phaser.Math.Between(0, keys.length - 1)];
		isWalkable = obj[key] === EnvSetup.walkableSymbol;
		tries++;
	}
	if (tries === 100) return false;

	//Building not allowed in middle for pathfinding
	let pos = IDToIntArr(key);
	if (pos.row === middle.row && pos.column === middle.column) return false;
	//Building not allowed to overlap middle for pathfinding
	if (pos.row === middle.row && pos.column === middle.column - 1) return false;
	if (pos.row === middle.row && pos.column === middle.column + 1) return false;

	return pos;
}

function getAllPositionsAroundBuildingExclusive(column, row) {
	let positions: RelPos[] = [];
	let rows = [row - 1, row + 1];
	for (let index = 0, length = rows.length; index < length; index++) {
		positions.push(new RelPos(rows[index], column - 2));
		positions.push(new RelPos(rows[index], column - 1));
		positions.push(new RelPos(rows[index], column));
		positions.push(new RelPos(rows[index], column + 1));
		positions.push(new RelPos(rows[index], column + 2));
	}
	positions.push(new RelPos(row, column - 2));
	positions.push(new RelPos(row, column + 2));

	return positions;
}

function RandomBuildingPositions(mapSpawnPos: RelPos[], map: RelativeMap, area: Area, numberOfPositions) {
	let positions: RelPos[] = [];
	let spawnPos: RelPos[] = [];
	let pairs = [];
	let middle = area.getMiddle();

	let baseObj = buildingSpawnDict(area.topLeft, area.dims, mapSpawnPos, map);

	let keys = Object.keys(baseObj);
	let copyObj = { ...baseObj };
	let foundPos = 0;
	let curPosition;
	while (foundPos !== numberOfPositions) {
		curPosition = getRandomSpawnPosition(middle, copyObj, keys);
		if (curPosition) {
			positions.push(curPosition);
			updateObj(curPosition.column, curPosition.row, copyObj);
			foundPos++;
		} else {
			copyObj = { ...baseObj };
			foundPos = 0;
			positions = [];
		}
	}
	positions.forEach((pos) => {
		let buildingSpawnPos = getAllPositionsAroundBuildingExclusive(pos.column, pos.row);
		spawnPos.push(...buildingSpawnPos);
		pairs.push({ building: pos, spawnPos: buildingSpawnPos });
	});

	return { spawnPos, positions, pairs };
}

export interface CampLike {
	populate(scene: Gameplay, pool: Pool, enemies: Enemies, campsState: CampsState);
	id: CampID;
	area: Area;
}

interface BuildingSpawnPair {
	building: Building;
	spawnPos: RelPos[];
}

export class Camp implements CampLike {
	buildingSetup;
	buildings: Building[] = [];
	buildingSpawnPairs: BuildingSpawnPair[] = [];
	interactionUnit: InteractionCircle;

	constructor(public id: CampID, public area: Area, private gameMap: GameMap) {
		this.buildingSetup = RandomBuildingPositions(gameMap.spawnPos, gameMap.map, this.area, CampSetup.numbOfBuildings);
	}

	createBuildings(factory: BuildingFactory, spawnUnits: string[]) {
		this.buildingSetup.pairs.forEach((pair) => {
			let building = factory.produce(pair.building, this.id, spawnUnits.pop());
			this.buildings.push(building);
			this.buildingSpawnPairs.push({ building, spawnPos: pair.spawnPos });
		});
	}

	createInteractionCircle(factory: CircleFactory) {
		let circleConfig = { ...this.area.exit.getMiddle().toPoint(), size: "Big", weaponType: "chain" };
		this.interactionUnit = factory.createInteractionCircle(circleConfig);
	}

	populate(scene: Gameplay, pool: DangerousCirclePool, enemies: Enemies, campsState: CampsState) {
		new CampPopulator(
			this.id,
			scene,
			pool,
			new EnemySpawnObj(areaRealSpawnDict(this.area.topLeft, this.area.dims, this.gameMap.spawnPos), enemies),
			UnitSetup.maxCampPopulation,
			campsState
		);
	}

	createBuildingSpawnableDictsPerBuilding(): any[][] {
		let result = [];
		this.buildingSpawnPairs.forEach((pair) => {
			let arr = [];
			pair.spawnPos.forEach((pos) => {
				let point = pos.toPoint();
				arr.push([point, EnvSetup.walkableSymbol]);
			});
			result.push([pair.building, new RealDict(arr)]);
		});

		return result;
	}
}
