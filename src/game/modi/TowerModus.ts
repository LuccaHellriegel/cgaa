import { Spawner } from "../pool/Spawner";
import { SelectorRect } from "./SelectorRect";
import { UnitCollection } from "../base/UnitCollection";
import { EventSetup } from "../setup/EventSetup";
import { EnvSetup } from "../setup/EnvSetup";

export class TowerModus {
	constructor(private spawner: Spawner, private selectorRect: SelectorRect, private type: string) {}

	private findClosestElement() {
		let [ele, dist] = UnitCollection.findClosestUnit(
			this.spawner.pool.getActiveUnits(),
			this.selectorRect.x,
			this.selectorRect.y
		);
		if (dist < EnvSetup.halfGridPartSize) return ele;
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
		let eleDist = this.findClosestElement();
		if (eleDist) this.interactWithTower(eleDist);
	}

	execute() {
		if (this.spawner.pool.getActiveUnits().length === 0 || !this.findClosestElement()) {
			this.spawner.spawn(this.selectorRect);
		} else {
			this.selectorRect.play("invalid-shooter-pos");
		}
	}

	private interactWithTower(ele) {
		ele.poolDestroy();
		EventSetup.gainSouls(this.spawner.scene, this.type);
	}

	getFuncArr() {
		return [this.execute.bind(this), this.executeLocked.bind(this), this.lockOn.bind(this)];
	}
}
