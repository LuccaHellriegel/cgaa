class EnemyCircle extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y)
    {
        super(scene, x, y);

        this.setTexture('character');
        this.setPosition(x, y);

        scene.add.existing(this);

        this.alive = true;

        this.hp = new HealthBar(scene, x-20, y-20);

    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
    }

    damage (amount)
    {
        if (this.hp.decrease(amount))
        {
            this.alive = false;
        }
    }

    destroy()
    {
        super.destroy()
        this.hp.destroy()
    }
}