import { SelectorRect } from "../SelectorRect";
import { ShooterSpawner } from "../../unit/shooter/ShooterSpawner";
import { ElementCollection } from "../../../base/classes/ElementCollection";
import { gainSouls } from "../../../base/events/player";
import { shooterCost } from "../../../base/globals/globalConfig";

export class BuildModus {
	constructor(private shooterSpawner: ShooterSpawner) {}

	//TODO: place Healers
	//TODO: Healer Aura
	//TODO: switch to Healers with Shift

	lockOn(selectorRect: SelectorRect) {
		//TODO: if closest point too far -> dont lock on
		let ele = ElementCollection.findClosestElement(
			this.shooterSpawner.shooterPool.getActiveShooters(),
			selectorRect.x,
			selectorRect.y
		);
		if (ele) {
			selectorRect.setPosition(ele.x, ele.y);
		}
	}

	execute(selectorRect: SelectorRect, lock: boolean) {
		if (lock) {
			let ele = ElementCollection.findClosestElement(
				this.shooterSpawner.shooterPool.getActiveShooters(),
				selectorRect.x,
				selectorRect.y
			);
			this.interactWithShooter(ele);
		} else {
			this.shooterSpawner.spawnNewShooter(selectorRect);
		}
	}

	private interactWithShooter(ele) {
		ele.poolDestroy();
		gainSouls(this.shooterSpawner.scene, shooterCost);
	}

	//TODO:
	private interactWithHealer() {
		this.scene.events.emit("life-gained", 20);
	}
}
