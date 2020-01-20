import { walkableSymbol, exitSymbol } from "../../../base/globals/globalSymbols";
import { relativePositionToPoint } from "../../../base/position";
import { Point } from "../../../base/types";

export type PathCointainerType = { path };

export class PathContainer {
	path: Point[];
	constructor(
		private column,
		private row,
		private goalColumn,
		private goalRow,
		easyStar,
		unifiedMap,
		private pathToAdd: PathCointainerType
	) {
		easyStar.setGrid(unifiedMap);
		easyStar.setAcceptableTiles([walkableSymbol, exitSymbol]);
		easyStar.findPath(column, row, goalColumn, goalRow, this.pathCallback.bind(this));
		easyStar.calculate();
	}

	private pathCallback(newPath) {
		if (newPath === null) {
			throw "Path was not found. " + this.column + " " + this.row + " " + this.goalColumn + " " + this.goalRow;
		} else {
			let realPath = this.relativePathToRealPath(newPath);
			if (this.pathToAdd.path) {
				this.path = realPath.concat(this.pathToAdd.path);
			} else {
				const timer = setInterval(
					function() {
						if (this.pathToAdd.path) {
							this.path = realPath.concat(this.pathToAdd.path);
							clearInterval(timer);
						}
					}.bind(this),
					4000
				);
			}
		}
	}

	private relativePathToRealPath(path) {
		let realPath: any[] = [];

		path.forEach(pos => {
			realPath.push(relativePositionToPoint(pos.x, pos.y));
		});
		return realPath;
	}
}
