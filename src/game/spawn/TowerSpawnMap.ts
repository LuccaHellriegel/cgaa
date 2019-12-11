import { SpawnMap } from "./SpawnMap";
import { getRelativePosOfElementsAndAroundElements } from "../base/position";
import { enemySmybol, towerSymbol } from "../../globals/globalSymbols";
import { updateMapWithElement, markCampsAsNonWalkable } from "../base/map";

export class TowerSpawnMap extends SpawnMap {
	constructor(scene, baseMap, movingUnitsArr) {
		let baseRelevantUnitTypeNames = ["tower"];

		let newBaseMap = JSON.parse(JSON.stringify(baseMap));
		markCampsAsNonWalkable(newBaseMap);
		super(scene, newBaseMap, movingUnitsArr, baseRelevantUnitTypeNames);
	}

	updateBaseMap(unit: any, remove: any) {
		updateMapWithElement(this.baseMap, unit, towerSymbol, remove);
	}

	updateRelativeMapWithMovingUnits() {
		let relativePositions = getRelativePosOfElementsAndAroundElements(this.movingUnitsArr, 1, 1);

		relativePositions.forEach(pos => {
			this.relativeMap[pos.row][pos.column] = enemySmybol;
		});
	}
}
