import { Circle } from "./Circle";
import { Gameplay } from "../../scenes/Gameplay";
import { WallArea } from "../../env/areas/WallArea";
import { wallPartRadius } from "../../global";

export class PathfindingCircle extends Circle {
  easyStar: any;
  curPosInPath = 0;
  path;
  constructor(scene: Gameplay, x, y, texture, physicsGroup, easyStar) {
    super(scene, x, y, texture, physicsGroup);
    this.easyStar = easyStar;
  }

  calculatePath(wallArea: WallArea) {
    let map = wallArea.calculateWalkableArr();
    this.easyStar.setGrid(map);
    this.easyStar.setAcceptableTiles([0]);
    let { row, column } = this.findCurRelativePosInWallArea(wallArea);
    this.easyStar.findPath(
      column,
      row,
      19,
      9,
      function(path) {
        if (path === null) {
          alert("Path was not found.");
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
        this.path[this.curPosInPath].x * 2 * wallPartRadius + wallPartRadius;
      let y =
        this.path[this.curPosInPath].y * 2 * wallPartRadius + wallPartRadius;
      if (Math.abs(this.x - x) < 2 && Math.abs(this.y - y) < 2) {
        this.curPosInPath++;
      } else {
        this.scene.physics.moveTo(this, x, y,160);
      }
    } else if(this.curPosInPath >= this.path.length){
        this.setVelocity(0,0)
    }
  }
}
