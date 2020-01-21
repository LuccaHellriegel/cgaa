import { walkableSymbol, exitSymbol } from "../../base/globals/globalSymbols";
import { relativePositionToPoint } from "../../base/position";
import { Point } from "../../base/types";

export class Path {
	pathArr: Point[];

	constructor(
		private column,
		private row,
		private goalColumn,
		private goalRow,
		private easyStar,
		private unifiedMap,
		private pathArrToAdd
	) {}

	calculate() {
		this.easyStar.setGrid(this.unifiedMap);
		this.easyStar.setAcceptableTiles([walkableSymbol, exitSymbol]);
		this.easyStar.findPath(this.column, this.row, this.goalColumn, this.goalRow, this.pathCallback.bind(this));
		this.easyStar.enableSync();
		this.easyStar.calculate();
	}

	static createPathFromArr(arr) {
		let path = new Path(null, null, null, null, null, null, null);
		path.pathArr = arr;
		return path;
	}

	private relativePathToRealPath(path) {
		let realPath: any[] = [];

		path.forEach(pos => {
			realPath.push(relativePositionToPoint(pos.x, pos.y));
		});
		return realPath;
	}

	private pathCallback(path) {
		if (path === null) {
			throw "Path was not found. " + this.column + " " + this.row + " " + this.goalColumn + " " + this.goalRow;
		} else {
			this.pathArr = this.relativePathToRealPath(path).concat([...this.pathArrToAdd].reverse());
			this.pathArr.reverse();
		}
	}

	getNextPoint() {
		return this.pathArr.pop();
	}
}
