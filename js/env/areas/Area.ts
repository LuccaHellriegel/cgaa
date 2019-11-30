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
  topLeftX: any;
  topLeftY: any;

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

    for (let row = 0; row < sizeYAxis; row++) {
      this.parts[row] = [];
      for (let column = 0; column < sizeXAxis; column++) {
        this.parts[row].push(new AreaPart(null));
      }
    }

    this.sizeOfXAxis = sizeXAxis;
    this.sizeOfYAxis = sizeYAxis;
    this.topLeftX = topLeftX
    this.topLeftY = topLeftY

    this.x = topLeftX + unitForPart * (sizeXAxis / 2);
    this.y = topLeftY + unitForPart * (sizeYAxis / 2);
  }
}
