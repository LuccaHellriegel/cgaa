import { Area } from "./Area";

export type AreaType = "empty" | "camp";

export type Exit = { position: number, width: number, wallSide: "top"|"bottom"|"left"|"right"};

export interface AreaConfig {
  color: string;
  sizeOfXAxis: number;
  sizeOfYAxis: number;
  topLeftX: number;
  topLeftY: number;
  unitForPart: number;
  type: AreaType;
  exits: Exit[];
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
      exits,
      numbOfBuildings,
      scene
    } = areaConfig;
    let newArea = new Area(sizeOfXAxis, sizeOfYAxis, topLeftX, topLeftY, unitForPart, color);

    if (type === "camp") {
      newArea.scene = scene;

      newArea.buildWalls();

      //buildings need to be place before holes, otherwise wrong positioning
      newArea.buildBuildings(numbOfBuildings);

      newArea.makeExits(exits);
    }

    return newArea;
  }
}
