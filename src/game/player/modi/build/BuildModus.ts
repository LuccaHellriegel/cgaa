import { SelectorRect } from "../SelectorRect";
import { ElementCollection } from "../../../base/classes/ElementCollection";
import { gainSouls } from "../../../base/events/player";
import { shooterCost } from "../../../base/globals/globalConfig";
import { Spawner } from "../../../base/pool/Spawner";
import { Pool } from "../../../base/pool/Pool";
import { ModiState } from "../ModiState";

export class BuildModus {
	constructor(private spawners: Spawner[]) {}

	//TODO: Healer Aura
	//TODO: switch to Healers with q

	//TODO: lock onto healer
	lockOn(selectorRect: SelectorRect) {
		//TODO: if closest point too far -> dont lock on
		let ele = ElementCollection.findClosestElement(
			this.spawners[0].pool.getActiveUnits(),
			selectorRect.x,
			selectorRect.y
		);
		if (ele) {
			selectorRect.setPosition(ele.x, ele.y);
		}
	}

	execute(selectorRect: SelectorRect, modiState: ModiState) {
		if (modiState.lock) {
			let ele = ElementCollection.findClosestElement(
				this.spawners[0].pool.getActiveUnits(),
				selectorRect.x,
				selectorRect.y
			);
			this.interactWithShooter(ele);
		} else {
			//TODO: replace build with enum
			if (!modiState.build) {
				this.spawners[0].spawn(selectorRect);
			} else {
				this.spawners[1].spawn(selectorRect);
			}
		}
	}

	//TODO: needs to be dependant on type
	private interactWithShooter(ele) {
		Pool.poolDestroy(ele);
		gainSouls(this.spawners[0].scene, shooterCost);
	}

	//TODO:
	private interactWithHealer() {
		this.scene.events.emit("life-gained", 20);
	}
}
