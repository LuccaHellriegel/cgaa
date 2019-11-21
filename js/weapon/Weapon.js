//TODO: deactivate acracde body once everything is switched to polygon
export class Weapon extends Phaser.Physics.Arcade.Sprite {
    //TODO: make param ordering for other extended sprites like this
    constructor(scene, x, y, texture, weaponGroup) {
        //TODO: weapon body must be as big as all rotation states
        super(scene, x, y, texture);
        scene.add.existing(this);
        weaponGroup.add(this);
        this.alreadyAttacked = [];
        this.attacking = false;
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
