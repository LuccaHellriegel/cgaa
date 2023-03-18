import { Shooter } from "./Shooter";
import { TowerSetup } from "../config/TowerSetup";
import { Bullet } from "./Bullet";

export class Bullets extends Phaser.Physics.Arcade.Group {
  constructor(scene, private addBulletToPhysics) {
    super(scene.physics.world, scene);

    this.maxSize = TowerSetup.maxShooters * TowerSetup.maxBullets;

    this.createMultiple({
      frameQuantity: TowerSetup.maxShooters * 2,
      key: "bullet",
      active: false,
      visible: false,
      classType: Bullet,
    });
  }

  fireBullet(x, y, goalX, goalY, shooter: Shooter) {
    let bullet = this.getFirstDead(true);
    this.addBulletToPhysics(bullet);
    bullet.shoot(x, y, goalX, goalY, shooter);
  }
}
