import {
    CirclePolygon
} from "./polygon"
import {
    HealthBar
} from "./healthbar";
import {
    RandWeapon
} from "./weapon";

class Unit extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, physicsGroup) {
        super(scene, x, y)
        this.setTexture(texture)
        this.physicsGroup = physicsGroup
        this.id = '_' + Math.random().toString(36).substr(2, 9);

        scene.add.existing(this)
        physicsGroup.add(this)
    }

}

class Circle extends Unit {
    constructor(scene, x, y, texture, physicsGroup) {
        //TODO: add radius here
        super(scene, x, y, texture, physicsGroup)
        this.healthbar = new HealthBar(scene, x - 26, y - 38, 46, 12);
        this.polygon = new CirclePolygon(x, y, 30)
        this.setCircle(30)
    }
    damage(amount) {
        if (this.healthbar.decrease(amount)) {
            //TODO: respawn
            if (this === this.scene.player) {
                this.scene.player.healthbar.value = 100
            } else {
                this.destroy()
            }
        }
    }

    destroy() {
        super.destroy()
        this.healthbar.destroy()
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.healthbar.move(this.x - 26, this.y - 38)
        //TODO: make radius as option
        //TODO: make setter for CirclePolygon
        this.polygon = new CirclePolygon(this.x, this.y, 30)

    }
}

class CircleWithRandWeapon extends Circle {
    constructor(scene, x, y, texture, physicsGroup, weaponGroup) {
        super(scene, x, y, texture, physicsGroup)
        this.weapon = new RandWeapon(scene, x + 30, y - 30, weaponGroup);
        this.weaponGroup = weaponGroup
    }
    attack() {
        if (!this.weapon.attacking) {
            this.weapon.attacking = true
            this.weapon.anims.play("attack")

        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta)
        let point = Phaser.Math.RotateAround(new Phaser.Geom.Point(this.x + 30, this.y - 30), this.x, this.y, this.rotation)
        this.weapon.setPosition(point.x, point.y)
        this.weapon.setRotation(this.rotation)
        this.weapon.movePolygon()
    }

    destroy() {
        super.destroy()
        this.weapon.destroy()
    }
}

module.exports = {
    CircleWithRandWeapon
}