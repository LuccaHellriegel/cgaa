import { RelativeMap } from "./types";
import { RelPos } from "../base/RelPos";
import { Camps } from "../camp/Camps";
import { EnvSetup } from "../setup/EnvSetup";
import { RealDict } from "../base/Dict";
import { CampSetup } from "../setup/CampSetup";
import { Areas } from "./environment";

export class GameMap {
	map: RelativeMap = [];
	constructor(areas: Areas) {
		this.createMap(areas);
	}

	private createMap(areas: Areas) {
		let dims = areas.dims;
		for (let row = 0; row < dims.sizeOfYAxis; row++) {
			let rowArr = [];
			for (let column = 0; column < dims.sizeOfXAxis; column++) {
				rowArr.push(0);
			}
			this.map.push(rowArr);
		}
		this.map = areas.addTo(this.map);
	}

	getMiddle(): RelPos {
		return new RelPos(Math.floor(this.map.length / 2), Math.floor(this.map[0].length / 2));
	}

	updateWith(camps: Camps) {
		camps.arr.forEach((camp) => {
			if (camp.id !== CampSetup.bossCampID && camp.id !== CampSetup.playerCampID) {
				camp.buildingSetup.positions.forEach((pos) => {
					this.map[pos.row][pos.column - 1] = EnvSetup.buildingSymbol;
					this.map[pos.row][pos.column] = EnvSetup.buildingSymbol;
					this.map[pos.row][pos.column + 1] = EnvSetup.buildingSymbol;
				});
			}
		});
	}

	getSpawnableDict(): RealDict {
		let arr = [];
		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[0].length; column++) {
				let isWalkable = this.map[row][column] === EnvSetup.walkableSymbol;
				if (isWalkable) {
					let pos = new RelPos(row, column);
					arr.push([pos.toPoint(), EnvSetup.walkableSymbol]);
				}
			}
		}
		return new RealDict(arr);
	}
}
