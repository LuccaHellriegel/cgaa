import { EnemySpawnObj } from "./EnemySpawnObj";
import { RealDict } from "../../0_GameBase/engine/Dict";
import { Enemies } from "../../4_GameUnit/unit/Enemies";
import { Tower } from "../../4_GameUnit/tower/Tower";
import { EnvSetup } from "../../0_GameBase/setup/EnvSetup";

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
