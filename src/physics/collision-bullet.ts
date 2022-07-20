import { EventSetup } from "../config/EventSetup";
import { Bullet } from "../towers/Shooter/Bullet";
import { DangerousCircle } from "../units/DangerousCircle/DangerousCircle";

export function initBulletGroupPair(scene: Phaser.Scene) {
  const bullets = scene.physics.add.staticGroup();
  const enemies = scene.physics.add.group();
  scene.physics.add.collider(bullets, enemies, collision);

  return {
    addToBullets: function (bullet: Phaser.GameObjects.GameObject) {
      bullets.add(bullet);
    },
    addToEnemies: function (enemy: Phaser.GameObjects.GameObject) {
      enemies.add(enemy);
    },
  };
}

function collision(bullet: Bullet, enemy: DangerousCircle) {
  if (enemy.damage(bullet.amount)) {
    EventSetup.gainSouls(bullet.scene, enemy.type);
  }
  if (enemy.stateHandler !== undefined)
    enemy.stateHandler.spotted = bullet.owner;
  bullet.hitTarget();
}
