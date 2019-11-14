import {
    RectPolygon
} from "./polygon"

class Weapon extends Phaser.Physics.Arcade.Sprite {
    //TODO: make param ordering for other extended sprites like this
    constructor(scene, x, y, texture, weaponGroup) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        weaponGroup.add(this)
        this.alreadyAttacked = []
        this.attacking = false
        this.on('animationcomplete', function (anim, frame) {
            console.log("here")
            this.emit('animationcomplete_' + anim.key, anim, frame);
        }, this);
        this.on('animationcomplete_attack', function () {
            console.log("here")
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
        //TODO: multi rect polygon
        //TODO: polygon per frame
        this.polygon = new RectPolygon(polygonX + 27, polygonY, 10, 64)
    }
    movePolygon() {
        //TODO: rotate and move without creating new object
        let polygonX = this.x - 32
        let polygonY = this.y - 32
        this.polygon = new RectPolygon(polygonX + 27, polygonY, 10, 64)
    }
}

module.exports = {
    RandWeapon
}