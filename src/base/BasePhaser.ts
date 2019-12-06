import { Gameplay } from "../scenes/Gameplay";

export abstract class Sprite extends Phaser.Physics.Arcade.Sprite {
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

export abstract class SpriteWithAnimEvents extends Sprite {
  constructor(scene: Gameplay, x, y, texture, physicsGroup) {
    super(scene, x, y, texture, physicsGroup);
    this.on(
      "animationcomplete",
      function(anim, frame) {
        this.emit("animationcomplete_" + anim.key, anim, frame);
      },
      this
    );
  }
}

export abstract class Image extends Phaser.Physics.Arcade.Image {
  physicsGroup: Phaser.Physics.Arcade.Group;
  scene: Gameplay;

  constructor(scene: Gameplay, x, y, texture, physicsGroup) {
    super(scene, x, y, texture);
    this.physicsGroup = physicsGroup;
    scene.add.existing(this);
    physicsGroup.add(this);
  }
}
