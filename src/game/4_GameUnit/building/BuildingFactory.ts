import { Gameplay } from "../../../scenes/Gameplay";
import { RelPos } from "../../0_GameBase/engine/RelPos";
import { CampID } from "../../0_GameBase/setup/CampSetup";
import { Building } from "./Building";

export class BuildingFactory {
	constructor(private scene: Gameplay, private addBuilding) {}
	produce(pos: RelPos, id: CampID, spawnUnit: string) {
		let point = pos.toPoint();
		return new Building(this.scene, point.x, point.y, this.addBuilding, spawnUnit, id);
	}
}
