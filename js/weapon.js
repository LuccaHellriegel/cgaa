class Weapon extends Phaser.Physics.Arcade.Sprite {
    //TODO: make param ordering for other extended spries like this
    constructor (scene, x, y, texture)
    {
        super(scene, x, y, texture)
        scene.add.existing(this)
        scene.physics.world.enable(this)
        this.alreadyAttacked = []
        this.attacking = false
    }
}