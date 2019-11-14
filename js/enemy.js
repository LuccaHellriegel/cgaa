import {
    AggressiveCircle
} from "./unit";
import {
    doDamage,
    considerDamage
} from "./combat";

class EnemyCircle extends AggressiveCircle {
    constructor(scene, texture, physicsGroup, x, y, weaponGroup, player) {
        super(scene, texture, physicsGroup, x, y, weaponGroup)
        this.hasBeenAttacked = false;
        this.player = player
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.hasBeenAttacked) {
            this.scene.physics.moveToObject(this, this.player, 100);
            //TODO: fix angle of weapon
            let angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x +
                this.scene.cameras.main.scrollX, this.player.y +
                this.scene.cameras.main.scrollY)
            this.setRotation(angle)
            if (Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y) < 100) {
                this.attack()
            }
        }


    }

    damage(amount) {
        super.damage(amount)
        this.hasBeenAttacked = true;
    }
}

function spawnRedEnemyCircles(scene, count, radius, playerWeaponGroup, player) {
    const enemies = scene.physics.add.group();
    const enemyWeapons = scene.physics.add.group();   

    for (let index = 0; index < count; index++) {
        new EnemyCircle(scene, "redCircle", enemies, (index * 70) + 12, 200, enemyWeapons, player).setCircle(radius)
    }
    scene.physics.add.overlap(playerWeaponGroup, enemies, doDamage, considerDamage, scene);
    return enemyWeapons
}

module.exports = {
    spawnRedEnemyCircles
}