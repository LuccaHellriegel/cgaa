import { realPosToRelativePos } from "../base/position";
import { Area } from "../areas/Area";
import { extractSpawnPosFromSpawnableMapForArea } from "../base/spawn";
import { walkableSymbol } from "../../globals/globalSymbols";

export abstract class SpawnMap {
	baseMap;
	relativeMap;
	movingUnitsArr;

	constructor(scene, baseMap, movingUnitsArr, baseRelevantUnitTypeNames) {
		this.baseMap = baseMap;
		this.movingUnitsArr = movingUnitsArr;

		baseRelevantUnitTypeNames.forEach(unit => {
			scene.events.on("added-" + unit, unit => {
				this.updateBaseMap(unit, false);
			});

			scene.events.on("removed-" + unit, unit => {
				this.updateBaseMap(unit, true);
			});
		});
	}

	abstract updateBaseMap(unit, remove);

	abstract updateRelativeMapWithMovingUnits();

	private updateRelativeMap() {
		this.relativeMap = JSON.parse(JSON.stringify(this.baseMap));
		this.updateRelativeMapWithMovingUnits();
	}

	evaluateRealPos(x, y) {
		this.updateRelativeMap();
		let { row, column } = realPosToRelativePos(x, y);
		return this.relativeMap[row][column] === walkableSymbol;
	}

	filterPositions(positions) {
		this.updateRelativeMap();
		let validPos: any[] = [];
		positions.forEach(pos => {
			if (this.relativeMap[pos.row][pos.column] === walkableSymbol) validPos.push(pos);
		});

		return validPos;
	}

	getValidSpawnPosInArea(area: Area): { column: number; row: number }[] {
		this.updateRelativeMap();
		return extractSpawnPosFromSpawnableMapForArea(
			area.relativeTopLeftX,
			area.relativeTopLeftY,
			area.relativeWidth,
			area.relativeHeight,
			this.relativeMap
		);
	}
}
