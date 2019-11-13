class Weapon extends Phaser.Physics.Arcade.Sprite {
    //TODO: make param ordering for other extended sprites like this
    constructor (scene, x, y, texture, weaponGroup)
    {
        super(scene, x, y, texture)
        scene.add.existing(this)
        weaponGroup.add(this)
        this.alreadyAttacked = []
        this.attacking = false
    }
}

//TODO: need to create spritesheet from this then
function generateRandWeapon(hexColor, title, radius, scene){
        var graphics = scene.add.graphics({ fillStyle: { color: hexColor } });
        var circle = new Phaser.Geom.Circle(50, 50, radius);
        graphics.fillCircleShape(circle);
        graphics.generateTexture(title,4*radius,4*radius);
        graphics.destroy()
    
    }
}