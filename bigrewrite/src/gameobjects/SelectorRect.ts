export class SelectorRect extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x, y) {
    super(scene, x, y, "selectorRect");
    this.setFrame(1);
    this.scene.add.existing(this);
    this.scene.physics.add.staticGroup(this);
    this.setActive(true).setVisible(true);
  }
}
