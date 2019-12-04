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
    this.createRowOfAreas(0, rightStepValue, rightStepValue, [true, true, true]);
    this.createRowOfAreas(0, 2 * rightStepValue, rightStepValue, [false, true, false]);

    this.areaConfig.topLeftX = -2 * wallPartHalfSize;
    this.areaConfig.topLeftY = -2 * wallPartHalfSize;
    this.areaConfig.sizeOfXAxis = 62;
    this.areaConfig.sizeOfYAxis = 62;
    this.areaConfig.hasHoles = false;
    this.areaConfig.hasBuildings = false;
    this.borderWall = AreaFactory.createArea(this.areaConfig);
  }
}
