import { Gameplay } from "../../scenes/Gameplay";

export abstract class Populator {
  weaponPhysicsGroup: Phaser.Physics.Arcade.Group;
  enemyPhysicsGroup: Phaser.Physics.Arcade.Group;
  enemyCount: number = 0;
  scene: Gameplay;

  constructor(scene: Gameplay, enemyPhysicsGroup: Phaser.Physics.Arcade.Group, weaponPhysicsGroup: Phaser.Physics.Arcade.Group) {
    this.enemyPhysicsGroup = enemyPhysicsGroup;
    this.weaponPhysicsGroup = weaponPhysicsGroup;
    this.scene = scene;
  }

  abstract addEnemyToControlInstance(enemy);

  abstract createEnemy();

  abstract doMoreSpawn();

  startPopulating() {
    let enemy = this.createEnemy();
    if (enemy != null) {
      this.addEnemyToControlInstance(enemy);
      this.scene.enemyManager.elements.push(enemy);
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
