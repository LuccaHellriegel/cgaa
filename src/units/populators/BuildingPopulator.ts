import { Populator } from "./Populator";
import { Gameplay } from "../../scenes/Gameplay";
import { Building } from "../../env/buildings/Building";
import EasyStar from "easystarjs";
import { EnemyCircle } from "../circles/EnemyCircle";
import { PathfindingCircle } from "../circles/PathfindingCircle";
import { CollisionService } from "../../spawn/CollisionService";

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

  addEnemyToControlInstance(enemy) {
    this.building.enemies.push(enemy);
  }

  //TODO: replae this with randomylTryFunc
  calculateRandUnitSpawnPosition(validSpawnPositions) {
    let pos = Phaser.Math.Between(0, validSpawnPositions.length - 1);
    let chosenPosition = validSpawnPositions[pos];
    let positionsTried = 0;
    console.log(chosenPosition);
    while (this.scene.spawnManager.evaluateRealSpawnPosOfEnemies(chosenPosition.randX, chosenPosition.randY)) {
      positionsTried++;
      if (positionsTried === validSpawnPositions.length) {
        return null;
      }

      let reachedLastPos = pos === validSpawnPositions.length - 1;
      if (!reachedLastPos) {
        pos++;
      } else {
        pos = 0;
      }
      chosenPosition = validSpawnPositions[pos];
    }

    return chosenPosition;
  }

  createEnemy() {
    let spawnPositon = this.building.calculateRandUnitSpawnPosition();
    //let spawnPositon = this.calculateRandUnitSpawnPosition(this.building.validSpawnPositions);
    if (spawnPositon === null) return null;

    let { randX, randY } = spawnPositon;

    let choseRandWeapon = Phaser.Math.Between(0, 1) === 0 ? true : false;
    if (choseRandWeapon) {
      return PathfindingCircle.withChainWeapon(
        this.scene,
        randX,
        randY,
        "blueCircle",
        this.enemyPhysicsGroup,
        this.weaponPhysicsGroup
      );
    } else {
      return PathfindingCircle.withRandWeapon(
        this.scene,
        randX,
        randY,
        "blueCircle",
        this.enemyPhysicsGroup,
        this.weaponPhysicsGroup
      );
    }
  }

  doMoreSpawn() {
    return this.enemyCount != 10;
  }
}
