import { Gameplay } from "../scenes/Gameplay";
import { BasePhysicalPositionConfig, BaseService } from "./Base";

export interface BasePhaser extends BasePhysicalPositionConfig {
  texture: string;
}

export abstract class Sprite extends Phaser.Physics.Arcade.Sprite {
  physicsGroup: Phaser.Physics.Arcade.Group;
  id: string;
  scene: Gameplay;

  constructor(config: BasePhaser) {
    super(config.scene, config.x, config.y, config.texture);
    BaseService.applyBasePhysicsConfig(this, config);
    BaseService.extendWithNewId(this);
    BaseService.makePhysical(this, config);
  }
}

export abstract class SpriteWithAnimEvents extends Sprite {
  constructor(config: BasePhaser) {
    super(config);
    this.on(
      "animationcomplete",
      function(anim, frame) {
        this.emit("animationcomplete_" + anim.key, anim, frame);
      },
      this
    );
  }
}

export class Image extends Phaser.Physics.Arcade.Image {
  physicsGroup: Phaser.Physics.Arcade.Group;
  scene: Gameplay;
  owner;

  constructor(config: BasePhaser) {
    super(config.scene, config.x, config.y, config.texture);
    BaseService.applyBasePhysicsConfig(this, config);
    BaseService.makePhysical(this, config);
  }
}
