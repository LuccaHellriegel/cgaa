import { walkableSymbol, exitSymbol } from "../../../base/globals/globalSymbols";
import { relativePositionToPoint } from "../../../base/position";
import { Point } from "../../../base/types";

export class Path {
	pathArr: Point[];

	constructor(
		private column,
		private row,
		private goalColumn,
		private goalRow,
		easyStar,
		unifiedMap,
		private pathArrToAdd
	) {
		easyStar.setGrid(unifiedMap);
		easyStar.setAcceptableTiles([walkableSymbol, exitSymbol]);
		easyStar.findPath(column, row, goalColumn, goalRow, this.pathCallback.bind(this));
		easyStar.enableSync();
		easyStar.calculate();
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
