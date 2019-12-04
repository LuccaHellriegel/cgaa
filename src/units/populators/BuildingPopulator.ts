import { Populator } from "./Populator";
import { Gameplay } from "../../scenes/Gameplay";
import { Building } from "../../env/buildings/Building";
import EasyStar from "easystarjs";
import { PathfindingCircle } from "../circles/PathfindingCircle";
import { CollisionService } from "../../spawn/CollisionService";
import { SpawnService } from "../../spawn/SpawnService";


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

  calculateRandUnitSpawnPosition(building) {
    return SpawnService.randomlyTryAllSpawnablePosInRelationToEnv(
      building.validSpawnPositions,
      spawnablePosCount => {
        return Phaser.Math.Between(0, spawnablePosCount);
      },
      (x, y) => {
        return CollisionService.checkIfCircleCollidesWithCircles(building.enemies, x, y);
      }
    );
  }

  createEnemy() {
    let spawnPositon = this.calculateRandUnitSpawnPosition(this.building);
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
