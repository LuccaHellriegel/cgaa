import { EnemySpawnObj } from "./EnemySpawnObj";
import { RealDict } from "../engine/RealDict";
import { EnvSetup } from "../config/EnvSetup";
import { Tower } from "../towers/Tower";
import { Enemies } from "../units/Enemies";

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
