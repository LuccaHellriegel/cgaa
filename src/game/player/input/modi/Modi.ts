import { InteractionModus } from "./interaction/InteractionModus";
import { Gameplay } from "../../../../scenes/Gameplay";
import { TowerManager } from "../../towers/TowerManager";

export class Modi {
	towerModus: boolean;
	interactionModus: InteractionModus;
	scene: Gameplay;
	towerManager: TowerManager;

	constructor(scene, keyObjF, interactionModus: InteractionModus, towerManager: TowerManager) {
		this.interactionModus = interactionModus;

		keyObjF.on("down", () => {
			this.towerModus = !this.towerModus;
			this.interactionModus.isOn = false;
		});

		this.scene = scene;
		this.towerManager = towerManager;
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
