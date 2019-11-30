import { Circle } from "./Circle";
import { Gameplay } from "../../scenes/Gameplay";
import { WallArea } from "../../env/areas/WallArea";
import { wallPartRadius } from "../../global";
import { EnemyCircle } from "./EnemyCircle";
import { ChainWeapon } from "../weapons/ChainWeapon";
import EasyStar from "easystarjs";
import { PositionService } from "../../services/PositionService";
import { AreaService } from "../../env/areas/AreaService";
import { WallAreaWithBuildings } from "../../env/areas/WallAreaWithBuildings";

export class PathfindingCircle extends EnemyCircle {
  easyStar: EasyStar.js;
  curPosInPath = 0;
  path;
  //TODO: better solution than passing the Class to Populator
  private constructor(
    scene: Gameplay,
    x,
    y,
    texture,
    physicsGroup,
    weapon,
    easyStar
  ) {
    super(scene, x, y, texture, physicsGroup, weapon);
    this.easyStar = easyStar;
    this.scene.time.addEvent({
      delay: 1000,
      callback: this.pathCallbackWithFindingArea,
      callbackScope: this
    });
  }

  static create(scene, x, y, texture, physicsGroup, weaponGroup, easyStar) {
    return new PathfindingCircle(
      scene,
      x,
      y,
      texture,
      physicsGroup,
      new ChainWeapon(scene, x, y, weaponGroup, 5, 2),
      easyStar
    );
  }

  pathCallbackWithFindingArea() {
    let wallArea = this.findClosestsWallArea(this.scene.areaManager.wallAreas);
    this.calculatePath(wallArea);
  }

  calculatePath(wallArea: WallArea) {
    let map = AreaService.calculateWalkableArr(
      wallArea.sizeOfXAxis,
      wallArea.sizeOfYAxis,
      wallArea.parts,
      (wallArea as WallAreaWithBuildings).markBuildingPositions.bind(wallArea)
    );
    this.easyStar.setGrid(map);
    this.easyStar.setAcceptableTiles([0]);
    let { row, column } = PositionService.findCurRelativePosInWallArea(
      wallArea,
      this.x,
      this.y
    );
    this.easyStar.findPath(
      column,
      row,
      19,
      9,
      function(path) {
        if (path === null) {
          console.log("Path was not found.");
        } else {
          this.path = path;
        }
      }.bind(this)
    );
    this.easyStar.calculate();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.path && this.path[this.curPosInPath]) {
      //TODO: make in relation to area position
      let x =
        this.path[this.curPosInPath].x * 2 * wallPartRadius + wallPartRadius;
      let y =
        this.path[this.curPosInPath].y * 2 * wallPartRadius + wallPartRadius;
      if (Math.abs(this.x - x) < 2 && Math.abs(this.y - y) < 2) {
        this.curPosInPath++;
      } else {
        this.scene.physics.moveTo(this, x, y, 160);
      }
    } else if (this.path && this.curPosInPath >= this.path.length) {
      this.setVelocity(0, 0);
    }
  }
}
