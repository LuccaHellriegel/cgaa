import { DangerousCircle } from "../units/DangerousCircle";

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

	turnTo(obj) {
		let newRotation = Phaser.Math.Angle.Between(this.circle.x, this.circle.y, obj.x, obj.y);
		let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;
		this.circle.setRotation(newRotation + correctionForPhasersMinus90DegreeTopPostion);
	}

	updateLastPos() {
		if (this.lastPositions.length > 10) this.lastPositions.shift();
		this.lastPositions.push({ x: this.circle.x, y: this.circle.y });
	}

	moveTo(target, reachDist) {
		let dist = Phaser.Math.Distance.Between(this.circle.x, this.circle.y, target.x, target.y);
		let inReach = dist < reachDist;
		if (!inReach) {
			this.updateLastPos();
			this.circle.scene.physics.moveToObject(this.circle, target, this.circle.velo);
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
