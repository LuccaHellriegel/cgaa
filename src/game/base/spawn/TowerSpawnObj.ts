import { EnemySpawnObj } from "./EnemySpawnObj";
import { Tower } from "../../player/towers/Tower";
import { constructColumnRowID } from "../id";
import { realCoordinateToRelative } from "../position";
import { walkableSymbol, towerSymbol } from "../globals/globalSymbols";

export class TowerSpawnObj extends EnemySpawnObj {
	constructor(baseObj, movingUnitsDict) {
		super(baseObj, movingUnitsDict);
	}

	updateBaseObj(tower: Tower, remove) {
		let id = constructColumnRowID(realCoordinateToRelative(tower.x), realCoordinateToRelative(tower.y));
		let symbol = remove ? walkableSymbol : towerSymbol;
		this.relativeObj[id] = symbol;
	}
}
