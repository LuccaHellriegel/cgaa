import { Gameplay } from "../app/gameplay";
import { EnemyCircle } from "./circles/EnemyCircle";

export class EnemyManager {
  scene: Gameplay;
  enemyCount: number;
  constructor(scene: Gameplay) {
    this.scene = scene;
    this.enemyCount = 1;
  }

  createEnemies() {
    const enemies = [];
    const enemyPhysics = this.scene.physics.add.group();
    const enemyWeapons = this.scene.physics.add.group();

    for (let index = 0; index < this.enemyCount; index++) {
      enemies.push(
        new EnemyCircle(
          this.scene,
          index * 70 + 120,
          200,
          "redCircle",
          enemyPhysics,
          enemyWeapons
        )
      );
    }
    return enemies
  }
}
