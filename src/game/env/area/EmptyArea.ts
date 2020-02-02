import { ZeroOneMap } from "../../base/types";
import { AreaDimensions } from "./Area";
export class EmptyArea {
	areaMap: ZeroOneMap = [];
	constructor(protected dims: AreaDimensions) {
		this.createEmptyMap();
	}
	private createEmptyMap() {
		for (let row = 0; row < this.dims.sizeOfYAxis; row++) {
			this.areaMap[row] = [];
			for (let column = 0; column < this.dims.sizeOfXAxis; column++) {
				this.areaMap[row].push(0);
			}
		}
	}
}
