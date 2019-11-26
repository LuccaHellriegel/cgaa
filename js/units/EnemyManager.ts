import { Gameplay } from "../scenes/Gameplay";
import { EnemyCircleWithChainWeapon } from "./circles/EnemyCircleWithChainWeapon";
import { EnemyCircleWithRandWeapon } from "./circles/EnemyCircleWithRandWeapon";

export class EnemyManager {
  scene: Gameplay;
  enemyCount: number;
  timedEvent: any;
  enemyPhysics: any;
  enemyWeapons: any;
  constructor(scene: Gameplay) {
    this.scene = scene;
    this.enemyCount = 1;
    this.enemyPhysics = this.scene.physics.add.group();
    this.enemyWeapons = this.scene.physics.add.group();

    this.timedEvent = scene.time.addEvent({
      delay: 1000,
      callback: this.onEvent,
      callbackScope: this
    });
  }

  onEvent() {
    this.scene.unitManager.enemies = this.scene.unitManager.enemies.concat(
      this.createEnemies()
    );
    this.timedEvent.reset({
      delay: Phaser.Math.Between(100, 5000),
      callback: this.onEvent,
      callbackScope: this,
      repeat: 1
    });
  }

  //TODO: dont spawn on top of other enemies
  createEnemies() {
    const enemies = [];

    let randX = Phaser.Math.Between(100, 1000);
    let randY = Phaser.Math.Between(100, 1000);

    let EnemyCircleClass = Phaser.Math.Between(0,1) === 0 ? EnemyCircleWithChainWeapon : EnemyCircleWithRandWeapon

    for (let index = 0; index < this.enemyCount; index++) {
      enemies.push(
        new EnemyCircleClass(
          this.scene,
          randX,
          randY,
          "redCircle",
          this.enemyPhysics,
          this.enemyWeapons
        )
      );
    }
    return enemies;
  }
}
