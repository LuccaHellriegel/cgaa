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
function generateRandWeapon(hexColor, scene){
        var graphics = scene.add.graphics({ fillStyle: { color: hexColor } });   
           
        var rect = new Phaser.Geom.Rectangle(0, 0, 10, 64);
        graphics.fillRectShape(rect);
        
        rect = new Phaser.Geom.Rectangle(37, 0, 10, 64);
        graphics.fillRectShape(rect);
        var rect_too = new Phaser.Geom.Rectangle(10, 0, 64, 20);
        graphics.fillRectShape(rect_too);
        graphics.generateTexture("randWeapon",74,64);
        graphics.destroy()

        scene.textures.list.randWeapon.add(1, 0, 0, 0, 10, 64)
        scene.textures.list.randWeapon.add(2, 0, 10, 0, 64, 64)
        console.log(scene.textures.list.randWeapon)
    }
