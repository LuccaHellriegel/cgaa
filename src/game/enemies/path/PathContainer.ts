import { walkableSymbol, exitSymbol } from "../../../globals/globalSymbols";
import { relativePosToRealPos } from "../../base/map/position";

export class PathContainer {
	path;
	id: string;
	constructor(column, row, goalColumn, goalRow, easyStar, unifiedMap) {
		this.id = [column, row].join("");

		//	this.id = [column, row, goalColumn, goalRow].join("");
		easyStar.setGrid(unifiedMap);
		easyStar.setAcceptableTiles([walkableSymbol, exitSymbol]);
		easyStar.findPath(
			column,
			row,
			goalColumn,
			goalRow,
			function(path) {
				if (path === null) {
					console.log("Path was not found.");
				} else {
					let realPath = this.relativePathToRealPath(path);
					//	this.drawPath(realPath);
					this.path = realPath;
				}
			}.bind(this)
		);
		easyStar.calculate();
	}

	private relativePathToRealPath(path) {
		let realPath: any[] = [];

		path.forEach(pos => {
			realPath.push(relativePosToRealPos(pos.x, pos.y));
		});
		return realPath;
	}
}
