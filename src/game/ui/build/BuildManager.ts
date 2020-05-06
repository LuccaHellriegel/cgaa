import { TowerModus } from "../../tower/TowerModus";
import { Gameplay } from "../../../scenes/Gameplay";
import { EventSetup } from "../../setup/EventSetup";
export class BuildManager {
	activeSpawner = true;
	constructor(private scene: Gameplay, private healerMode: TowerModus, private shooterMode: TowerModus) {}
	build() {
		if (this.activeSpawner) {
			if (this.healerMode.execute()) {
				this.scene.events.emit(EventSetup.towerBuildEvent, "Healer");
				return true;
			}
		} else {
			if (this.shooterMode.execute()) {
				this.scene.events.emit(EventSetup.towerBuildEvent, "Shooter");
				return true;
			}
		}

		return false;
	}
	activateHealerBuilding() {
		this.activeSpawner = true;
	}
	activateShooterBuilding() {
		this.activeSpawner = false;
	}
}
