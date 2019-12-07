import { Populator } from "./Populator";
import { Area } from "../../world/areas/Area";
import { PositionService } from "../../world/PositionService";
import { EnemyConfig, EnemyFactory } from "../units/EnemyFactory";

export class AreaPopulator extends Populator {
  area: Area;
  enemyConfig: EnemyConfig;

  constructor(enemyConfig: EnemyConfig, area: Area) {
    super(enemyConfig.scene);
    this.enemyConfig = enemyConfig;
    this.area = area;
  }

  calculateRandUnitSpawnPosition(area) {
    let spawnablePos = this.scene.spawnManager.getValidSpawnPosForEnemiesInArea(area);

    let pos = spawnablePos[Phaser.Math.Between(0, spawnablePos.length - 1)];
    return pos;
  }

  createEnemy() {
    let spawnPosition = this.calculateRandUnitSpawnPosition(this.area);
    let { x, y } = PositionService.relativePosToRealPos(spawnPosition.column, spawnPosition.row);

    this.enemyConfig.x = x;
    this.enemyConfig.y = y;

    let choseRandWeapon = Phaser.Math.Between(0, 1) === 0 ? true : false;
    if (choseRandWeapon) {
      this.enemyConfig.weaponType = "rand";
    } else {
      this.enemyConfig.weaponType = "chain";
    }

    let enemy = EnemyFactory.createEnemy(this.enemyConfig);

    enemy.state = "guard";
    return enemy;
  }

  doMoreSpawn() {
    return this.enemyCount != 10;
  }
}
