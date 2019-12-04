import { Gameplay } from "../scenes/Gameplay";

export class Image extends Phaser.Physics.Arcade.Image {
  physicsGroup: Phaser.Physics.Arcade.Group;
  scene: Gameplay;

  constructor(scene: Gameplay, x, y, texture, physicsGroup) {
    super(scene, x, y, texture);
    this.physicsGroup = physicsGroup;
    scene.add.existing(this);
    physicsGroup.add(this);
  }
}
