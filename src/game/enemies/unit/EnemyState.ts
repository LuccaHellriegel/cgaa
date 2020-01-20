import { EnemyCircle } from "./EnemyCircle";
import { WallPart } from "../../area/wall/WallPart";
import { Building } from "../camp/building/Building";
import { gridPartHalfSize } from "../../base/globals/globalSizes";

export class EnemyState {
	private spotted: any;
	private curPosInPath = 0;

	constructor(private circle: EnemyCircle) {}

	execute() {
		switch (this.circle.state) {
			case "idle": {
				this.idle();
				break;
			}
			case "guard": {
				this.guard();
				break;
			}
			case "ambush": {
				this.ambush();
				break;
			}
			case "obstacle": {
				this.obstacle();
				break;
			}
		}
	}

	private obstacle() {
		this.circle.setVelocity(0, 0);
		if (this.circle.barrier) {
			this.moveBack();
			if (this.circle.barrier instanceof WallPart || this.circle.barrier instanceof Building) {
				if (this.circle.pathContainer) {
					this.circle.state = "ambush";
				}
			} else {
				this.turnTo(this.circle.barrier);
				this.spotted = this.circle.barrier;
				this.circle.state = "guard";
			}
		}
	}

	private moveBack() {
		let x = this.circle.x;
		let y = this.circle.y;
		let angle = Phaser.Math.Angle.Between(this.circle.barrier.x, this.circle.barrier.y, x, y);

		let bounceBackDistance = 1;
		let x1 = x + Math.cos(angle) * bounceBackDistance;
		let y1 = y + Math.sin(angle) * bounceBackDistance;
		this.circle.setPosition(x1, y1);
	}

	private idle() {
		this.circle.setVelocity(0, 0);
		if (this.circle.pathContainer) {
			this.circle.state = "ambush";
		} else {
			this.circle.state = "guard";
		}
	}

	private spottedOutOfSight() {
		let dist = Phaser.Math.Distance.Between(this.circle.x, this.circle.y, this.spotted.x, this.spotted.y);
		return dist > 6 * gridPartHalfSize;
	}

	private guard() {
		if (!this.spotted || this.spottedOutOfSight() || !this.spotted.scene) {
			this.spotted = undefined;
			this.circle.state = "idle";
		} else {
			this.turnTo(this.spotted);
			let inReach = this.moveTo(this.spotted);
			if (inReach) this.circle.attack();
		}
	}

	private turnTo(obj) {
		let newRotation = Phaser.Math.Angle.Between(this.circle.x, this.circle.y, obj.x, obj.y);
		let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;
		this.circle.setRotation(newRotation + correctionForPhasersMinus90DegreeTopPostion);
	}

	private moveTo(target) {
		let reachDist = this.circle.weapon.polygonArr[this.circle.weapon.polygonArr.length - 1].height;
		let inReach = Phaser.Math.Distance.Between(this.circle.x, this.circle.y, target.x, target.y) - 15 < reachDist;
		if (!inReach) {
			this.circle.scene.physics.moveToObject(this.circle, target, this.circle.velo);
		} else {
			this.circle.setVelocity(0, 0);
		}
		return inReach;
	}

	private ambush() {
		if (this.circle.pathContainer.path && this.circle.pathContainer.path[this.curPosInPath]) {
			let x = this.circle.pathContainer.path[this.curPosInPath].x;
			let y = this.circle.pathContainer.path[this.curPosInPath].y;

			this.turnTo({ x, y });
			if (Math.abs(this.circle.x - x) < 2 && Math.abs(this.circle.y - y) < 2) {
				this.curPosInPath++;
			} else {
				this.circle.scene.physics.moveTo(this.circle, x, y, this.circle.velo);
			}
		} else if (this.circle.pathContainer.path && this.curPosInPath >= this.circle.pathContainer.path.length) {
			this.circle.setVelocity(0, 0);
		}
	}
}
