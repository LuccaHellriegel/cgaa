import { Area } from "./Area";

export interface AreaConfig {
  sizeOfXAxis: number;
  sizeOfYAxis: number;
  topLeftX: number;
  topLeftY: number;
  unitForPart: number;
  hasWalls: Boolean;
  hasHoles: Boolean;
  holePosition: number;
  hasBuildings: Boolean;
  numbOfBuildings: number;
  scene: Phaser.Scene;
}

export class AreaFactory {
  private constructor() {}

  static createArea(areaConfig: AreaConfig) {
    let {
      sizeOfXAxis,
      sizeOfYAxis,
      topLeftX,
      topLeftY,
      unitForPart,
      hasWalls,
      hasHoles,
      holePosition,
      hasBuildings,
      numbOfBuildings,
      scene
    } = areaConfig;
    let newArea = new Area(sizeOfXAxis, sizeOfYAxis, topLeftX, topLeftY, unitForPart);

    if (hasWalls || hasBuildings) newArea.scene = scene;

    if (hasWalls) {
      newArea.buildWalls();
      if (hasHoles) newArea.makeHoles(holePosition);
    }
    if (hasBuildings) newArea.buildBuildings(numbOfBuildings);

    return newArea;
  }
}
