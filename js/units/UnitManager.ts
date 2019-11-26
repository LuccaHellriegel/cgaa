import { Gameplay } from "../app/gameplay";
import { Player } from "../player/Player";
import { EnemyManager } from "./EnemyManager";

export class UnitManager {
  scene: Gameplay;
  enemies: any[];

  constructor(scene: Gameplay) {
    this.scene = scene;
  }

  spawnUnits() {
    new Player(this.scene).setup();
    this.enemies = new EnemyManager(this.scene).createEnemies();
    this.scene.physics.add.collider(this.scene.player, this.enemies);
  }

  private doDamage(weapon, enemy) {
    weapon.alreadyAttacked.push(enemy.id);
    enemy.damage(5);
  }

  private considerDamage(weapon, enemy) {
    return (
      weapon.polygon.checkForCollision(enemy.polygon) &&
      weapon.attacking &&
      !weapon.alreadyAttacked.includes(enemy.id)
    );
  }

  checkWeaponOverlap() {
    for (let index = 0; index < this.enemies.length; index++) {
      let playerWeapon = this.scene.player.weapon;
      let enemy = this.enemies[index];
      let enemyWeapon = enemy.weapon;
      if (this.considerDamage(playerWeapon, enemy)) {
        this.doDamage(playerWeapon, enemy);
      }
      if (this.considerDamage(enemyWeapon, this.scene.player)) {
        this.doDamage(enemyWeapon, this.scene.player);
      }
    }
  }
}
