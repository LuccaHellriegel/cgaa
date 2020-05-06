import { Spawner } from "../pool/Spawner";
import { SelectorRect } from "./SelectorRect";
import { EnvSetup } from "../setup/EnvSetup";

export class TowerModus {
	constructor(private spawner: Spawner, private selectorRect: SelectorRect, private maxTowers: number) {}

	private findClosestElement() {
		let [ele, dist] = TowerModus.findClosestUnit(
			this.spawner.pool.getActiveUnits(),
			this.selectorRect.x,
			this.selectorRect.y
		);
		if (dist < EnvSetup.halfGridPartSize) return ele;
		return null;
	}

	static findClosestUnit(arr, x, y) {
		let obj;
		let dist = Infinity;
		for (const key in arr) {
			let curObj = arr[key];
			let curDist = Phaser.Math.Distance.Between(x, y, curObj.x, curObj.y);
			if (curDist < dist) {
				obj = curObj;
				dist = curDist;
			}
		}
		return [obj, dist];
	}

	execute() {
		let len = this.spawner.pool.getActiveUnits().length;
		if (len === 0 || (len < this.maxTowers && !this.findClosestElement())) {
			return this.spawner.spawn(this.selectorRect);
		} else {
			this.selectorRect.play("invalid-shooter-pos");
			return false;
		}
	}
}
