class Enemy extends CircleHBWithWeapon {
    constructor (scene, texture, physicsGroup, x, y, weaponGroup, physics){
        super(scene, texture, physicsGroup, x, y, weaponGroup)
        this.hasBeenAttacked = false;
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
        if(this.hasBeenAttacked){
            game.scene.scenes[0].physics.moveToObject(this, game.player, 100);
            //TODO: fix angle of weapon
            let angle = Phaser.Math.Angle.Between(this.x, this.y, game.player.x 
                + game.scene.scenes[0].cameras.main.scrollX, game.player.y 
                + game.scene.scenes[0].cameras.main.scrollY)
            this.rotation = angle
            this.attack()
        }
        

    }

    damage(amount){
        super.damage(amount)
        this.hasBeenAttacked = true;
    }
}
