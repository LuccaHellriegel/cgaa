import { CampID } from "../setup/CampSetup";
import { Building } from "./Building";
import { RelPos } from "../base/RelPos";
import { Gameplay } from "../../scenes/Gameplay";

export class BuildingFactory {
	constructor(private scene: Gameplay, private addBuilding) {}
	produce(pos: RelPos, id: CampID, spawnUnit: string) {
		let point = pos.toPoint();
		return new Building(this.scene, point.x, point.y, this.addBuilding, spawnUnit, id);
	}
}
