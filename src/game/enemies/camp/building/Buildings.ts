import { Building } from "./Building";
import { relativeCoordinateToReal } from "../../../base/position";
import { circleSizeNames } from "../../../base/globals/globalSizes";
import { removeEle } from "../../../base/utils";
import { BuildingInfo } from "../../../base/interfaces";
import { BuildingFactory } from "./BuildingFactory";

export class Buildings {
	private buildings: Building[] = [];

	constructor(private spawnPositions: number[][], public color: string) {}

	spawnBuildings(buildingFactory: BuildingFactory) {
		for (let index = 0, length = this.spawnPositions.length; index < length; index++) {
			let pos = this.spawnPositions[index];
			this.buildings.push(
				buildingFactory.setupBuilding(
					relativeCoordinateToReal(pos[0]),
					relativeCoordinateToReal(pos[1]),
					circleSizeNames[index]
				)
			);
		}
	}

	remove(building: Building) {
		removeEle(building, this.buildings);
	}

	areDestroyed() {
		return this.buildings.length === 0;
	}

	getBuildingInfo(): BuildingInfo {
		return { color: this.color, spawnPositions: this.spawnPositions };
	}
}
