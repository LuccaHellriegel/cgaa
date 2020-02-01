import { EnemySpawnObj } from "./EnemySpawnObj";
import { Tower } from "../../player/unit/Tower";
import { constructXYID } from "../id";
import { walkableSymbol, towerSymbol } from "../globals/globalSymbols";
import { Enemies } from "../../enemies/unit/Enemies";

//TODO: randomize starting camp
//TODO: fix CampState UI so that it also shows the first Camps attack
export class TowerSpawnObj extends EnemySpawnObj {
	constructor(baseObj, enemies: Enemies) {
		super(baseObj, enemies);
	}

	updateBaseObj(tower: Tower, remove) {
		let id = constructXYID(tower.x, tower.y);
		let symbol = remove ? walkableSymbol : towerSymbol;
		this.relativeObj[id] = symbol;
	}
}
