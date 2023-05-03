export abstract class Generator {
  graphics: Phaser.GameObjects.Graphics;
  scene: Phaser.Scene;
  constructor(hexColor: number, scene: Phaser.Scene) {
    this.graphics = scene.add.graphics({
      fillStyle: {
        color: hexColor,
      },
    });
    this.scene = scene;
  }

  generate() {
    this.drawFrames();
    this.generateTexture();
    this.addFrames();
    this.destroyUsedObjects();
  }

  abstract drawFrames();

  abstract generateTexture();

  abstract addFrames();

  destroyUsedObjects() {
    this.graphics.destroy();
  }
}
