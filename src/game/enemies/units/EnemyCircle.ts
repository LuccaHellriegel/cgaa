import { HealthBar } from "../../base/classes/HealthBar";
import { Circle } from "../../base/classes/Circle";
import { PathContainer } from "../path/PathContainer";
import { damageable } from "../../base/interfaces";
import { WallPart } from "../../areas/WallPart";
import { Building } from "../buildings/Building";
import { wallPartHalfSize } from "../../../globals/globalSizes";
import { relativePosToRealPos } from "../../base/position";

export class EnemyCircle extends Circle implements damageable {
	hasBeenAttacked: boolean;
	healthbar: HealthBar;
	pathContainer: PathContainer;
	curPosInPath = 0;
	color: string;
	spotted: any;
	pursuing: any;
	barrier: any;

	constructor(config) {
		super(config);
		this.hasBeenAttacked = false;
		this.healthbar = config.healthbar;
		this.setCollideWorldBounds(true);
		this.color = config.color;
	}

	damage(amount) {
		if (this.healthbar.decrease(amount)) {
			this.destroy();
		} else {
			super.damage(amount);
			this.hasBeenAttacked = true;
		}
	}

	destroy() {
		super.destroy();
		this.healthbar.destroy();
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.healthbar.move(this.x, this.y);
		this.executeState();
	}

	private executeState() {
		let state = this.state;
		switch (state) {
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
		this.setVelocity(0, 0);
		if (this.barrier) {
			this.moveBack();
			this.turnTo(this.barrier);
			if (this.barrier instanceof WallPart || this.barrier instanceof Building) {
				if (this.pathContainer) {
					this.state = "ambush";
				}
			} else {
				this.spotted = this.barrier;
				this.state = "guard";
			}
		}
	}

	private moveBack() {
		let x = this.x;
		let y = this.y;
		let angle = Phaser.Math.Angle.Between(this.barrier.x, this.barrier.y, x, y);

		let bounceBackDistance = 1;
		let x1 = x + Math.cos(angle) * bounceBackDistance;
		let y1 = y + Math.sin(angle) * bounceBackDistance;
		this.setPosition(x1, y1);
	}

	private idle() {
		this.setVelocity(0, 0);
		if (this.pathContainer) {
			this.state = "ambush";
		} else {
			this.state = "guard";
		}
	}

	private spottedOutOfSight() {
		let dist = Phaser.Math.Distance.Between(this.x, this.y, this.spotted.x, this.spotted.y);
		return dist > 6 * wallPartHalfSize;
	}

	private guard() {
		if (!this.spotted || this.spottedOutOfSight() || !this.spotted.scene) {
			this.spotted = undefined;
			this.state = "idle";
		} else {
			this.turnTo(this.spotted);
			let inReach = this.moveTo(this.spotted);
			if (inReach) this.attack();
		}
	}

	private turnTo(obj) {
		let newRotation = Phaser.Math.Angle.Between(this.x, this.y, obj.x, obj.y);
		let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90;
		this.setRotation(newRotation + correctionForPhasersMinus90DegreeTopPostion);
	}

	private moveTo(target) {
		let reachDist = this.weapon.polygonArr[this.weapon.polygonArr.length - 1].height;
		let inReach = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) - 15 < reachDist;
		if (!inReach) {
			this.scene.physics.moveToObject(this, target, 160);
		} else {
			this.setVelocity(0, 0);
		}
		return inReach;
	}

	private ambush() {
		if (this.pathContainer.path && this.pathContainer.path[this.curPosInPath]) {
			let { x, y } = relativePosToRealPos(
				this.pathContainer.path[this.curPosInPath].x,
				this.pathContainer.path[this.curPosInPath].y
			);
			this.turnTo({ x, y });
			if (Math.abs(this.x - x) < 2 && Math.abs(this.y - y) < 2) {
				this.curPosInPath++;
			} else {
				this.scene.physics.moveTo(this, x, y, 160);
			}
		} else if (this.pathContainer.path && this.curPosInPath >= this.pathContainer.path.length) {
			this.setVelocity(0, 0);
		}
	}
}
