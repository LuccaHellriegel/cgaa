import { Gameplay } from "../../scenes/Gameplay";

export abstract class Populator {
  enemyWeapons: Phaser.Physics.Arcade.Group;
  enemyPhysics: Phaser.Physics.Arcade.Group;
  enemyCount: number = 0;
  scene: Gameplay;

  constructor(scene: Gameplay, enemyPhysics: Phaser.Physics.Arcade.Group, enemyWeapons: Phaser.Physics.Arcade.Group) {
    this.enemyPhysics = enemyPhysics;
    this.enemyWeapons = enemyWeapons;
    this.scene = scene;
  }

  abstract addEnemyToControlInstance(enemy);

  abstract createEnemy();

  abstract doMoreSpawn();

  startPopulating() {
    let enemy = this.createEnemy();
    if (enemy != null) {
      this.addEnemyToControlInstance(enemy);
      this.scene.unitManager.enemies.push(enemy);
      this.enemyCount++;
    }
    if (this.doMoreSpawn()) {
      this.scene.time.addEvent({
        delay: Phaser.Math.Between(100, 5000),
        callback: this.startPopulating,
        callbackScope: this,
        repeat: 0
      });
    }
  }
}
