import {
    RectPolygon, CompositeRectPolygon
} from "./polygon"

class Weapon extends Phaser.Physics.Arcade.Sprite {
    //TODO: make param ordering for other extended sprites like this
    constructor(scene, x, y, texture, weaponGroup) {
        //TODO: weapon body must be as big as all rotation states
        super(scene, x, y, texture)
        scene.add.existing(this)
        weaponGroup.add(this)
        this.alreadyAttacked = []
        this.attacking = false
        this.on('animationcomplete', function (anim, frame) {
            this.emit('animationcomplete_' + anim.key, anim, frame);
        }, this);
        this.on('animationcomplete_attack', function () {
            //weapon.anims.play('idle');
            this.attacking = false;
            this.alreadyAttacked = []
        }, this)

    }
}

class RandWeapon extends Weapon {
    constructor(scene, x, y, weaponGroup) {
        super(scene, x, y, "randWeapon", weaponGroup)
        //TODO: variable for each weapon
        let polygonX = x - 32
        let polygonY = y - 32
        //TODO: polygon per frame
        this.polygon = new CompositeRectPolygon([[polygonX + 27, polygonY, 10, 64], [polygonX + 27, polygonY, 64, 20]])
    }
    movePolygon() {
        this.polygon.setPosition(this.x, this.y)
        this.polygon.rotate(this.rotation)
    }
}

module.exports = {
    RandWeapon
}