import { Area } from "./Area";

export enum AreaType {
  "empty",
  "camp"
}

export interface AreaConfig {
  color: string,
  sizeOfXAxis: number;
  sizeOfYAxis: number;
  topLeftX: number;
  topLeftY: number;
  unitForPart: number;
  type: AreaType;
  holePosition: number;
  numbOfBuildings: number;
  scene: Phaser.Scene;
}

export class AreaFactory {
  private constructor() {}

  static createArea(areaConfig: AreaConfig) {
    let {
      color,
      sizeOfXAxis,
      sizeOfYAxis,
      topLeftX,
      topLeftY,
      unitForPart,
      type,
      holePosition,
      numbOfBuildings,
      scene
    } = areaConfig;
    let newArea = new Area(sizeOfXAxis, sizeOfYAxis, topLeftX, topLeftY, unitForPart, color);

    if (type === AreaType.camp) {
      newArea.scene = scene;

      newArea.buildWalls();

      //buildings need to be place before holes, otherwise wrong positioning
      newArea.buildBuildings(numbOfBuildings);
      
      newArea.makeHoles(holePosition);
    }

    return newArea;
  }
}
