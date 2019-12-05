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
  validSpawnPositions: any[];

  constructor(
    scene: Gameplay,
    enemyPhysicsGroup: Phaser.Physics.Arcade.Group,
    weaponPhysicsGroup: Phaser.Physics.Arcade.Group,
    building: Building
  ) {
    super(scene, enemyPhysicsGroup, weaponPhysicsGroup);
    this.building = building;
    let { column, row } = PositionService.realPosToRelativePosInEnv(building.x, building.y);
    this.validSpawnPositions = SpawnService.calculateRelativeSpawnPositionsAround(column, row, 3, 1);
  }

  //TODO: building has all the possible paths from spawn pos to exit already and here we assign it
  //TODO: use spawnmanager
  calculateRandUnitSpawnPosition() {
    return SpawnService.randomlyTryAllSpawnablePosInRelationToEnv(
      this.validSpawnPositions,
      spawnablePosCount => {
        return Phaser.Math.Between(0, spawnablePosCount);
      },
      (x, y) => {
        return !this.scene.spawnManager.evaluateRealSpawnPosOfEnemy(x, y);
      }
    );
  }

  createEnemy() {
    let spawnPositon = this.calculateRandUnitSpawnPosition();
    if (spawnPositon === null) return null;

    let { randX, randY } = spawnPositon;

    let choseRandWeapon = Phaser.Math.Between(0, 1) === 0 ? true : false;
    let enemy;

    if (choseRandWeapon) {
      enemy = EnemyCircle.withChainWeapon(
        this.scene,
        randX,
        randY,
        "blueCircle",
        this.enemyPhysicsGroup,
        this.weaponPhysicsGroup
      );
    } else {
      enemy = EnemyCircle.withRandWeapon(
        this.scene,
        randX,
        randY,
        "blueCircle",
        this.enemyPhysicsGroup,
        this.weaponPhysicsGroup
      );
    }
    enemy.state = "ambush";
    return enemy;
  }

  doMoreSpawn() {
    return this.enemyCount != 10;
  }
}
