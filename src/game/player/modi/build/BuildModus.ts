import { SelectorRect } from "../SelectorRect";
import { ElementCollection } from "../../../base/classes/ElementCollection";
import { gainSouls } from "../../../base/events/player";
import { shooterCost } from "../../../base/globals/globalConfig";
import { Spawner } from "../../../base/pool/Spawner";
import { Pool } from "../../../base/pool/Pool";

export class BuildModus {
	constructor(private spawner: Spawner) {}

	//TODO: Healer Aura
	//TODO: switch to Healers with Shift

	lockOn(selectorRect: SelectorRect) {
		//TODO: if closest point too far -> dont lock on
		let ele = ElementCollection.findClosestElement(this.spawner.pool.getActiveUnits(), selectorRect.x, selectorRect.y);
		if (ele) {
			selectorRect.setPosition(ele.x, ele.y);
		}
	}

	execute(selectorRect: SelectorRect, lock: boolean) {
		if (lock) {
			let ele = ElementCollection.findClosestElement(
				this.spawner.pool.getActiveUnits(),
				selectorRect.x,
				selectorRect.y
			);
			this.interactWithShooter(ele);
		} else {
			this.spawner.spawn(selectorRect);
		}
	}

	//TODO: needs to be dependant on type
	private interactWithShooter(ele) {
		Pool.poolDestroy(ele);
		gainSouls(this.spawner.scene, shooterCost);
	}

	//TODO:
	private interactWithHealer() {
		this.scene.events.emit("life-gained", 20);
	}
}
