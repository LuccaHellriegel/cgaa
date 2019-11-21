import {
    CircleWithRandWeapon
} from "../unit/CircleWithRandWeapon";
export class EnemyCircle extends CircleWithRandWeapon {
    constructor(scene, x, y, texture, physicsGroup, weaponGroup) {
        super(scene, x, y, texture, physicsGroup, weaponGroup);
        this.hasBeenAttacked = false;
    }

    moveAndTurnToPlayer() {
        let radiusOfCirclePlusRadiusOfPlayerPlusWeaponRadius = 30 + 30 + 32
        let distanceToPlayerSmallEnough = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < radiusOfCirclePlusRadiusOfPlayerPlusWeaponRadius
        if (!distanceToPlayerSmallEnough) {
            this.scene.physics.moveToObject(this, this.scene.player, 100);
        } else {
            this.setVelocity(0, 0)
        }

        let newRotation = Phaser.Math.Angle.Between(this.x, this.y, this.scene.player.x , this.scene.player.y);
        let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90
        this.setRotation(newRotation + correctionForPhasersMinus90DegreeTopPostion);
    }

    attackPlayer() {
        this.moveAndTurnToPlayer()
        let weaponReachesPlayer = this.weapon.polygon.checkForCollision(this.scene.player)
        if (weaponReachesPlayer) {
            this.attack();
        }
    }

    preUpdate(time, delta) {
        if (this.hasBeenAttacked) this.attackPlayer()
        super.preUpdate(time, delta);
    }

    damage(amount) {
        super.damage(amount);
        this.hasBeenAttacked = true;
    }
}