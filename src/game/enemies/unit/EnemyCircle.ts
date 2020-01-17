import { HealthBar } from "../../base/classes/HealthBar";
import { Circle } from "../../base/classes/Circle";
import { PathContainer } from "../path/classes/PathContainer";
import { damageable } from "../../base/interfaces";
import { WallPart } from "../../area/wall/WallPart";
import { Building } from "../building/Building";
import { gridPartHalfSize } from "../../base/globals/globalSizes";

export class EnemyCircle extends Circle implements damageable {
	healthbar: HealthBar;
	pathContainer: PathContainer;
	curPosInPath = 0;
	color: string;
	spotted: any;
	pursuing: any;
	barrier: any;

	constructor(config, private velo: number) {
		super(config);
		this.healthbar = config.healthbar;
		this.color = config.color;
	}

	damage(amount) {
		if (this.healthbar.decrease(amount)) {
			this.poolDestroy();
		} else {
			super.damage(amount);
		}
	}

	destroy() {
		super.destroy();
		this.weapon.destroy();
		this.healthbar.bar.destroy();
	}

	poolDestroy() {
		this.scene.events.emit("inactive-" + this.id, this.id);
		this.disableBody(true, true);
		this.setPosition(-1000, -1000);
		this.weapon.disableBody(true, true);
		this.healthbar.bar.setActive(false).setVisible(false);
		this.healthbar.value = this.healthbar.defaultValue;
	}

	poolActivate(x, y) {
		this.enableBody(true, x, y, true, true);
		this.weapon.enableBody(true, x, y, true, true);
		this.healthbar.bar.setActive(true).setVisible(true);
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
			if (this.barrier instanceof WallPart || this.barrier instanceof Building) {
				if (this.pathContainer) {
					this.state = "ambush";
				}
			} else {
				this.turnTo(this.barrier);
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
		return dist > 6 * gridPartHalfSize;
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
			this.scene.physics.moveToObject(this, target, this.velo);
		} else {
			this.setVelocity(0, 0);
		}
		return inReach;
	}

	private ambush() {
		if (this.pathContainer.path && this.pathContainer.path[this.curPosInPath]) {
			let x = this.pathContainer.path[this.curPosInPath].x;
			let y = this.pathContainer.path[this.curPosInPath].y;

			this.turnTo({ x, y });
			if (Math.abs(this.x - x) < 2 && Math.abs(this.y - y) < 2) {
				this.curPosInPath++;
			} else {
				this.scene.physics.moveTo(this, x, y, this.velo);
			}
		} else if (this.pathContainer.path && this.curPosInPath >= this.pathContainer.path.length) {
			this.setVelocity(0, 0);
		}
	}
}
