import { Gameplay } from "../scenes/Gameplay";

export abstract class Manager {
  elements: any[] = [];
  scene: Gameplay;

  constructor(scene: Gameplay, type: string) {
    this.scene = scene;
    scene[type] = this;
  }
}

export abstract class PhysicalManager extends Manager {
  physicsGroup: any;
  constructor(scene: Gameplay, type: string, physicGroupType: string) {
    super(scene, type);
    this.physicsGroup = scene.physics.add[physicGroupType]();
  }
}
