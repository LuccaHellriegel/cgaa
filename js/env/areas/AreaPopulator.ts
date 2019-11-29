import { Gameplay } from "../../scenes/Gameplay";
import { EnemyCircle } from "../../units/circles/EnemyCircle";
import { normalCircleRadius } from "../../global";
import { WallArea } from "./WallArea";

export class AreaPopulator {
  scene: Gameplay;
  enemyCount: number;
  timedEvent: any;
  enemyPhysics: Phaser.Physics.Arcade.Group;
  enemyWeapons: Phaser.Physics.Arcade.Group;
  wallArea: WallArea;

  constructor(
    scene: Gameplay,
    enemyPhysics: Phaser.Physics.Arcade.Group,
    enemyWeapons: Phaser.Physics.Arcade.Group,
    wallArea: WallArea
  ) {
    this.scene = scene;
    this.enemyCount = 1;
    this.enemyPhysics = enemyPhysics;
    this.enemyWeapons = enemyWeapons;
    this.wallArea = wallArea;

    this.timedEvent = scene.time.addEvent({});
    this.onEvent();
  }

  onEvent() {
    let prevEnemies: any[] = this.scene.unitManager.enemies
      ? this.scene.unitManager.enemies
      : [];
    this.scene.unitManager.enemies = prevEnemies.concat(this.createEnemies());
    this.timedEvent.reset({
      delay: Phaser.Math.Between(100, 5000),
      callback: this.onEvent,
      callbackScope: this,
      repeat: 1
    });
  }

  //TODO: dont spawn on top of other enemies and on buildings
  createEnemies() {
    const enemies = [];

    //TODO: switch too same idea as building spawning for easier pathfinding
    let {randX, randY} = this.wallArea.calculateRandValidSpawnPosition(normalCircleRadius, normalCircleRadius)

    let EnemyCircleClass =
      Phaser.Math.Between(0, 1) === 0
        ? EnemyCircle.withChainWeapon.bind(EnemyCircle)
        : EnemyCircle.withRandWeapon.bind(EnemyCircle);

    for (let index = 0; index < this.enemyCount; index++) {
      enemies.push(
        EnemyCircleClass(
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