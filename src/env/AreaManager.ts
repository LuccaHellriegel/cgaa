import { Gameplay } from "../scenes/Gameplay";
import { wallPartHalfSize } from "../globals/globalSizes";
import { Area } from "./areas/Area";
import { AreaService } from "./areas/AreaService";
import { AreaFactory, AreaConfig } from "./areas/AreaFactory";

export class AreaManager {
  scene: Gameplay;
  areas: Area[][];
  borderWall: Area;
  walkableArr: number[][];
  physicsGroup: Phaser.Physics.Arcade.StaticGroup;
  private areaConfig: AreaConfig;
  constructor(scene: Gameplay) {
    this.scene = scene;
    scene.areaManager = this;
    this.areas = [];
    this.physicsGroup = scene.physics.add.staticGroup();

    this.createAreas();
    scene.physics.world.setBounds(
      0,
      0,
      this.borderWall.width - 4 * wallPartHalfSize,
      this.borderWall.width - 4 * wallPartHalfSize
    );

    this.calculateCumulativeWalkAbleArr();
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
      this.areaConfig.topLeftX += stepCount * rightStepValue;
      row.push(AreaFactory.createArea(this.areaConfig));
      if (isEmpty) this.toggleIfAreaConfigIsEmpty();
      stepCount++;
    });
    this.areas.push(row);
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
      numbOfBuildings: 1,
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

    this.borderWall = AreaFactory.createArea(this.areaConfig);
  }

  private calculateCumulativeWalkAbleArr() {
    let walkableArrArr: number[][][][] = [];
    this.areas.forEach(areaRow => {
      let row: number[][][] = [];
      areaRow.forEach(area => {
        row.push(area.calculateWalkableArr());
      });
      walkableArrArr.push(row);
    });
    this.walkableArr = AreaService.createCumulativeWalkableArr(walkableArrArr);
  }

 //TODO: can push other Sprite into wall
 private bounceCallback(unit, rect) {
  let x = unit.x;
  let y = unit.y;
  let angle = Phaser.Math.Angle.Between(rect.x, rect.y, x, y);

  let bounceBackDistance = 0.5;
  let x1 = x + Math.cos(angle) * bounceBackDistance;
  let y1 = y + Math.sin(angle) * bounceBackDistance;
  unit.setPosition(x1, y1);
  unit.setVelocity(0, 0);
}

  setupAreaColliders() {
    this.scene.physics.add.collider(this.scene.player.physicsGroup, this.physicsGroup, this.bounceCallback, null, this);
    this.scene.physics.add.collider(
      this.scene.unitManager.enemies[0].physicsGroup,
      this.physicsGroup,
      this.bounceCallback,
      null,
      this
    );
  }
}
