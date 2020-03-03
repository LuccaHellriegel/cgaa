import { Gameplay } from "../../../scenes/Gameplay";
import { EventSetup } from "../../setup/EventSetup";
export class SellManager {
	constructor(private scene: Gameplay) {}
	sell(unit) {
		unit.poolDestroy();
		EventSetup.gainSouls(this.scene, unit.type);
		this.scene.events.emit(EventSetup.towerSoldEvent, unit.type);
		//this.selectBars.hide();
	}
}
