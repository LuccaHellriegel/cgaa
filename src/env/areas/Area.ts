import { Gameplay } from "../../scenes/Gameplay";
import { AreaPart } from "./AreaPart";
import { AreaService } from "./AreaService";

export class Area {
  parts: AreaPart[][] = [];
  x: any;
  y: any;
  sizeOfXAxis: number;
  sizeOfYAxis: number;
  topLeftX: any;
  topLeftY: any;
  width: number;
  height: number;

  constructor(
    sizeOfXAxis: number,
    sizeOfYAxis: number,
    topLeftX,
    topLeftY,
    unitForPart
  ) {

    for (let row = 0; row < sizeOfYAxis; row++) {
      this.parts[row] = [];
      for (let column = 0; column < sizeOfXAxis; column++) {
        this.parts[row].push(new AreaPart(null));
      }
    }

    this.sizeOfXAxis = sizeOfXAxis;
    this.sizeOfYAxis = sizeOfYAxis;

    this.topLeftX = topLeftX;
    this.topLeftY = topLeftY;

    this.width = sizeOfXAxis * unitForPart;
    this.height = sizeOfYAxis * unitForPart;
  } 

  calculateWalkableArr() {
    return AreaService.createWalkableArr(this.parts);
  }
}
