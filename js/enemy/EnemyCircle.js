import {
    CircleWithRandWeapon
} from "../unit/CircleWithRandWeapon";
export class EnemyCircle extends CircleWithRandWeapon {
    constructor(scene, x, y, texture, physicsGroup, weaponGroup) {
        super(scene, x, y, texture, physicsGroup, weaponGroup);
        this.hasBeenAttacked = false;
    }

    moveAndTurnToPlayer() {
        this.scene.physics.moveToObject(this, this.scene.player, 100);
        let newRotation = Phaser.Math.Angle.Between(this.x, this.y, this.scene.player.x +
            this.scene.cameras.main.scrollX, this.scene.player.y +
            this.scene.cameras.main.scrollY);
        this.setRotation(newRotation);
    }

    attackPlayer(){
        this.moveAndTurnToPlayer()
        let playerIsCloseEnough = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 100
        if (playerIsCloseEnough) {
            this.attack();
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.hasBeenAttacked) this.attackPlayer()
    }

    damage(amount) {
        super.damage(amount);
        this.hasBeenAttacked = true;
    }
}