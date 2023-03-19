import { EventSetup } from "../config/EventSetup";
import { HealthComponent } from "../healthbar/HealthBar";
import { CircleUnit } from "../units/CircleUnit";
import { ChainWeapon } from "../weapons/ChainWeapon";

export function initWeaponGroupPair(scene: Phaser.Scene) {
  const weapons = scene.physics.add.group();
  const enemies = scene.physics.add.group();
  const staticEnemies = scene.physics.add.staticGroup();

  function doDamage(circle: Phaser.Physics.Arcade.Sprite, enemy) {
    let weapon: ChainWeapon = circle.getData("weapon");
    let weaponOwner = weapon.owner as CircleUnit;

    console.log(weapon.attackingFactor, weapon.didDamageFactor);
    // need to have an eye if this is a good tradeoff vs having more groups
    if (weaponOwner.campID !== enemy.campID) {
      let damage =
        weapon.attackingFactor * weapon.didDamageFactor * weapon.amount;
      let enemyStateHandler = enemy.stateHandler;

      //TODO: player physics to avoid the check???
      if (weaponOwner.unitType === "player") {
        //Gain souls if player kill (otherwise too much money)
        if (damage >= (enemy.health as HealthComponent).health)
          EventSetup.gainSouls(weapon.scene, enemy.type);
      }

      enemy.damage(damage);
      // if (damage > 0)
      weapon.didDamageFactor = 0;

      if (enemyStateHandler) {
        enemyStateHandler.spotted = weaponOwner;
        enemyStateHandler.obstacle = weaponOwner;
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
