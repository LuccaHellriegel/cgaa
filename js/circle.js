class Circle extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, texture, physicsGroup, x, y)
    {
        super(scene, x, y)
        this.setTexture(texture)
        this.id = '_' + Math.random().toString(36).substr(2, 9);
        scene.add.existing(this)
        physicsGroup.add(this)
    }

}

class CircleWithHealthBar extends Circle {
    constructor (scene, texture, physicsGroup, x, y){
        super(scene, texture, physicsGroup, x, y)
        this.healthbar = new HealthBar(scene, x-26, y-38, 46, 12);
    }
    
    flee() 
    {
       this.setVelocityY(-100)
    }
    
    damage (amount)
    {
        this.flee()
        if (this.healthbar.decrease(amount))
        {
            this.destroy()
        }
    }

    destroy()
    {
        super.destroy()
        this.healthbar.destroy()
    }

     flee() 
    {
       this.setVelocityY(-100)
       this.rotation = this.rotation-5
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
        this.healthbar.move(this.x-26, this.y-38)     
        
    }

}

class CircleHBWithWeapon extends CircleWithHealthBar {
    constructor (scene, texture, physicsGroup, x, y){
        super(scene, texture, physicsGroup, x, y)
        this.weapon = new Weapon(scene, x+30,y-30, "weapon");
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time,delta)
        var point = Phaser.Math.RotateAround(new Phaser.Geom.Point(this.x+30, this.y-30), this.x, this.y, this.rotation)
        this.weapon.setPosition(point.x,point.y)
        this.weapon.rotation = this.rotation
    }

    destroy () 
    {
        super.destroy()
        this.weapon.destroy()
    }
}

 //TODO: make AI check in preUpdate
 //If distance to player <