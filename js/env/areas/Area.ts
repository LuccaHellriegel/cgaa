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
  width: number;
  height: number;

  constructor(
    scene: Gameplay,
    sizeOfXAxis: number,
    sizeOfYAxis: number,
    topLeftX,
    topLeftY,
    unitForPart
  ) {
    this.scene = scene;
    this.physicsGroup = scene.physics.add.staticGroup();

    for (let row = 0; row < sizeOfYAxis; row++) {
      this.parts[row] = [];
      for (let column = 0; column < sizeOfXAxis; column++) {
        this.parts[row].push(new AreaPart(null));
      }
    }

    this.sizeOfXAxis = sizeOfXAxis;
    this.sizeOfYAxis = sizeOfYAxis;
    this.topLeftX = topLeftX
    this.topLeftY = topLeftY

    this.x = topLeftX + unitForPart * (sizeOfXAxis / 2);
    this.y = topLeftY + unitForPart * (sizeOfYAxis / 2);

    this.width = sizeOfXAxis * unitForPart
    this.height = sizeOfYAxis * unitForPart
  }
}
