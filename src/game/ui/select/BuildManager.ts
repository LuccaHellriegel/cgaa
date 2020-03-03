import { TowerModus } from "../../modi/TowerModus";
import { Gameplay } from "../../../scenes/Gameplay";
import { EventSetup } from "../../setup/EventSetup";
export class BuildManager {
	activeSpawner = true;
	constructor(private scene: Gameplay, private healerMode: TowerModus, private shooterMode: TowerModus) {}
	build() {
		if (this.activeSpawner) {
			if (this.healerMode.execute()) this.scene.events.emit(EventSetup.towerBuildEvent, "Healer");
		} else {
			if (this.shooterMode.execute()) this.scene.events.emit(EventSetup.towerBuildEvent, "Shooter");
		}
	}
	activateHealerBuilding() {
		this.activeSpawner = true;
	}
	activateShooterBuilding() {
		this.activeSpawner = false;
	}
}
