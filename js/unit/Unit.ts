import { Gameplay } from "../app/gameplay";

export class Unit extends Phaser.Physics.Arcade.Sprite {
    physicsGroup: Phaser.Physics.Arcade.Group;
    id: string;
    scene: Gameplay;

    constructor(scene: Gameplay, x, y, texture, physicsGroup) {
        super(scene, x, y, "")
        this.setTexture(texture)
        this.physicsGroup = physicsGroup
        this.id = '_' + Math.random().toString(36).substr(2, 9);

        scene.add.existing(this)
        physicsGroup.add(this)
    }

}