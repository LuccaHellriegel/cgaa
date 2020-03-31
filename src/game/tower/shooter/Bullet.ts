import { Shooter } from "./Shooter";
import { UnitSetup } from "../../setup/UnitSetup";

export class Bullet extends Phaser.Physics.Arcade.Sprite {
	owner: Shooter;
	goalX: number;
	goalY: number;
	amount: number;
	id: string;

	constructor(scene, bulletGroup, owner) {
		super(scene, owner.x, owner.y, "bullet");
		scene.add.existing(this);
		bulletGroup.add(this);
		this.id =
			"_" +
			Math.random()
				.toString(36)
				.substr(2, 9);
		this.setCircle(UnitSetup.normalCircleRadius / 4);
		this.owner = owner;
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
			if (dist > UnitSetup.normalCircleRadius) {
				this.scene.physics.moveTo(this, this.goalX, this.goalY, 185);
			} else {
				this.reset();
			}
		}
	}
}
