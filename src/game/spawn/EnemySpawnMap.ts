import { SpawnMap } from "./SpawnMap";
import { getRelativePosOfElements } from "../base/position";
import { enemySmybol, towerSymbol } from "../../globals/globalSymbols";
import { updateMapWithElementAndAroundElements, updateMapWithBuilding } from "../base/map";
import { Tower } from "../player/towers/Tower";
import { Building } from "../enemies/units/Building";

export class EnemySpawnMap extends SpawnMap {
	constructor(scene, baseMap, movingUnitsArr) {
		let baseRelevantUnitTypeNames = ["tower", "building"];
		super(scene, JSON.parse(JSON.stringify(baseMap)), movingUnitsArr, baseRelevantUnitTypeNames);
	}

	updateBaseMap(unit, remove) {
		if (unit instanceof Tower) {
			updateMapWithElementAndAroundElements(this.baseMap, unit, towerSymbol, remove, 1, 1);
			return;
		}

		if (unit instanceof Building) {
			updateMapWithBuilding(this.baseMap, unit, remove);
		}
	}

	updateRelativeMapWithMovingUnits() {
		let relativePositions = getRelativePosOfElements(this.movingUnitsArr);

		relativePositions.forEach(pos => {
			this.relativeMap[pos.row][pos.column] = enemySmybol;
		});
	}
}
