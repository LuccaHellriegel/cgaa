import { SpawnMap } from "./SpawnMap";
import { enemySmybol } from "../../globals/globalSymbols";
import { updateMapWithBuilding } from "../base/map/update";
import { getRelativePosOfElements } from "../base/map/position";

export class EnemySpawnMap extends SpawnMap {
	constructor(scene, baseMap, movingUnitsArr) {
		let baseRelevantUnitTypeNames = ["building"];
		super(scene, JSON.parse(JSON.stringify(baseMap)), movingUnitsArr, baseRelevantUnitTypeNames);
	}

	updateBaseMap(unit, remove) {
		updateMapWithBuilding(this.baseMap, unit, remove);
	}

	updateRelativeMapWithMovingUnits() {
		let relativePositions = getRelativePosOfElements(this.movingUnitsArr);

		relativePositions.forEach(pos => {
			this.relativeMap[pos.row][pos.column] = enemySmybol;
		});
	}
}
