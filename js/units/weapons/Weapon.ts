export abstract class Weapon extends Phaser.Physics.Arcade.Sprite {
    attacking: boolean;
    alreadyAttacked: string[];
    unitOffSetX: number;
    unitOffSetY: number;
    offSetArr: number[][];

    constructor(scene, x, y, texture, weaponGroup,offSetArr) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        weaponGroup.add(this);
        this.alreadyAttacked = [];
        this.attacking = false;
        this.setSize(1, 1)
        this.disableBody()
        this.setupAnimEvents()
        this.unitOffSetX = offSetArr[0][0]
        this.unitOffSetY = offSetArr[0][1]
        this.offSetArr = offSetArr
    }

    setupAnimEvents() {
        this.on('animationcomplete', function (anim, frame) {
            this.emit('animationcomplete_' + anim.key, anim, frame);
        }, this);

        this.on('animationcomplete_attack-' + this.texture.key, function () {
            this.anims.play('idle-' + this.texture.key);
            this.attacking = false;
            this.alreadyAttacked = [];
        }, this);
    }

    setOffSetForFrame(){
        let curFrameIndex = parseInt(this.frame.name) - 1
        this.unitOffSetX = this.offSetArr[curFrameIndex][0]
        this.unitOffSetY = this.offSetArr[curFrameIndex][1]
    }

    preUpdate(time,delta){
        super.preUpdate(time,delta)
        this.setOffSetForFrame()
    }

}