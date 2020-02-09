import { Point } from "../base/types";
import { RelPos } from "../base/RelPos";

export class Path {
	private realPathArr: Point[];

	constructor(private pathArr: RelPos[]) {
		this.realPathArr = pathArr.map(pos => pos.toPoint());
	}

	getRelPath() {
		return [...this.pathArr];
	}

	getRealPath() {
		return [...this.realPathArr];
	}
}
