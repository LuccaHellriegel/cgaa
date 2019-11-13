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