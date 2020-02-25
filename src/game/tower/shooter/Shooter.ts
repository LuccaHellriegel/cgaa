import { Bullet } from "./Bullet";
import { Tower } from "../Tower";
import { Gameplay } from "../../../scenes/Gameplay";
import { PoolHelper } from "../../pool/PoolHelper";

export class Shooter extends Tower {
	bullets: Bullet[] = [];
	bulletPool: Bullet[] = [];
	canFire = true;

	constructor(
		scene: Gameplay,
		x,
		y,
		physicsGroup: Phaser.Physics.Arcade.StaticGroup,
		private bulletGroup: Phaser.Physics.Arcade.Group
	) {
		super(scene, x, y, "shooter", physicsGroup);
		this.initBullets();

		//TODO: can be spawned ontop of units - why?
	}

	private initBullets() {
		for (let index = 0; index < 10; index++) {
			let bullet = new Bullet(this.scene, this.bulletGroup, this);
			this.bullets.push(bullet);
		}
	}

	damage(amount: number) {
		if (this.healthbar.decrease(amount)) {
			this.poolDestroy();
		}
	}

	fire(target) {
		if (this.bulletPool.length && this.canFire) {
			let bullet = this.bulletPool.pop();
			bullet.shoot(target.x, target.y);
			this.canFire = false;
			if (this.scene)
				this.scene.time.addEvent({
					delay: 300,
					callback: () => {
						this.canFire = true;
						if (target.healthbar.value > 0 && Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) < 445)
							this.fire(target);
					},
					callbackScope: this,
					repeat: 0
				});
		}
	}

	poolDestroy() {
		PoolHelper.genericDestroy(this);
		this.bullets.forEach(bullet => bullet.reset());
	}

	poolActivate(x, y) {
		PoolHelper.genericActivate(this, x, y);
		this.bullets.forEach(bullet => bullet.reset());
	}
}
