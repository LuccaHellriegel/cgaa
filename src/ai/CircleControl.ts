import { Point } from "../engine/Point";
import { DangerousCircle } from "../units/DangerousCircle/DangerousCircle";

export interface AIComponent {
  childComponent: AIComponent;
  tick();
  recursionFinished();
}

export class CircleControl implements AIComponent {
  childComponent: AIComponent;
  components: AIComponent[];
  obstacle;
  spotted;
  lastPositions = [];

  constructor(private circle: DangerousCircle) {}

  setComponents(components: AIComponent[]) {
    this.components = components;
    this.childComponent = components.pop();
  }

  moveBack() {
    let lastPos = this.lastPositions[0];
    this.circle.setPosition(lastPos.x, lastPos.y);
  }

  moveTo(target: Point, reachDist: number) {
    let dist = this.circle.dist(target);
    let inReach = dist < reachDist;
    if (!inReach) {
      //updateLastPos
      if (this.lastPositions.length > 10) this.lastPositions.shift();
      this.lastPositions.push({ x: this.circle.x, y: this.circle.y });

      this.circle.scene.physics.moveToObject(
        this.circle,
        target,
        this.circle.velo
      );
    } else {
      this.circle.setVelocity(0, 0);
    }
    return [inReach, dist];
  }

  tick() {
    this.childComponent.tick();
  }

  recursionFinished() {
    this.childComponent = this.components.pop();
  }
}
