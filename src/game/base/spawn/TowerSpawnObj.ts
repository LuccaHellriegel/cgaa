import { EnemySpawnObj } from "./EnemySpawnObj";
import { Tower } from "../../player/towers/Tower";
import { constructXYID } from "../id";
import { walkableSymbol, towerSymbol } from "../globals/globalSymbols";

export class TowerSpawnObj extends EnemySpawnObj {
	constructor(baseObj, movingUnitsDict) {
		super(baseObj, movingUnitsDict);
	}

	updateBaseObj(tower: Tower, remove) {
		let id = constructXYID(tower.x, tower.y);
		let symbol = remove ? walkableSymbol : towerSymbol;
		this.relativeObj[id] = symbol;
	}
}
