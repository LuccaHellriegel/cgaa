import { DangerousCircle } from "../units/DangerousCircle";
import { ObstacleComponent } from "./ObstacleComponent";
import { AIComponent, CircleControl } from "./CircleControl";
import { EnvSetup } from "../config/EnvSetup";

export class GuardComponent implements AIComponent {
  recursing = false;
  childComponent: AIComponent;
  constructor(
    private circle: DangerousCircle,
    private circleControl: CircleControl
  ) {}
  tick() {
    if (this.recursing) {
      this.childComponent.tick();
    } else {
      if (this.circleControl.spotted) {
        let inSight =
          Phaser.Math.Distance.Between(
            this.circle.x,
            this.circle.y,
            this.circleControl.spotted.x,
            this.circleControl.spotted.y
          ) <
          4 * EnvSetup.halfGridPartSize;

        this.circle.turnTo(this.circleControl.spotted);
        if (inSight) {
          this.circleControl.obstacle = this.circleControl.spotted;
          this.childComponent = new ObstacleComponent(
            this.circle,
            this,
            this.circleControl
          );
          this.recursing = true;
        } else {
          this.circleControl.spotted = null;
        }
      }
    }
  }
  recursionFinished() {
    this.childComponent = null;
    this.recursing = false;
  }
}
