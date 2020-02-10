import { Tower } from "../tower/Tower";
import { EnemySpawnObj } from "./EnemySpawnObj";
import { Enemies } from "../unit/Enemies";
import { EnvSetup } from "../setup/EnvSetup";
import { RealDict } from "../base/Dict";

export class TowerSpawnObj extends EnemySpawnObj {
	constructor(baseObj: RealDict, enemies: Enemies) {
		super(baseObj, enemies);
	}

	updateBaseObj(tower: Tower, remove) {
		let id = tower.x + " " + tower.y;
		let symbol = remove ? EnvSetup.walkableSymbol : EnvSetup.towerSymbol;
		this.relativeDict[id] = symbol;
	}
}
