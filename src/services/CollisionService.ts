import { Gameplay } from "../scenes/Gameplay";
import { Weapon } from "../weapons/Weapon";

export class CollisionService {
  private constructor() {}

  static addCollisionDetection(scene: Gameplay) {
    this.addCombatCollision(scene);
    this.addAreaCollision(scene);
  }

  private static addCombatCollision(scene: Gameplay) {
    scene.physics.add.collider(scene.player.physicsGroup, scene.unitManager.enemyPhysics);

    scene.physics.add.overlap(
      scene.player.weapon.physicsGroup,
      scene.unitManager.enemyPhysics,
      this.doDamage,
      this.considerDamage,
      this
    );

    //TODO: rename enemyWeapons to group
    scene.physics.add.overlap(
      scene.unitManager.enemyWeapons,
      scene.player.physicsGroup,
      this.doDamage,
      this.considerDamage,
      this
    );
  }

  private static doDamage(weapon, enemy) {
    weapon.alreadyAttacked.push(enemy.id);
    //TODO: amount is saved on weapon
    enemy.damage(50);
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

  //TODO: can push other Sprite into wall
  private static bounceCallback(unit, rect) {
    let x = unit.x;
    let y = unit.y;
    let angle = Phaser.Math.Angle.Between(rect.x, rect.y, x, y);

    let bounceBackDistance = 0.5;
    let x1 = x + Math.cos(angle) * bounceBackDistance;
    let y1 = y + Math.sin(angle) * bounceBackDistance;
    unit.setPosition(x1, y1);
    unit.setVelocity(0, 0);
  }

  private static addAreaCollision(scene: Gameplay) {
    scene.physics.add.collider(
      scene.player.physicsGroup,
      scene.areaManager.physicsGroup,
      this.bounceCallback,
      null,
      this
    );
    scene.physics.add.collider(
      scene.unitManager.enemyPhysics,
      scene.areaManager.physicsGroup,
      this.bounceCallback,
      null,
      this
    );
  }
}
