import {
    CirclePolygon
} from "./polygon"
import {
    HealthBar
} from "./healthbar";
import {
    Weapon
} from "./weapon";

class Unit extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, physicsGroup, x, y) {
        super(scene, x, y)
        this.setTexture(texture)
        this.id = '_' + Math.random().toString(36).substr(2, 9);
        scene.add.existing(this)
        physicsGroup.add(this)
    }

}

class UnitWithHealthBar extends Unit {
    constructor(scene, texture, physicsGroup, x, y) {
        super(scene, texture, physicsGroup, x, y)
        this.healthbar = new HealthBar(scene, x - 26, y - 38, 46, 12);
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

    }

}

class UnitHBWithWeapon extends UnitWithHealthBar {
    constructor(scene, texture, physicsGroup, x, y, weaponGroup) {
        super(scene, texture, physicsGroup, x, y)
        this.weapon = new Weapon(scene, x + 30, y - 30, "randWeapon", weaponGroup);
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

class AggressiveCircle extends UnitHBWithWeapon {
    constructor(scene, texture, physicsGroup, x, y, weaponGroup) {
        super(scene, texture, physicsGroup, x, y, weaponGroup)
        this.polygon = new CirclePolygon(x, y, 30)
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta)
        //TODO: make radius as option
        //TODO: make setter for Circle
        this.polygon = new CirclePolygon(this.x, this.y, 30)
    }

}

//TODO: where to put this? 
//TODO: why not juste fill in graphics? Why use additional object?
function generateCircleTexture(hexColor, title, radius, scene) {
    let graphics = scene.add.graphics({
        fillStyle: {
            color: hexColor
        }
    });
    let circle = new Phaser.Geom.Circle(radius, radius, radius);
    graphics.fillCircleShape(circle);
    graphics.generateTexture(title, 2 * radius, 2 * radius);
    graphics.destroy()

}

module.exports = {
    AggressiveCircle,
    generateCircleTexture
}