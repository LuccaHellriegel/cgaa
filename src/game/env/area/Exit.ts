import { RelativePosition } from "../../base/types";

export class Exit {
	//Relative to Area
	relPositions: RelativePosition[] = [];

	constructor(exitSide: string, exitWidth: number, startPos: RelativePosition) {
		if (exitSide === "up" || exitSide === "down") {
			for (let index = 0; index < exitWidth; index++) {
				this.relPositions.push({ row: startPos.row, column: startPos.column + index });
			}
		} else {
			for (let index = 0; index < exitWidth; index++) {
				this.relPositions.push({ row: startPos.row + index, column: startPos.column });
			}
		}
	}
}
