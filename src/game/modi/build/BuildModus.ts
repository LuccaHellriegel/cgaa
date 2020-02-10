import { SelectorRect } from "../SelectorRect";
import { ModiState } from "../ModiState";
import { Spawner } from "../../pool/Spawner";
import { UnitCollection } from "../../base/UnitCollection";
import { Healer } from "../../tower/healer/Healer";
import { HealerPool } from "../../pool/HealerPool";
import { ShooterPool } from "../../pool/ShooterPool";
import { EventSetup } from "../../setup/EventSetup";
import { TowerSetup } from "../../setup/TowerSetup";

//TODO: UI bar which tower we selected instead of different rects, right top? -> CampState right and this one left
export class BuildModus {
	constructor(private spawners: Spawner[]) {}

	//TODO: dont lock at all if nothing in reach

	private findClosestElement(selectorRect: SelectorRect) {
		let [ele, dist] = UnitCollection.findClosestUnit(
			this.spawners[0].pool.getActiveUnits(),
			selectorRect.x,
			selectorRect.y
		);
		let [ele2, dist2] = UnitCollection.findClosestUnit(
			this.spawners[1].pool.getActiveUnits(),
			selectorRect.x,
			selectorRect.y
		);

		if ((dist2 ? dist2 : Infinity) > (dist ? dist : Infinity)) {
			return ele;
		}
		return ele2;
	}

	//TODO: pressing Q does nothing, can just switch from F, maybe make shift system first?

	lockOn(selectorRect: SelectorRect) {
		//TODO: if closest point too far -> dont lock on
		let ele = this.findClosestElement(selectorRect);
		if (ele) {
			selectorRect.setPosition(ele.x, ele.y);
		}
	}

	execute(selectorRect: SelectorRect, modiState: ModiState) {
		if (modiState.lock) {
			let ele = this.findClosestElement(selectorRect);
			this.interactWithTower(ele);
		} else {
			//TODO: replace build with enum
			if (!modiState.build) {
				//TODO: replace order dependance
				this.spawners[0].spawn(selectorRect);
			} else {
				this.spawners[1].spawn(selectorRect);
			}
		}
	}

	private interactWithTower(ele) {
		//TODO: maybe PoolDestroy back into ele?
		if (ele instanceof Healer) {
			HealerPool.poolDestroy(ele);
		} else {
			ShooterPool.poolDestroy(ele);
		}
		//TODO: needs to be dependant on type

		EventSetup.gainSouls(this.spawners[0].scene, TowerSetup.shooterCost);
	}
}
