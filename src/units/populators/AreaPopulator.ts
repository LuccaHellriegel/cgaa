import { Populator } from "./Populator";
import { Area } from "../../env/areas/Area";
import { Gameplay } from "../../scenes/Gameplay";
import { EnemyCircle } from "../circles/EnemyCircle";
import { PositionService } from "../../services/PositionService";

export class AreaPopulator extends Populator {
  area: Area;

  constructor(
    scene: Gameplay,
    enemyPhysicsGroup: Phaser.Physics.Arcade.Group,
    weaponPhysicsGroup: Phaser.Physics.Arcade.Group,
    area: Area
  ) {
    super(scene, enemyPhysicsGroup, weaponPhysicsGroup);
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
    let choseRandWeapon = Phaser.Math.Between(0, 1) === 0 ? true : false;
    let enemy;

    if (choseRandWeapon) {
      enemy = EnemyCircle.withRandWeapon(
        this.scene,
        x,
        y,
        "redCircle",
        this.enemyPhysicsGroup,
        this.weaponPhysicsGroup
      );
    } else {
      enemy = EnemyCircle.withChainWeapon(
        this.scene,
        x,
        y,
        "redCircle",
        this.enemyPhysicsGroup,
        this.weaponPhysicsGroup
      );
    }
    enemy.state = "guard";
    return enemy;
  }

  doMoreSpawn() {
    return this.enemyCount != 10;
  }
}
