import { Gameplay } from "../../scenes/Gameplay";

export abstract class Populator {
  enemyCount: number = 0;
  scene: Gameplay;

  constructor(
    scene: Gameplay,
  ) {
    this.scene = scene;
  }

  abstract createEnemy();

  abstract doMoreSpawn();

  startPopulating() {
    let enemy = this.createEnemy();
    if (enemy != null) {
      this.scene.enemies.addEnemy(enemy)
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