const playerTextureName = "blueNormalCircle";

export class Circle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCircle(this.texture.get(0).halfWidth);
  }

  static player(scene: Phaser.Scene, x: number, y: number) {
    return new Circle(scene, x, y, playerTextureName);
  }
}
