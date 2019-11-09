class PlayerCircle extends Phaser.Physics.Arcade.Sprite {

    constructor (scene, x, y)
    {
        super(scene, x, y);
        this.setTexture('character');
        scene.add.existing(this);
        this.hp = new PlayerHealthBar(scene, 800-26, 600-38);
    }

    preUpdate (time, delta)
    {
        //TODO: move in relation to whole screen
        this.hp.move(this.x-26, this.y-38)
        super.preUpdate(time, delta);
    }

    damage (amount)
    {
        if (this.hp.decrease(amount))
        {
           //TODO
        }
    }
    
}