import { ZeroOneMap } from "../../../base/types";
import { Path } from "./Path";

export class PathFactory {
	constructor(private map: ZeroOneMap, private easystar) {}

	createContainer(column, row, goalColumn, goalRow, pathArrToAdd): Path {
		return new Path(column, row, goalColumn, goalRow, this.easystar, this.map, pathArrToAdd);
	}
}
