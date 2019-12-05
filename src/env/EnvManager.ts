import { Gameplay } from "../scenes/Gameplay";
import { wallPartHalfSize } from "../globals/globalSizes";
import { Area } from "./areas/Area";
import { AreaFactory, AreaConfig } from "./areas/AreaFactory";
import { PhysicalManager } from "../base/Base";

export class EnvManager extends PhysicalManager {
  borderWall: Area;

  private areaConfig: AreaConfig;
  constructor(scene: Gameplay) {
    super(scene, "envManager", "staticGroup");

    this.createAreas();
    scene.physics.world.setBounds(
      0,
      0,
      this.borderWall.width - 4 * wallPartHalfSize,
      this.borderWall.width - 4 * wallPartHalfSize
    );
  }

  private toggleIfAreaConfigIsEmpty() {
    this.areaConfig.hasWalls = !this.areaConfig.hasWalls;
    this.areaConfig.hasBuildings = !this.areaConfig.hasBuildings;
  }

  private createRowOfAreas(startingTopLeftX, startingTopLeftY, rightStepValue, isEmptyArr) {
    let row: Area[] = [];
    this.areaConfig.topLeftX = startingTopLeftX;
    this.areaConfig.topLeftY = startingTopLeftY;
    let stepCount = 0;
    isEmptyArr.forEach(isEmpty => {
      if (isEmpty) this.toggleIfAreaConfigIsEmpty();
      this.areaConfig.topLeftX = startingTopLeftX + stepCount * rightStepValue;
      row.push(AreaFactory.createArea(this.areaConfig));
      if (isEmpty) this.toggleIfAreaConfigIsEmpty();
      stepCount++;
    });
    this.elements.push(row);
  }

  private createAreas() {
    this.areaConfig = {
      sizeOfXAxis: 20,
      sizeOfYAxis: 20,
      topLeftX: 0,
      topLeftY: 0,
      unitForPart: 2 * wallPartHalfSize,
      hasWalls: true,
      hasHoles: true,
      holePosition: 9,
      hasBuildings: true,
      numbOfBuildings: 8,
      scene: this.scene
    };

    let rightStepValue = 20 * 2 * wallPartHalfSize;

    this.createRowOfAreas(0, 0, rightStepValue, [false, true, false]);
    // this.createRowOfAreas(0, rightStepValue, rightStepValue, [true, true, true]);
    // this.createRowOfAreas(0, 2 * rightStepValue, rightStepValue, [false, true, false]);

    this.areaConfig.topLeftX = -2 * wallPartHalfSize;
    this.areaConfig.topLeftY = -2 * wallPartHalfSize;
    this.areaConfig.sizeOfXAxis = 62;
    this.areaConfig.sizeOfYAxis = 62;
    this.areaConfig.hasHoles = false;
    this.areaConfig.hasBuildings = false;
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

  calculateWalkAbleArr() {
    //assummption that all areas have the same number of rows, and that the input arr is symmetric

    let areas = this.elements;
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

  findClosestArea(x, y) {
    let dist = Infinity;
    let row = 0;
    let column = 0;

    let curRow = 0;
    let curColumn = 0;
    this.elements.forEach(areaRow => {
      areaRow.forEach(area => {
        let curDist = Phaser.Math.Distance.Between(x, y, area.x, area.y);
        if (dist > curDist) {
          dist = curDist;
          row = curRow;
          column = curColumn;
        }
        curColumn++;
      });
      curRow++;
    });
    return { columnInAreaArr: column, rowInAreaArr: row };
  }

  calculateAreaMaps() {
    let areaMaps: any[] = [];
    this.elements.forEach(areaRow => {
      let mapRow: any[] = [];
      areaRow.forEach((area: Area) => {
        let map: any[] = [];
        area.parts.forEach(row => {
          map.push(this.rowOfAreaToWalkableRow(row));
        });
        mapRow.push(map);
      });
      areaMaps.push(mapRow);
    });
    return areaMaps;
  }
}
