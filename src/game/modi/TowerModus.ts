import { Spawner } from "../pool/Spawner";
import { SelectorRect } from "./SelectorRect";
import { UnitCollection } from "../base/UnitCollection";
import { EnvSetup } from "../setup/EnvSetup";

export class TowerModus {
	constructor(private spawner: Spawner, private selectorRect: SelectorRect, private maxTowers: number) {}

	private findClosestElement() {
		let [ele, dist] = UnitCollection.findClosestUnit(
			this.spawner.pool.getActiveUnits(),
			this.selectorRect.x,
			this.selectorRect.y
		);
		if (dist < EnvSetup.halfGridPartSize) return ele;
		return null;
	}

	execute() {
		let len = this.spawner.pool.getActiveUnits().length;
		if (len === 0 || (len < this.maxTowers && !this.findClosestElement())) {
			this.spawner.spawn(this.selectorRect);
			return true;
		} else {
			this.selectorRect.play("invalid-shooter-pos");
			return false;
		}
	}
}
