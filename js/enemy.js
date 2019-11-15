import {
    CircleWithRandWeapon, Circle
} from "./unit";

class EnemyCircle extends CircleWithRandWeapon {
    constructor(scene, x, y, texture, physicsGroup, weaponGroup) {
        super(scene, x, y, texture, physicsGroup, weaponGroup)
        this.hasBeenAttacked = false;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.hasBeenAttacked) {
            this.scene.physics.moveToObject(this, this.scene.player, 100);
            let angle = Phaser.Math.Angle.Between(this.x, this.y, this.scene.player.x +
                this.scene.cameras.main.scrollX, this.scene.player.y +
                this.scene.cameras.main.scrollY)
            this.setRotation(angle)
            if (Phaser.Math.Distance.Between(this.x, this.y, 
                this.scene.player.x, this.scene.player.y) < 100) {
                this.attack()
            }
        }
    }

    damage(amount) {
        super.damage(amount)
        this.hasBeenAttacked = true;
    }
}

function spawnRedEnemyCircles(scene, count) {
    const enemies = []
    const enemyPhysics = scene.physics.add.group();
    const enemyWeapons = scene.physics.add.group();   

    for (let index = 0; index < count; index++) {
        enemies.push(new EnemyCircle(scene, (index * 70) + 12, 200,  "redCircle", enemyPhysics, enemyWeapons))
    }
    return enemies
}

module.exports = {
    spawnRedEnemyCircles
}