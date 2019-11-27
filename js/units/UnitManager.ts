import { Gameplay } from "../scenes/Gameplay";
import { Player } from "../player/Player";
import { EnemyManager } from "./EnemyManager";

export class UnitManager {
  scene: Gameplay;
  enemies: any[];

  constructor(scene: Gameplay) {
    this.scene = scene;
  }

  spawnUnits() {
    Player.withChainWeapon(this.scene, 100, 450, "blueCircle",  
    this.scene.physics.add.group(), this.scene.physics.add.group())
    this.enemies = new EnemyManager(this.scene).createEnemies();
    this.scene.physics.add.collider(
      this.scene.player.physicsGroup,
      this.enemies[0].physicsGroup
    );
  }

  private doDamage(weapon, enemy, amount: number) {
    weapon.alreadyAttacked.push(enemy.id);
    enemy.damage(amount);
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
        this.doDamage(playerWeapon, enemy, 50);
      }
      if (this.considerDamage(enemyWeapon, this.scene.player)) {
        this.doDamage(enemyWeapon, this.scene.player, 20);
      }
    }
  }
}
