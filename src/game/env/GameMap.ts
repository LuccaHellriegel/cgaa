import { ZeroOneMap } from "../base/types";
import { walkableSymbol, buildingSymbol } from "../base/globals/globalSymbols";
import { constructXYIDfromColumnRow } from "../base/id";
import { EmptyArea, Area } from "./area/Area";
import { RandBuildingPos } from "../enemies/camp/building/RandBuildingPos";

export class GameMap {
	private spawnableDict = {};
	map: ZeroOneMap = [];
	constructor(areas: EmptyArea[][]) {
		this.calculateUnifiedAreasMap(areas);
	}

	private calculateUnifiedAreasMap(areas: EmptyArea[][]) {
		//assummption that all areas have the same number of rows, and that the input arr is symmetric
		let numberOfRows = areas[0][0].areaMap.length;

		for (let layoutRow = 0; layoutRow < areas.length; layoutRow++) {
			for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
				let cumulativeRow = [];

				for (let layoutColumn = 0; layoutColumn < areas[0].length; layoutColumn++) {
					cumulativeRow = cumulativeRow.concat(areas[layoutRow][layoutColumn].areaMap[rowIndex]);
				}
				this.map.push(cumulativeRow);
			}
		}
	}

	toAreaSpawnableDict(area: Area) {
		let dict = {};
		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[0].length; column++) {
				let isWalkable = this.map[row][column] === walkableSymbol;
				let isInArea = area.isInside({ row, column });
				if (isInArea && isWalkable) dict[constructXYIDfromColumnRow(column, row)] = walkableSymbol;
			}
		}
		return dict;
	}

	toSpawnableDict() {
		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[0].length; column++) {
				let isWalkable = this.map[row][column] === walkableSymbol;
				if (isWalkable) this.spawnableDict[constructXYIDfromColumnRow(column, row)] = walkableSymbol;
			}
		}
		return this.spawnableDict;
	}

	private updateWithBuildings(buildingPositions) {
		for (let index = 0, length = buildingPositions.length; index < length; index++) {
			let pos = buildingPositions[index];
			let column = pos[0];
			let row = pos[1];
			this.map[row][column] = buildingSymbol;
			this.map[row][column - 1] = buildingSymbol;
			this.map[row][column + 1] = buildingSymbol;
		}
	}

	createRandBuildingPos(area: Area, numberOfPositions) {
		let randPos = new RandBuildingPos(this.map, area, numberOfPositions);
		this.updateWithBuildings(randPos.positions);
		return randPos.positions;
	}
}
