import { Populator } from "./Populator";
import { Building } from "../buildings/Building";
import EasyStar from "easystarjs";
import { SpawnService } from "../spawn/SpawnService";
import { PositionService } from "../../base/PositionService";
import { EnemyConfig, EnemyFactory } from "../units/EnemyFactory";

export class BuildingPopulator extends Populator {
  easyStar: EasyStar.js;
  building: Building;
  validSpawnPositions: { column: any; row: any }[];
  enemyConfig: EnemyConfig;

  constructor(enemyConfig: EnemyConfig, building: Building) {
    super(enemyConfig.scene);
    this.enemyConfig = enemyConfig;

    let { column, row } = PositionService.realPosToRelativePos(building.x, building.y);
    this.validSpawnPositions = SpawnService.calculateRelativeSpawnPositionsAround(column, row, 3, 1);
  }

  calculateRandUnitSpawnPosition() {
    let curValidPos = this.scene.spawnManager.filterForValidEnemySpawnPos(this.validSpawnPositions);
    return curValidPos[Phaser.Math.Between(0, curValidPos.length - 1)];
  }

  createEnemy() {
    let spawnPosition = this.calculateRandUnitSpawnPosition();
    let { x, y } = PositionService.relativePosToRealPos(spawnPosition.column, spawnPosition.row);

    this.enemyConfig.x = x;
    this.enemyConfig.y = y;

    let choseRandWeapon = Phaser.Math.Between(0, 1) === 0 ? true : false;
    if (choseRandWeapon) {
      this.enemyConfig.weaponType = "rand"
    } else {
      this.enemyConfig.weaponType = "chain"
    }

    let enemy = EnemyFactory.createEnemy(this.enemyConfig);

    enemy.pathContainer = this.scene.pathManager.getSpecificPathForSpawnPos(spawnPosition.column, spawnPosition.row);
    enemy.state = "ambush";
    return enemy;
  }

  doMoreSpawn() {
    return this.enemyCount != 10;
  }
}
