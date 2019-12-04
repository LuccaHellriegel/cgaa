import { Populator } from "./Populator";
import { Area } from "../../env/areas/Area";
import { Gameplay } from "../../scenes/Gameplay";
import { EnemyCircle } from "../circles/EnemyCircle";
import { SpawnService } from "../../spawn/SpawnService";
import { CollisionService } from "../../spawn/CollisionService";

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

  //TODO: think about control instances having only the id, is search more expensive? where do i need it?
  addEnemyToControlInstance(enemy) {
    this.area.enemies.push(enemy);
  }

  calculateRandUnitSpawnPosition(area) {
    if (!area.spawnableArrForEnemies) {
      area.spawnableArrForEnemies = SpawnService.createWalkableArr(area.parts);
    }

    return SpawnService.randomlyTryAllSpawnablePosFromArr(
      area.spawnableArrForEnemies,
      area,
      spawnablePosCount => Phaser.Math.Between(0, spawnablePosCount),
      (x, y) => {
        return CollisionService.checkIfCircleCollidesWithCircles(area.enemies, x, y);
      }
    );
  }

  createEnemy() {
    let spawnPositon = this.calculateRandUnitSpawnPosition(this.area);
    if (spawnPositon === null) return null;

    let { randX, randY } = spawnPositon;

    let choseRandWeapon = Phaser.Math.Between(0, 1) === 0 ? true : false;
    if (choseRandWeapon) {
      return EnemyCircle.withRandWeapon(
        this.scene,
        randX,
        randY,
        "redCircle",
        this.enemyPhysicsGroup,
        this.weaponPhysicsGroup
      );
    } else {
      return EnemyCircle.withChainWeapon(
        this.scene,
        randX,
        randY,
        "redCircle",
        this.enemyPhysicsGroup,
        this.weaponPhysicsGroup
      );
    }
  }

  doMoreSpawn() {
    return this.enemyCount != 10;
  }
}
