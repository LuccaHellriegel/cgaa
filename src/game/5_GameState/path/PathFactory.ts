import { Paths } from "./Paths";
import { PathCalculator } from "./PathCalculator";
import { MultiPosPath } from "./PathConfig";
import { Path } from "./Path";
import { RelPos } from "../../0_GameBase/engine/RelPos";

export type PathDict = {};

export class PathFactory {
	private constructor() {}

	static produce(calculator: PathCalculator, configs: MultiPosPath[]): PathDict {
		let pathDict: PathDict = {};
		while (configs.length !== 0) {
			let config = configs.pop();
			let result: RelPos[] = [];
			let way = [config.start, ...config.waypoints, config.goal];
			while (way.length !== 0) {
				let start = way.shift();
				let goal = way.shift();

				let path: Path = pathDict[Paths.makeID(start, goal)];
				if (!path) {
					let pathArr = calculator.calculate(start, goal);
					path = new Path(pathArr);
					pathDict[Paths.makeID(start, goal)] = path;
				}

				result = result.concat(path.getRelPath());

				//Last goal does not need to be added again
				if (way.length !== 0) way.unshift(goal);
			}

			pathDict[Paths.makeID(config.start, config.goal)] = new Path(this.filterDoubledPos(result));
		}
		return pathDict;
	}

	static filterDoubledPos(result: RelPos[]) {
		return result.filter((pos, index, arr) => pos.column !== arr[index + 1]?.column || pos.row !== arr[index + 1]?.row);
	}
}
