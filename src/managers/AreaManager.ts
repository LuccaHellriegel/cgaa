import { Gameplay } from "../scenes/Gameplay";
import { WallArea } from "../env/areas/WallArea";
import { wallPartHalfSize } from "../globals/globalSizes";
import { WallAreaWithBuildings } from "../env/areas/WallAreaWithBuildings";
import { Area } from "../env/areas/Area";
import { AreaService } from "../env/areas/AreaService";

export class AreaManager {
  scene: Gameplay;
  areas: Area[][];
  borderWall: WallArea;
  walkableArr: number[][];
  physicsGroup: Phaser.Physics.Arcade.StaticGroup;
  constructor(scene: Gameplay) {
    this.scene = scene;
    scene.areaManager = this
    this.areas = [];
    this.physicsGroup = scene.physics.add.staticGroup();

    this.createAreas();
    this.calculateCumulativeWalkAbleArr();
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

  private createFirstRowOfAreas() {
    let row: Area[] = [];
    row.push(WallAreaWithBuildings.withHoles(this.scene, 20, 20, 0, 0, 9));
    row.push(new Area(20, 20, row[0].width, 0, 2 * wallPartHalfSize));
    row.push(
      WallAreaWithBuildings.withHoles(
        this.scene,
        20,
        20,
        row[0].width * 2,
        0,
        9
      )
    );

    this.areas.push(row);
  }

  private createSecondRowOfAreas() {
    let row: Area[] = [];
    row.push(new Area(20, 20, 0, this.areas[0][0].height, 2 * wallPartHalfSize));
    row.push(
      new Area(
        20,
        20,
        this.areas[0][0].width,
        this.areas[0][0].height,
        2 * wallPartHalfSize
      )
    );
    row.push(
      new Area(
        20,
        20,
        2 * this.areas[0][0].width,
        this.areas[0][0].height,
        2 * wallPartHalfSize
      )
    );
    this.areas.push(row);
  }

  private createThirdRowOfAreas() {
    let row: Area[] = [];

    row.push(
      WallAreaWithBuildings.withHoles(
        this.scene,
        20,
        20,
        0,
        this.areas[0][0].height * 2,
        9
      )
    );

    row.push(
      new Area(
        20,
        20,
        this.areas[0][0].width,
        2 * this.areas[0][0].height,
        2 * wallPartHalfSize
      )
    );

    row.push(
      WallAreaWithBuildings.withHoles(
        this.scene,
        20,
        20,
        this.areas[0][0].width * 2,
        this.areas[0][0].height * 2,
        9
      )
    );
    this.areas.push(row);
  }

  private createAreas() {
    this.createFirstRowOfAreas();
    this.createSecondRowOfAreas();
    this.createThirdRowOfAreas();
    this.borderWall = new WallArea(
      this.scene,
      62,
      61,
      -2 * wallPartHalfSize,
      -2 * wallPartHalfSize
    );
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

  setupAreaColliders() {
    this.scene.physics.add.collider(
      this.scene.player.physicsGroup,
      this.physicsGroup,
      this.bounceCallback,
      null,
      this
    );
    this.scene.physics.add.collider(
      this.scene.unitManager.enemies[0].physicsGroup,
      this.physicsGroup,
      this.bounceCallback,
      null,
      this
    );
  }
}
