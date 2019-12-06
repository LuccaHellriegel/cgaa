import { Populator } from "./Populator";
import { Gameplay } from "../../scenes/Gameplay";
import { Building } from "../../env/buildings/Building";
import EasyStar from "easystarjs";
import { SpawnService } from "../../spawn/SpawnService";
import { EnemyCircle } from "../circles/EnemyCircle";
import { PositionService } from "../../services/PositionService";

export class BuildingPopulator extends Populator {
  easyStar: EasyStar.js;
  building: Building;
  validSpawnPositions: { column: any; row: any }[];

  constructor(
    scene: Gameplay,
    enemyPhysicsGroup: Phaser.Physics.Arcade.Group,
    weaponPhysicsGroup: Phaser.Physics.Arcade.Group,
    building: Building
  ) {
    super(scene, enemyPhysicsGroup, weaponPhysicsGroup);
    this.building = building;

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

    let choseRandWeapon = Phaser.Math.Between(0, 1) === 0 ? true : false;
    let enemy;

    if (choseRandWeapon) {
      enemy = EnemyCircle.withChainWeapon(
        this.scene,
        x,
        y,
        "blueCircle",
        this.enemyPhysicsGroup,
        this.weaponPhysicsGroup
      );
    } else {
      enemy = EnemyCircle.withRandWeapon(
        this.scene,
        x,
        y,
        "blueCircle",
        this.enemyPhysicsGroup,
        this.weaponPhysicsGroup
      );
    }

    enemy.pathContainer = this.scene.pathManager.getSpecificPathForSpawnPos(spawnPosition.column, spawnPosition.row);
    console.log(enemy.pathContainer)
    enemy.state = "ambush";
    return enemy;
  }

  doMoreSpawn() {
    return this.enemyCount != 10;
  }
}
