import { CircleWithRandWeapon } from "../unit/CircleWithRandWeapon";
import { CircleWithChainWeapon } from "../unit/CircleWithChainWeapon";
import { HealthBar } from "../unit/HealthBar";
import { normalCircleRadius } from "../app/sizes";
import { Gameplay } from "../app/gameplay";

export class EnemyCircle extends CircleWithChainWeapon {
  hasBeenAttacked: boolean;
  healthbar: HealthBar;

  constructor(scene: Gameplay, x, y, texture, physicsGroup, weaponGroup) {
    super(scene, x, y, texture, physicsGroup, weaponGroup);
    this.hasBeenAttacked = false;
    this.healthbar = new HealthBar(scene, x - 26, y - 38, 46, 12);
  }

  moveAndTurnToPlayer() {
    let radiusOfCirclePlusRadiusOfPlayerPlusWeaponRadius =
      normalCircleRadius + normalCircleRadius + 32;
    let distanceToPlayerSmallEnough =
      Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.scene.player.x,
        this.scene.player.y
      ) < radiusOfCirclePlusRadiusOfPlayerPlusWeaponRadius;
    if (!distanceToPlayerSmallEnough) {
      this.scene.physics.moveToObject(this, this.scene.player, 160);
    } else {
      this.setVelocity(0, 0);
    }

    let newRotation = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.player.x,
      this.scene.player.y
    );
    let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;
    this.setRotation(newRotation + correctionForPhasersMinus90DegreeTopPostion);
  }

  attackPlayer() {
    this.moveAndTurnToPlayer();
    let distanceBetweenPlayerAndEnemy = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.scene.player.x,
        this.scene.player.y)
    //TODO: is dependedant on circle radius    
    let weaponsLastPolygonReachesPlayer = this.weapon.polygonArr[this.weapon.polygonArr.length -1].getHeight()+30 > distanceBetweenPlayerAndEnemy
    if (weaponsLastPolygonReachesPlayer) {
      this.attack();
    }
  }

  damage(amount) {
    this.scene.events.emit("enemyDamaged", amount);
    if (this.healthbar.decrease(amount)) {
      this.destroy();
    } else {
      super.damage(amount);
      this.hasBeenAttacked = true;
    }
  }

  destroy() {
    super.destroy();
    this.healthbar.destroy();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.healthbar.move(this.x - 26, this.y - 38);
    if (this.hasBeenAttacked) this.attackPlayer();
  }
}
