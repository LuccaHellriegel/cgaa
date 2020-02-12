import { Spawner } from "../pool/Spawner";
import { SelectorRect } from "./SelectorRect";
import { UnitCollection } from "../base/UnitCollection";
import { Healer } from "../tower/healer/Healer";
import { HealerPool } from "../pool/HealerPool";
import { EventSetup } from "../setup/EventSetup";
import { TowerSetup } from "../setup/TowerSetup";
import { ShooterPool } from "../pool/ShooterPool";

export class TowerModus {
	constructor(private spawner: Spawner, private selectorRect: SelectorRect) {}

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
		//TODO: maybe PoolDestroy back into ele?
		if (ele instanceof Healer) {
			HealerPool.poolDestroy(ele);
			EventSetup.gainSouls(this.spawner.scene, TowerSetup.healerCost);
		} else {
			ShooterPool.poolDestroy(ele);
			EventSetup.gainSouls(this.spawner.scene, TowerSetup.shooterCost);
		}
	}

	getFuncArr() {
		return [this.execute.bind(this), this.executeLocked.bind(this), this.lockOn.bind(this)];
	}
}
