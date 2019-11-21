export class Weapon extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, weaponGroup) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        weaponGroup.add(this);
        this.alreadyAttacked = [];
        this.attacking = false;
        this.disableBody()
        this.setupAnimEvents()
    }

    setupAnimEvents(){
        this.on('animationcomplete', function (anim, frame) {
            this.emit('animationcomplete_' + anim.key, anim, frame);
        }, this);
        
        this.on('animationcomplete_attack', function () {
            this.anims.play('idleWeapon');
            this.attacking = false;
            this.alreadyAttacked = [];
        }, this);
    }
}
