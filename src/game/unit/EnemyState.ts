import { EnemyCircle } from "./EnemyCircle";
import { Point } from "../base/types";
import { WallPart } from "../env/wall/WallPart";
import { Building } from "../building/Building";
import { EnvSetup } from "../setup/EnvSetup";

export class EnemyState {
	spotted: any;
	//Walk position not path position
	lastPositions = [];
	private nextPos: Point;

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
				this.circle.state = "ambush";
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
		if (this.circle.pathArr) {
			this.circle.state = "ambush";
		} else {
			this.circle.state = "guard";
		}
	}

	private spottedOutOfSight() {
		let dist = Phaser.Math.Distance.Between(this.circle.x, this.circle.y, this.spotted.x, this.spotted.y);
		return dist > 6 * EnvSetup.halfGridPartSize;
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
			//TODO: extract this somewhere (also in ambush)
			if (this.lastPositions.length > 10) this.lastPositions.shift();
			this.lastPositions.push({ x: this.circle.x, y: this.circle.y });
			this.circle.scene.physics.moveToObject(this.circle, target, this.circle.velo);
		} else {
			this.circle.setVelocity(0, 0);
		}
		return inReach;
	}

	//TODO: there is a bug, if they are attacked, then they go back to the middle position
	private ambush() {
		if (this.circle.pathArr) {
			if (this.nextPos !== undefined) {
				this.turnTo({ x: this.nextPos.x, y: this.nextPos.y });
				if (!(Math.abs(this.circle.x - this.nextPos.x) < 2 && Math.abs(this.circle.y - this.nextPos.y) < 2)) {
					if (this.lastPositions.length > 10) this.lastPositions.shift();
					this.lastPositions.push({ x: this.circle.x, y: this.circle.y });
					this.circle.scene.physics.moveTo(this.circle, this.nextPos.x, this.nextPos.y, this.circle.velo);
				} else {
					this.nextPos = this.circle.pathArr.pop();
				}
			} else {
				this.nextPos = this.circle.pathArr.pop();
				if (this.nextPos === undefined) {
					this.circle.setVelocity(0, 0);
					this.circle.pathArr = null;
				}
			}
		}
	}
}
