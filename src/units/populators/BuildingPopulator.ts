import { Populator } from "./Populator";
import { Gameplay } from "../../scenes/Gameplay";
import { Building } from "../../env/buildings/Building";
import EasyStar from "easystarjs";
import { EnemyCircle } from "../circles/EnemyCircle";
import { PathfindingCircle } from "../circles/PathfindingCircle";

export class BuildingPopulator extends Populator {
  easyStar: EasyStar.js;
  building: Building;

  constructor(
    scene: Gameplay,
    enemyPhysics: Phaser.Physics.Arcade.Group,
    enemyWeapons: Phaser.Physics.Arcade.Group,
    building: Building,
    easyStar
  ) {
    super(scene, enemyPhysics, enemyWeapons);
    this.easyStar = easyStar;
    this.building = building;
  }

  addEnemyToControlInstance(enemy) {
    this.building.enemies.push(enemy);
  }

  createEnemy() {
    let spawnPositon = this.building.calculateRandUnitSpawnPosition();
    if (spawnPositon === null) return null;

    let { randX, randY } = spawnPositon;

    let choseRandWeapon = Phaser.Math.Between(0, 1) === 0 ? true : false;
    if (choseRandWeapon) {
      return PathfindingCircle.withChainWeapon(
        this.scene,
        randX,
        randY,
        "blueCircle",
        this.enemyPhysics,
        this.enemyWeapons,
        this.easyStar
      );
    } else {
      return PathfindingCircle.withRandWeapon(
        this.scene,
        randX,
        randY,
        "blueCircle",
        this.enemyPhysics,
        this.enemyWeapons,
        this.easyStar
      );
    }
  }
  doMoreSpawn() {
    return this.enemyCount != 10;
  }
}
