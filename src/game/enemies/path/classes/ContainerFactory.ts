import { ZeroOneMap } from "../../../base/types";
import { PathContainer } from "./PathContainer";

export class ContainerFactory {
	constructor(private map: ZeroOneMap, private easystar) {}

	createContainer(column, row, goalColumn, goalRow, pathToAdd): PathContainer {
		return new PathContainer(column, row, goalColumn, goalRow, this.easystar, this.map, pathToAdd);
	}
}
