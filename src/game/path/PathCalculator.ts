import EasyStar from "easystarjs";
import { RelativeMap } from "../env/types";
import { Point } from "../base/types";
import { RelPos } from "../base/RelPos";
import { EnvSetup } from "../setup/EnvSetup";

export class PathCalculator {
	private easyStar;
	private tempArr: Point[];
	private tempStart: RelPos;
	private tempGoal: RelPos;
	constructor(private map: RelativeMap) {
		this.easyStar = new EasyStar.js();
	}
	private callback(path) {
		if (path === null) {
			throw "Path was not found. " +
				this.tempStart.column +
				" " +
				this.tempStart.row +
				" " +
				this.tempGoal.column +
				" " +
				this.tempGoal.row;
		} else {
			this.tempArr = path;
		}
	}
	calculate(start: RelPos, goal: RelPos): RelPos[] {
		this.tempStart = start;
		this.tempGoal = goal;
		this.easyStar.setGrid(this.map);
		this.easyStar.setAcceptableTiles([EnvSetup.walkableSymbol, EnvSetup.exitSymbol]);
		this.easyStar.findPath(start.column, start.row, goal.column, goal.row, this.callback.bind(this));
		this.easyStar.enableSync();
		this.easyStar.calculate();
		//EasyStar uses x,y
		//TODO: why is x,y reversed?
		let outputArr = this.tempArr.map((pos: Point) => new RelPos(pos.y, pos.x));
		this.tempArr = undefined;
		this.tempStart = undefined;
		this.tempGoal = undefined;
		return outputArr;
	}
}
