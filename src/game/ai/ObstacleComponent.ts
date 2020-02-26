import { DangerousCircle } from "../unit/DangerousCircle";
import { AIComponent, CircleControl } from "./CircleControl";

export class ObstacleComponent implements AIComponent {
	recursing = false;
	childComponent: AIComponent;
	constructor(private circle: DangerousCircle, private parent: AIComponent, private circleControl: CircleControl) {}

	tick() {
		if (this.recursing) {
			this.childComponent.tick();
		} else {
			this.circleControl.turnTo(this.circleControl.obstacle);
			let [inReach, dist] = this.circleControl.moveTo(
				this.circleControl.obstacle,
				this.circle.weapon.polygonArr[this.circle.weapon.polygonArr.length - 1].height + 15
			);
			if (!inReach || !this.circleControl.obstacle.scene) {
				this.circleControl.obstacle = null;
				this.circleControl.spotted = null;
				this.circle.setVelocity(0, 0);
				this.parent.recursionFinished();
			} else if (inReach) {
				this.circle.attack();
			}
		}
	}
	recursionFinished() {
		this.childComponent = null;
		this.recursing = false;
	}
}
