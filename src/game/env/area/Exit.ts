import { ExitSide, RelativeMap } from "../types";
import { EnvSetup } from "../../setup/EnvSetup";
import { RelPos } from "../../base/RelPos";

export class Exit {
	relativePositions: RelPos[];
	constructor(areaTopLeft: RelPos, public exitSide: ExitSide, exitWidth: number) {
		let column;
		let row;
		switch (exitSide) {
			case "down":
				column = areaTopLeft.column + EnvSetup.areaExit;
				row = areaTopLeft.row + EnvSetup.areaSize - 1;
				this.relativePositions = this.calcPos(column, row, exitWidth).map(arr => {
					return new RelPos(arr[1], arr[0]);
				});
				break;
			case "up":
				column = areaTopLeft.column + EnvSetup.areaExit;
				row = areaTopLeft.row;
				this.relativePositions = this.calcPos(column, row, exitWidth).map(arr => {
					return new RelPos(arr[1], arr[0]);
				});
				break;
			case "left":
				column = areaTopLeft.column;
				row = areaTopLeft.row + EnvSetup.areaExit;
				this.relativePositions = this.calcPos(row, column, exitWidth).map(arr => {
					return new RelPos(arr[0], arr[1]);
				});
				break;
			case "right":
				column = areaTopLeft.column + EnvSetup.areaSize - 1;
				row = areaTopLeft.row + EnvSetup.areaExit;
				this.relativePositions = this.calcPos(row, column, exitWidth).map(arr => {
					return new RelPos(arr[0], arr[1]);
				});
				break;
		}
	}
	private calcPos(toBeIncremented, otherNumb, exitWidth) {
		let result = [];
		for (let index = 0; index < exitWidth; index++) {
			result.push([toBeIncremented + index, otherNumb]);
		}
		return result;
	}

	getMiddle(): RelPos {
		return this.relativePositions[Math.floor(this.relativePositions.length / 2)];
	}

	isOverlapping(pos: RelPos) {
		for (let index = 0; index < this.relativePositions.length; index++) {
			const element = this.relativePositions[index];
			if (element.column === pos.column && element.row === pos.row) return true;
		}
		return false;
	}

	addTo(map: RelativeMap) {
		this.relativePositions.forEach(pos => {
			map[pos.row][pos.column] = EnvSetup.exitSymbol;
		});
		return map;
	}
}
