import { Gameplay } from "../scenes/Gameplay";

export class Sprite extends Phaser.Physics.Arcade.Sprite {
  physicsGroup: Phaser.Physics.Arcade.Group;
  id: string;
  scene: Gameplay;

  constructor(scene: Gameplay, x, y, texture, physicsGroup) {
    super(scene, x, y, texture);
    this.physicsGroup = physicsGroup;
    this.id =
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9);

    scene.add.existing(this);
    physicsGroup.add(this);
  }
}

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
