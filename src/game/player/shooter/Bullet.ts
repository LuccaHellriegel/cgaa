import { Sprite } from "../../base/classes/BasePhaser";
import { normalCircleRadius } from "../../base/globals/globalSizes";
import { Shooter } from "./Shooter";

export class Bullet extends Sprite {
	owner: Shooter;
	goalX: number;
	goalY: number;
	amount: number;

	constructor(scene, bulletGroup, owner) {
		super({ scene, x: owner.x, y: owner.y, texture: "bullet", physicsGroup: bulletGroup });
		this.setCircle(normalCircleRadius / 4);
		this.owner = owner;
		this.reset();
		this.amount = 20;
	}

	reset() {
		this.setVelocity(0, 0);
		this.setActive(false);
		this.setVisible(false);
		this.x = this.owner.x;
		this.y = this.owner.y;
		this.goalX = undefined;
		this.goalY = undefined;
		this.owner.bulletPool.push(this);
	}

	shoot(goalX, goalY) {
		this.setActive(true);
		this.setVisible(true);
		this.goalX = goalX;
		this.goalY = goalY;
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		if (this.goalX) {
			let dist = Phaser.Math.Distance.Between(this.x, this.y, this.goalX, this.goalY);
			if (dist > normalCircleRadius) {
				this.scene.physics.moveTo(this, this.goalX, this.goalY, 185);
			} else {
				this.reset();
			}
		}
	}
}
