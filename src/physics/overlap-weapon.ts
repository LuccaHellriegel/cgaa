import { EventSetup } from "../config/EventSetup";
import { HealthComponent } from "../healthbar/HealthBar";
import { DangerousCircle } from "../units/DangerousCircle";
import { PhysicsCircle } from "../weapons/ChainWeapon";

export function initWeaponGroupPair(scene: Phaser.Scene) {
  const weapons = scene.physics.add.group();
  const enemies = scene.physics.add.group();
  const staticEnemies = scene.physics.add.staticGroup();

  function doDamage(weapon: PhysicsCircle, enemy: DangerousCircle) {
    // need to have an eye if this is a good tradeoff vs having more groups
    if (weapon.campID !== enemy.campID) {
      let damage =
        weapon.attackingFactor * weapon.didDamageFactor * weapon.amount;
      let enemyStateHandler = enemy.stateHandler;

      //TODO: player physics to avoid the check???
      if (weapon.unitType === "player") {
        //Gain souls if player kill (otherwise too much money)
        if (damage >= (enemy.health as HealthComponent).health)
          EventSetup.gainSouls(weapon.scene, enemy.type);
      }

      if (damage > 0) {
        enemy.damage(damage);
        weapon.didDamageFactor = 0;
      }

      if (enemyStateHandler) {
        enemyStateHandler.spotted = weapon.owner;
        enemyStateHandler.obstacle = weapon.owner;
      }
    }
  }

  scene.physics.add.overlap(weapons, enemies, doDamage);
  scene.physics.add.overlap(weapons, staticEnemies, doDamage);

  return {
    addToWeapon: function (newWeapon: Phaser.GameObjects.GameObject) {
      weapons.add(newWeapon);
    },
    addToEnemy: function (unit: Phaser.GameObjects.GameObject) {
      enemies.add(unit);
    },
    addToStaticEnemy: function (unit: Phaser.GameObjects.GameObject) {
      staticEnemies.add(unit);
    },
  };
}
