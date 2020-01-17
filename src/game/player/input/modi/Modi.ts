import { InteractionModus } from "./interaction/InteractionModus";
import { TowerManager } from "../../towers/TowerManager";

export class Modi {
	towerModus: boolean;

	constructor(keyObjF, private interactionModus: InteractionModus, private towerManager: TowerManager) {
		keyObjF.on("down", () => {
			this.towerModus = !this.towerModus;
			this.interactionModus.isOn = false;
		});
	}

	checkModi() {
		if (this.interactionModus.isOn) {
			this.interactionModus.interactWithClosestEle();
			return true;
		} else if (this.towerModus) {
			this.towerManager.spawnNewTower();
			return true;
		}
		return false;
	}
}
