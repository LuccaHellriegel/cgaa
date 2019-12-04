export abstract class Manager {
  elements: any[] = [];
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, type: string) {
    this.scene = scene;
    scene[type] = this;
  }
}

export abstract class PhysicalManager extends Manager {
  physicsGroup: any;
  constructor(scene: Phaser.Scene, type: string, physicGroupType: string) {
    super(scene, type);
    this.physicsGroup = scene.physics.add[physicGroupType]();
  }
}
