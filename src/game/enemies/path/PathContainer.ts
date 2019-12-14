import { walkableSymbol, exitSymbol } from "../../../globals/globalSymbols";
import { relativePosToRealPos, calculateRelativeCrossPostioning } from "../../base/position";
import { PathMarking } from "./PathMarking";

export type PathCointainerType = { path; id: string };

export class PathContainer {
	path;
	id: string;
	constructor(scene, column, row, goalColumn, goalRow, easyStar, unifiedMap, pathToAdd: PathCointainerType) {
		this.id = [column, row].join("");

		//	this.id = [column, row, goalColumn, goalRow].join("");
		easyStar.setGrid(unifiedMap);
		easyStar.setAcceptableTiles([walkableSymbol, exitSymbol]);
		easyStar.findPath(
			column,
			row,
			goalColumn,
			goalRow,
			function(newPath) {
				if (newPath === null) {
					console.log("Path was not found.");
				} else {
					let realPath = this.relativePathToRealPath(newPath);
					//	this.drawPath(scene, realPath);
					if (pathToAdd.path) {
						this.path = realPath.concat(pathToAdd.path);
					} else {
						const timer = setInterval(
							function() {
								if (pathToAdd.path) {
									this.path = realPath.concat(pathToAdd.path);
									clearInterval(timer);
								}
							}.bind(this),
							4000
						);
					}
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

	private drawPath(scene, realPath) {
		let curPos = realPath[0];
		let prevDirection = calculateRelativeCrossPostioning(curPos.x, curPos.y, curPos.x - 1, curPos.y);
		let nextPos = realPath[1];
		let nextDirection = calculateRelativeCrossPostioning(curPos.x, curPos.y, nextPos.x, nextPos.y);
		new PathMarking(scene, curPos.x, curPos.y, prevDirection, nextDirection);
		for (let index = 1; index < realPath.length - 1; index++) {
			let prevPos = realPath[index - 1];
			curPos = realPath[index];

			prevDirection = calculateRelativeCrossPostioning(curPos.x, curPos.y, prevPos.x, prevPos.y);
			nextPos = realPath[index + 1];
			nextDirection = calculateRelativeCrossPostioning(curPos.x, curPos.y, nextPos.x, nextPos.y);
			new PathMarking(scene, curPos.x, curPos.y, prevDirection, nextDirection);
		}
		let prevPos = realPath[realPath.length - 1 - 1];
		curPos = realPath[realPath.length - 1];
		prevDirection = calculateRelativeCrossPostioning(curPos.x, curPos.y, prevPos.x, prevPos.y);
		nextDirection = calculateRelativeCrossPostioning(curPos.x, curPos.y, curPos.x + 1, curPos.y);
		new PathMarking(scene, curPos.x, curPos.y, prevDirection, nextDirection);
	}
}
