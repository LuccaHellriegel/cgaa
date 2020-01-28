import { SelectorRect } from "../SelectorRect";
import { ElementCollection } from "../../../base/classes/ElementCollection";
import { gainSouls } from "../../../base/events/player";
import { shooterCost } from "../../../base/globals/globalConfig";
import { Spawner } from "../../../base/pool/Spawner";
import { ModiState } from "../ModiState";
import { Healer } from "../../unit/healer/Healer";
import { HealerPool } from "../../unit/healer/HealerPool";
import { ShooterPool } from "../../unit/shooter/ShooterPool";

//TODO: UI bar which tower we selected instead of different rects, right top? -> CampState right and this one left
export class BuildModus {
	constructor(private spawners: Spawner[]) {}

	//TODO: dont lock at all if nothing in reach

	private findClosestElement(selectorRect: SelectorRect) {
		let [ele, dist] = ElementCollection.findClosestElement(
			this.spawners[0].pool.getActiveUnits(),
			selectorRect.x,
			selectorRect.y
		);
		let [ele2, dist2] = ElementCollection.findClosestElement(
			this.spawners[1].pool.getActiveUnits(),
			selectorRect.x,
			selectorRect.y
		);

		if ((dist2 ? dist2 : Infinity) > (dist ? dist : Infinity)) {
			return ele;
		}
		return ele2;
	}

	//TODO: Healer Aura
	//TODO: switch to Healers with q

	//TODO: lock onto healer
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

		gainSouls(this.spawners[0].scene, shooterCost);
	}
}
