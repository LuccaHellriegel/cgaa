import {
    CompositeRectPolygon
} from "./polygon"

//TODO: deactivate acracde body once everything is switched to polygon
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
            this.anims.play('idleWeapon');
            this.attacking = false;
            this.alreadyAttacked = []
        }, this)
    }
}

class RandWeapon extends Weapon {
    constructor(scene, x, y, weaponGroup) {
        super(scene, x, y, "randWeapon", weaponGroup)
        //TODO: variable for each weapon
        //TODO: polygon per frame
        this.polygon = new CompositeRectPolygon([[x, y, 10, 64]])
        this.polygonArr = [new CompositeRectPolygon([[x, y, 10, 64]]) , new CompositeRectPolygon([[x, y, 10, 64], [x, y -22, 64, 20]])]
    }
    //TODO: move -> update
    movePolygon() {
        this.polygon = this.polygonArr[parseInt(this.frame.name)-1]
        this.polygon.setPosition(this.x, this.y)
        this.polygon.rotate(this.rotation)
    }
}

module.exports = {
    RandWeapon
}