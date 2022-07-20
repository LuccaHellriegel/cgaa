import { Gameplay } from "../scenes/Gameplay";

export class SelectorRect extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Gameplay, x, y) {
    super(scene, x, y, "selectorRect");
    this.setFrame(2);
    this.setupSceneInteraction();
    this.setupAnims();
    this.setupEvents();
    this.setActive(false).setVisible(false);
  }

  private setupSceneInteraction() {
    this.scene.add.existing(this);
    this.scene.physics.add.staticGroup(this);
  }

  private setupEvents() {
    this.scene.events.on("added-shooter", () => {
      this.scene.children.bringToTop(this);
    });
  }

  private setupAnims() {
    this.on(
      "animationcomplete",
      function (anim, frame) {
        this.emit("animationcomplete_" + anim.key, anim, frame);
      },
      this
    );
    this.on(
      "animationcomplete_invalid-shooter-pos",
      function () {
        this.anims.play("idle-" + this.texture.key);
      },
      this
    );
  }

  toggleOn() {
    if (this.visible) {
      this.turnOff();
    } else {
      this.turnOn();
    }
  }

  turnOn() {
    this.setActive(true).setVisible(true);
  }

  turnOff() {
    this.setActive(false).setVisible(false);
  }

  lockOff() {
    this.setActive(true);
  }

  lockOn() {
    this.setActive(false);
  }
}
