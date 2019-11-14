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
        //TODO: variable for each weapon
        let polygonX = x - 32
        let polygonY = y - 32
        //TODO: multi rect polygon
        //TODO: polygon per frame
        this.polygon = new RectPolygon(polygonX + 27, polygonY, 10, 64)
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

    movePolygon() {
        //TODO: rotate and move without creating new object
        let polygonX = this.x - 32
        let polygonY = this.y - 32
        this.polygon = new RectPolygon(polygonX + 27, polygonY, 10, 64)
    }
}

function generateRandWeapon(hexColor, scene) {
    var graphics = scene.add.graphics({
        fillStyle: {
            color: hexColor
        }
    });

    var rect = new Phaser.Geom.Rectangle(27, 0, 10, 64);
    graphics.fillRectShape(rect);

    rect = new Phaser.Geom.Rectangle(64 + 27, 0, 10, 64);
    graphics.fillRectShape(rect);
    var rect_too = new Phaser.Geom.Rectangle(64, 0, 64, 20);
    graphics.fillRectShape(rect_too);
    graphics.generateTexture("randWeapon", 128, 64);
    graphics.destroy()

    //add frames to texture
    scene.textures.list.randWeapon.add(1, 0, 0, 0, 64, 64)
    scene.textures.list.randWeapon.add(2, 0, 64, 0, 64, 64)
}

module.exports = {
    Weapon,
    generateRandWeapon
}