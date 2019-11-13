class Enemy extends UnitHBWithWeapon {
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
            if(Phaser.Math.Distance.Between(this.x,this.y, game.player.x, game.player.y) < 100){
            this.attack()
            }
        }
        

    }

    damage(amount){
        super.damage(amount)
        this.hasBeenAttacked = true;
    }
}

function generateRedEnemyCircles(scene, count, radius, playerWeaponGroup){
    const enemies = scene.physics.add.group();
    const enemyWeapons = scene.physics.add.group();

    generateCircleTexture(0xff0000, "redCircle", radius, scene)

    for (let index = 0; index < count; index++) {
        new Enemy(scene,"redCircle",enemies,(index*70)+12,200, enemyWeapons).setCircle(radius, radius, radius)
    }
    scene.physics.add.overlap(playerWeaponGroup, enemies, enemyCollision, null, scene);
    return enemyWeapons
}
