import { Spawner } from "../pool/Spawner";
import { SelectorRect } from "./SelectorRect";
import { UnitCollection } from "../base/UnitCollection";
import { EventSetup } from "../setup/EventSetup";

export class TowerModus {
	constructor(private spawner: Spawner, private selectorRect: SelectorRect, private type: string) {}

	private findClosestElement() {
		let [ele, dist] = UnitCollection.findClosestUnit(
			this.spawner.pool.getActiveUnits(),
			this.selectorRect.x,
			this.selectorRect.y
		);
		if (dist < 100) return ele;
		return null;
	}

	lockOn() {
		let ele = this.findClosestElement();
		if (ele) {
			this.selectorRect.setPosition(ele.x, ele.y);
			this.selectorRect.lockOn();
		}
	}

	executeLocked() {
		let ele = this.findClosestElement();
		if (ele) this.interactWithTower(ele);
	}

	execute() {
		this.spawner.spawn(this.selectorRect);
	}

	private interactWithTower(ele) {
		ele.poolDestroy();
		EventSetup.gainSouls(this.spawner.scene, this.type);
	}

	getFuncArr() {
		return [this.execute.bind(this), this.executeLocked.bind(this), this.lockOn.bind(this)];
	}
}
