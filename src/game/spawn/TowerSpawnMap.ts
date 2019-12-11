import { SpawnMap } from "./SpawnMap";
import { getRelativePosOfElements } from "../base/position";
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
		let relativePositions = getRelativePosOfElements(this.movingUnitsArr);

		relativePositions.forEach(pos => {
			this.relativeMap[pos.row][pos.column] = enemySmybol;
		});
	}
}
