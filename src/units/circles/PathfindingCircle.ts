import { Circle } from "./Circle";
import { Gameplay } from "../../scenes/Gameplay";
import { WallArea } from "../../env/areas/WallArea";
import { wallPartHalfSize } from "../../global";
import { EnemyCircle } from "./EnemyCircle";
import { ChainWeapon } from "../weapons/ChainWeapon";
import EasyStar from "easystarjs";
import { PositionService } from "../../services/PositionService";
import { Area } from "../../env/areas/Area";

export class PathfindingCircle extends EnemyCircle {
  easyStar: EasyStar.js;
  curPosInPath = 0;
  path;
  relativeGoalPositionRow: number = 29;
  realtiveGoalPositionColumn: number = 29;
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
      callback: this.calculatePathCallback,
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

  private calculatePathCallback() {
    this.calculatePath(this.scene.areaManager.walkableArr);
  }

  calculatePath(walkableArr) {
    let map = walkableArr;
    this.easyStar.setGrid(map);
    this.easyStar.setAcceptableTiles([0]);
    let { row, column } = PositionService.findCurRelativePosition(
      walkableArr,
      this.x,
      this.y
    );
    this.easyStar.findPath(
      column,
      row,
      this.realtiveGoalPositionColumn,
      this.relativeGoalPositionRow,
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
      let x =
        0 +
        this.path[this.curPosInPath].x * 2 * wallPartHalfSize +
        wallPartHalfSize;
      let y =
       0 +
        this.path[this.curPosInPath].y * 2 * wallPartHalfSize +
        wallPartHalfSize;
      if (Math.abs(this.x - x) < 2 && Math.abs(this.y - y) < 2) {
        this.curPosInPath++;
      } else {
        this.scene.physics.moveTo(this, x, y, 160);
      }
    } else if (this.path && this.curPosInPath >= this.path.length) {
      this.setVelocity(0,0)
    }
  }
}
