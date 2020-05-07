import { DangerousCircle } from "../unit/DangerousCircle";
import { AIComponent, CircleControl } from "./CircleControl";
import { weaponHeights } from "../weapon/chain-weapon";

export class ObstacleComponent implements AIComponent {
	recursing = false;
	childComponent: AIComponent;
	constructor(private circle: DangerousCircle, private parent: AIComponent, private circleControl: CircleControl) {}

	tick() {
		if (this.recursing) {
			this.childComponent.tick();
		} else {
			this.circleControl.turnTo(this.circleControl.obstacle);
			let [inReach] = this.circleControl.moveTo(
				this.circleControl.obstacle,
				weaponHeights[this.circle.type].frame2 + 15
			);
			if (!inReach || !this.circleControl.obstacle.scene) {
				this.circleControl.obstacle = null;
				this.circleControl.spotted = null;
				this.circle.setVelocity(0, 0);
				this.parent.recursionFinished();
			} else if (inReach && !this.circle.weapon.anims.isPlaying) {
				this.circle.attack();
			}
		}
	}
	recursionFinished() {
		this.childComponent = null;
		this.recursing = false;
	}
}
