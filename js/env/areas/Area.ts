import { Gameplay } from "../../scenes/Gameplay";
import { AreaPart } from "./AreaPart";

export class Area {
  parts: AreaPart[][] = [];
  x: any;
  y: any;
  scene: Gameplay;
  physicsGroup: Phaser.Physics.Arcade.StaticGroup;
  sizeOfXAxis: number;
  sizeOfYAxis: number;

  constructor(
    scene: Gameplay,
    sizeXAxis: number,
    sizeYAxis: number,
    topLeftX,
    topLeftY,
    unitForPart
  ) {
    this.scene = scene;
    this.physicsGroup = scene.physics.add.staticGroup();

    let size = sizeYAxis;
    while (size--) this.parts[size] = [];

    this.sizeOfXAxis = sizeXAxis;
    this.sizeOfYAxis = sizeYAxis;

    this.x = topLeftX + unitForPart * (sizeXAxis / 2);
    this.y = topLeftY + unitForPart * (sizeYAxis / 2);
  }

}
