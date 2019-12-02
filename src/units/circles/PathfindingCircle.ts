import { Gameplay } from "../../scenes/Gameplay";
import { wallPartHalfSize } from "../../globals/globalSizes";
import { EnemyCircle } from "./EnemyCircle";
import EasyStar from "easystarjs";
import { PositionService } from "../../services/PositionService";
import { ChainWeapon } from "../../weapons/ChainWeapon";
import { RandWeapon } from "../../weapons/RandWeapon";

export class PathfindingCircle extends EnemyCircle {
  easyStar: EasyStar.js;
  curPosInPath = 0;
  path;
  relativeGoalPositionRow: number = 29;
  realtiveGoalPositionColumn: number = 29;
  constructor(scene: Gameplay, x, y, texture, physicsGroup, weapon, easyStar) {
    super(scene, x, y, texture, physicsGroup, weapon);
    this.easyStar = easyStar;
    this.scene.time.addEvent({
      delay: 1000,
      callback: this.calculatePathCallback,
      callbackScope: this
    });
  }

  static withChainWeapon(scene, x, y, texture, physicsGroup, weaponGroup, easystar) {
    return new this(scene, x, y, texture, physicsGroup, new ChainWeapon(scene, x, y, weaponGroup, 5, 2), easystar);
  }

  static withRandWeapon(scene, x, y, texture, physicsGroup, weaponGroup, easystar) {
    return new this(scene, x, y, texture, physicsGroup, new RandWeapon(scene, x, y, weaponGroup), easystar);
  }

  private calculatePathCallback() {
    this.calculatePath(this.scene.areaManager.walkableArr);
  }

  calculatePath(walkableArr) {
    let map = walkableArr;
    this.easyStar.setGrid(map);
    this.easyStar.setAcceptableTiles([0]);
    let { row, column } = PositionService.findCurRelativePosition(walkableArr, this.x, this.y);
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
      let x = 0 + this.path[this.curPosInPath].x * 2 * wallPartHalfSize + wallPartHalfSize;
      let y = 0 + this.path[this.curPosInPath].y * 2 * wallPartHalfSize + wallPartHalfSize;
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
