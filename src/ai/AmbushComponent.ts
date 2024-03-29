import { DangerousCircle } from "../units/DangerousCircle";
import { AIComponent, CircleControl } from "./CircleControl";
import { ObstacleComponent } from "./ObstacleComponent";
import { Point } from "../engine/Point";

export class AmbushComponent implements AIComponent {
  private nextPosIndex = 0;
  private nextPos: Point;
  recursing = false;
  childComponent: AIComponent;
  constructor(
    private pathArr: Point[],
    private circle: DangerousCircle,
    private parent: AIComponent,
    private circleControl: CircleControl
  ) {}

  fightAgainstObstacle() {
    this.childComponent = new ObstacleComponent(
      this.circle,
      this,
      this.circleControl
    );
    this.recursing = true;
  }

  followPath() {
    if (this.nextPos) {
      let [inReach] = this.circleControl.moveTo(this.nextPos, 2);
      if (inReach) this.nextPos = null;
    } else {
      this.nextPos = this.pathArr[this.nextPosIndex];
      //After last pos nextPos is undefined
      if (!this.nextPos) {
        this.circle.setVelocity(0, 0);
        this.circleControl.spotted = null;
        this.circleControl.obstacle = null;
        this.parent.recursionFinished();
      } else {
        this.nextPosIndex++;
        this.circle.turnTo(this.nextPos);
      }
    }
  }

  tick() {
    if (this.recursing) {
      this.childComponent.tick();
    } else {
      if (this.circleControl.obstacle) {
        this.fightAgainstObstacle();
      } else {
        this.followPath();
      }
    }
  }

  recursionFinished() {
    this.childComponent = null;
    this.recursing = false;
  }
}
