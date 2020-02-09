import { Tower } from "../tower/Tower";
import { EnemySpawnObj } from "./EnemySpawnObj";
import { Enemies } from "../unit/Enemies";
import { EnvSetup } from "../setup/EnvSetup";

export class TowerSpawnObj extends EnemySpawnObj {
	constructor(baseObj, enemies: Enemies) {
		super(baseObj, enemies);
	}

	updateBaseObj(tower: Tower, remove) {
		let id = tower.x + " " + tower.y;
		let symbol = remove ? EnvSetup.walkableSymbol : EnvSetup.towerSymbol;
		this.relativeObj[id] = symbol;
	}
}
