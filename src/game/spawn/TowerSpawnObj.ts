import { walkableSymbol, towerSymbol } from "../../globals/globalSymbols";
import { constructColumnRowID } from "../base/id";
import { realCoordinateToRelative } from "../base/map/position";
import { EnemySpawnObj } from "./EnemySpawnObj";
import { Tower } from "../player/towers/Tower";

export class TowerSpawnObj extends EnemySpawnObj {
	constructor(baseObj, movingUnitsArr) {
		super(baseObj, movingUnitsArr);
	}

	updateBaseObj(tower: Tower, remove) {
		let id = constructColumnRowID(realCoordinateToRelative(tower.x), realCoordinateToRelative(tower.y));
		let symbol = remove ? walkableSymbol : towerSymbol;
		this.relativeObj[id] = symbol;
	}
}
