import { Gameplay } from "../../scenes/Gameplay";
import { wallPartRadius } from "../../global";
import { EnemyCircle } from "../circles/EnemyCircle";

export abstract class Populator {
  enemyWeapons: Phaser.Physics.Arcade.Group;
  scene: Gameplay;
  enemyPhysics: Phaser.Physics.Arcade.Group;
  populationReference: any;
  timedEvent: Phaser.Time.TimerEvent;

  constructor(
    scene: Gameplay,
    enemyPhysics: Phaser.Physics.Arcade.Group,
    enemyWeapons: Phaser.Physics.Arcade.Group,
    populationReference
  ) {
    this.scene = scene;
    this.enemyPhysics = enemyPhysics;
    this.enemyWeapons = enemyWeapons;
    this.populationReference = populationReference;

    this.timedEvent = scene.time.addEvent({});
  }

  onEvent() {
    let prevEnemies: any[] = this.scene.unitManager.enemies
      ? this.scene.unitManager.enemies
      : [];
    this.scene.unitManager.enemies = prevEnemies.concat([this.createEnemy()]);
    this.timedEvent.reset({
      delay: Phaser.Math.Between(100, 5000),
      callback: this.onEvent,
      callbackScope: this,
      repeat: 1
    });
  }

  chooseEnemyClass() {
    return Phaser.Math.Between(0, 1) === 0
      ? EnemyCircle.withChainWeapon.bind(EnemyCircle)
      : EnemyCircle.withRandWeapon.bind(EnemyCircle);
  }

  constructEnemy(randX, randY, enemyClass){
    return enemyClass(
      this.scene,
      randX,
      randY,
      "redCircle",
      this.enemyPhysics,
      this.enemyWeapons
    );
  }

  //TODO: dont spawn on top of other enemies and on buildings
  createEnemy() {
    //TODO: switch to same idea as building spawning for easier pathfinding
    let {
      randX,
      randY
    } = this.populationReference.calculateRandValidSpawnPosition(
      wallPartRadius,
      wallPartRadius
    );
    let EnemyCircleClass = this.chooseEnemyClass();

    return this.constructEnemy(randX, randY, EnemyCircleClass)
  }
}
