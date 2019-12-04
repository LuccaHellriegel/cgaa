import { Populator } from "./Populator";
import { Area } from "../../env/areas/Area";
import { Gameplay } from "../../scenes/Gameplay";
import { EnemyCircle } from "../circles/EnemyCircle";

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

  createEnemy() {
    let spawnPositon = this.area.calculateRandUnitSpawnPosition();
    if (spawnPositon === null) return null;

    let { randX, randY } = spawnPositon;

    let choseRandWeapon = Phaser.Math.Between(0, 1) === 0 ? true : false;
    if (choseRandWeapon) {
      return EnemyCircle.withRandWeapon(this.scene, randX, randY, "redCircle", this.enemyPhysicsGroup, this.weaponPhysicsGroup);
    } else {
      return EnemyCircle.withChainWeapon(this.scene, randX, randY, "redCircle", this.enemyPhysicsGroup, this.weaponPhysicsGroup);
    }
  }

  doMoreSpawn() {
    return this.enemyCount != 10;
  }
}
