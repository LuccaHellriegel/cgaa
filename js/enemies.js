class EnemyCircle extends Phaser.Physics.Arcade.Sprite {

    constructor (scene, x, y, )
    {
        super(scene, x, y);
        this.setTexture('character');
        scene.add.existing(this);

        this.hp = new HealthBar(scene, x-26, y-38, 46, 12);
    }

    preUpdate (time, delta)
    {
        //TODO: might be able to push move to hp class?
        this.hp.move(this.x-26, this.y-38)
        super.preUpdate(time, delta);
    }

    damage (amount)
    {
        this.flee()
        if (this.hp.decrease(amount))
        {
            this.destroy()
        }
    }

    flee() 
    {
       this.setVelocityY(-100)
    }


    destroy()
    {
        super.destroy()
        this.hp.destroy()
    }
}