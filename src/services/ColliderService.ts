import { Gameplay } from "../scenes/Gameplay";
import { Weapon } from "../weapons/Weapon";
import { Circle } from "../units/circles/Circle";
import { campColors } from "../globals/globalColors";

export class ColliderService {
  private constructor() {}

  static addCollisionDetection(scene: Gameplay) {
    this.addCombatCollision(scene);
    this.addEnvCollider(scene);
  }

  private static addCombatCollision(scene: Gameplay) {
    for (let index = 0; index < campColors.length; index++) {
      scene.physics.add.collider(scene.player.physicsGroup, scene.enemyManager.enemyPhysicGroups[campColors[index]]);

      scene.physics.add.overlap(
        scene.player.weapon.physicsGroup,
        scene.enemyManager.enemyPhysicGroups[campColors[index]],
        this.doDamage,
        this.considerDamage,
        this
      );

      scene.physics.add.overlap(
        scene.enemyManager.weaponPhysicGroups[campColors[index]],
        scene.player.physicsGroup,
        this.doDamage,
        this.considerDamage,
        this
      );
    }

    for (let index = 1; index < campColors.length; index++) {
      scene.physics.add.collider(
        scene.enemyManager.enemyPhysicGroups[campColors[index - 1]],
        scene.enemyManager.enemyPhysicGroups[campColors[index]],
        this.bounceCallback,
        null,
        this
      );

      scene.physics.add.overlap(
        scene.enemyManager.weaponPhysicGroups[campColors[index - 1]],
        scene.enemyManager.enemyPhysicGroups[campColors[index]],
        this.doDamage,
        this.considerDamage,
        this
      );

      scene.physics.add.overlap(
        scene.enemyManager.weaponPhysicGroups[campColors[index]],
        scene.enemyManager.enemyPhysicGroups[campColors[index - 1]],
        this.doDamage,
        this.considerDamage,
        this
      );
    }
  }

  private static doDamage(weapon, enemy) {
    weapon.alreadyAttacked.push(enemy.id);
    enemy.damage(weapon.amount);
  }

  private static considerDamage(weapon: Weapon, enemy) {
    if (weapon.attacking && !weapon.alreadyAttacked.includes(enemy.id)) {
      weapon.syncPolygon();
      enemy.syncPolygon();
      let collision = weapon.polygon.checkForCollision(enemy.polygon);
      return collision;
    }

    return false;
  }

  private static bounceCallback(unit: Circle, rect) {
    let x = unit.x;
    let y = unit.y;
    let angle = Phaser.Math.Angle.Between(rect.x, rect.y, x, y);

    let bounceBackDistance = 0.5;
    let x1 = x + Math.cos(angle) * bounceBackDistance;
    let y1 = y + Math.sin(angle) * bounceBackDistance;
    unit.setPosition(x1, y1);
    unit.setVelocity(0, 0);

    //TODO: this is to fine grained
    unit.state = "idle";
  }

  private static addEnvCollider(scene: Gameplay) {
    scene.physics.add.collider(
      scene.player.physicsGroup,
      scene.envManager.physicsGroup,
      this.bounceCallback,
      null,
      this
    );

    scene.physics.add.collider(
      scene.player.physicsGroup,
      scene.towerManager.physicsGroup,
      this.bounceCallback,
      null,
      this
    );

    for (let index = 0; index < campColors.length; index++) {
      campColors[index];

      scene.physics.add.collider(
        scene.enemyManager.enemyPhysicGroups[campColors[index]],
        scene.envManager.physicsGroup,
        this.bounceCallback,
        null,
        this
      );

      scene.physics.add.collider(
        scene.enemyManager.enemyPhysicGroups[campColors[index]],
        scene.towerManager.physicsGroup,
        this.bounceCallback,
        null,
        this
      );
    }
  }
}
