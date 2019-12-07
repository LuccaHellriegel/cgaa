import { wallPartHalfSize } from "../globals/globalSizes";
import { Area } from "./areas/Area";
import { AreaFactory, AreaConfig, AreaType } from "./areas/AreaFactory";
import { BasePhysicalManagerConfig, BaseService } from "../base/Base";
import { campColors } from "../globals/globalColors";
import { areaSize } from "../globals/globalConfig";
import { Gameplay } from "../scenes/Gameplay";

export class World {
  private borderWall: Area;
  private walkableMap;
  private areas: Area[][] = [];
  physicsGroup;

  //TODO: listen to building destroyed

  private areaConfig: AreaConfig;
  colorIndices: number[];
  scene: Gameplay;

  constructor(config: BasePhysicalManagerConfig) {
    BaseService.applyBasePhysicalManagerConfig(this, config);

    this.colorIndices = [0, 1, 2, 3];
    for (let i = this.colorIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = this.colorIndices[i];
      this.colorIndices[i] = this.colorIndices[j];
      this.colorIndices[j] = temp;
    }

    this.createAreas();
    config.scene.physics.world.setBounds(
      0,
      0,
      this.borderWall.width - 4 * wallPartHalfSize,
      this.borderWall.width - 4 * wallPartHalfSize
    );
    this.walkableMap = this.calculateWalkAbleArr();
  }

  private toggleAreaType() {
    if (this.areaConfig.type === "camp") {
      this.areaConfig.type = "empty";
    } else {
      this.areaConfig.type = "camp";
    }
  }

  private createRowOfAreas(startingTopLeftX, startingTopLeftY, rightStepValue, isEmptyArr) {
    let row: Area[] = [];
    this.areaConfig.topLeftX = startingTopLeftX;
    this.areaConfig.topLeftY = startingTopLeftY;
    let stepCount = 0;
    isEmptyArr.forEach(isEmpty => {
      if (isEmpty) this.toggleAreaType();
      if (!isEmpty) {
        this.areaConfig.color = campColors[this.colorIndices.pop()];
      }
      this.areaConfig.topLeftX = startingTopLeftX + stepCount * rightStepValue;
      row.push(AreaFactory.createArea(this.areaConfig));
      if (isEmpty) this.toggleAreaType();
      stepCount++;
    });
    this.areas.push(row);
  }

  private createAreas() {
    this.areaConfig = {
      color: "blue",
      sizeOfXAxis: areaSize,
      sizeOfYAxis: areaSize,
      topLeftX: 0,
      topLeftY: 0,
      unitForPart: 2 * wallPartHalfSize,
      type: "camp",
      exits: [{position: 6, wallSide: "right", width: 3}],
      numbOfBuildings: 2,
      scene: this.scene
    };

    let rightStepValue = areaSize * 2 * wallPartHalfSize;

    this.createRowOfAreas(0, 0, rightStepValue, [false, true, false]);
    this.createRowOfAreas(0, rightStepValue, rightStepValue, [true, true, true]);
    this.createRowOfAreas(0, 2 * rightStepValue, rightStepValue, [false, true, false]);

    this.areaConfig.topLeftX = -2 * wallPartHalfSize;
    this.areaConfig.topLeftY = -2 * wallPartHalfSize;
    this.areaConfig.sizeOfXAxis = 2 + 3 * areaSize;
    this.areaConfig.sizeOfYAxis = 2 + 3 * areaSize;
    this.areaConfig.exits = [];
    this.areaConfig.numbOfBuildings = 0;
    this.borderWall = AreaFactory.createArea(this.areaConfig);
  }
  private rowOfAreaToWalkableRow(rowOfArea) {
    let row: number[] = [];
    for (let k = 0; k < rowOfArea.length; k++) {
      let notWalkableSymbol = rowOfArea[k].contentType === "building" ? 2 : 1;

      row.push(rowOfArea[k].isWalkable() ? 0 : notWalkableSymbol);
    }
    return row;
  }

  private calculateWalkAbleArr() {
    //assummption that all areas have the same number of rows, and that the input arr is symmetric

    let areas = this.areas;
    let map: any[] = [];

    for (let rowIndexArea = 0; rowIndexArea < areas.length; rowIndexArea++) {
      for (let rowIndex = 0; rowIndex < areas[0][0].parts.length; rowIndex++) {
        let cumulativeRow = [];

        for (let columnIndexArea = 0; columnIndexArea < areas[0].length; columnIndexArea++) {
          cumulativeRow = cumulativeRow.concat(
            this.rowOfAreaToWalkableRow(areas[rowIndexArea][columnIndexArea].parts[rowIndex])
          );
        }
        map.push(cumulativeRow);
      }
    }
    return map;
  }

  getCopyOfMap() {
    return JSON.parse(JSON.stringify(this.walkableMap));
  }

  setMapAsGrid(easyStar) {
    easyStar.setGrid(this.walkableMap);
  }

  executeWithAreasThatHaveBuilding(func) {
    this.areas.forEach(areaRow => {
      areaRow.forEach(area => {
        if (area.buildings[0]) {
          func(area);
        }
      });
    });
  }
}
