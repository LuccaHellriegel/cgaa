import { Populator } from "./Populator";
import { Gameplay } from "../../scenes/Gameplay";
import { Building } from "../../env/buildings/Building";
import EasyStar from "easystarjs";
import { SpawnService } from "../../spawn/SpawnService";
import { EnemyCircle } from "../circles/EnemyCircle";

export class BuildingPopulator extends Populator {
  easyStar: EasyStar.js;
  building: Building;

  constructor(
    scene: Gameplay,
    enemyPhysicsGroup: Phaser.Physics.Arcade.Group,
    weaponPhysicsGroup: Phaser.Physics.Arcade.Group,
    building: Building
  ) {
    super(scene, enemyPhysicsGroup, weaponPhysicsGroup);
    this.building = building;
  }

  //TODO: use spawnmanager
  calculateRandUnitSpawnPosition(building) {
    return SpawnService.randomlyTryAllSpawnablePosInRelationToEnv(
      building.validSpawnPositions,
      spawnablePosCount => {
        return Phaser.Math.Between(0, spawnablePosCount);
      },
      (x, y) => {
        return !this.scene.spawnManager.evaluateRealSpawnPosOfEnemy(x, y);
      }
    );
  }

  createEnemy() {
    let spawnPositon = this.calculateRandUnitSpawnPosition(this.building);
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
