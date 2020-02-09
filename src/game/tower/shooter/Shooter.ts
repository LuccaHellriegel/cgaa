import { Bullet } from "./Bullet";
import { ShooterPool } from "../../pool/ShooterPool";
import { Tower } from "../Tower";
import { Gameplay } from "../../../scenes/Gameplay";

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

		//TODO: on spawn we need to find a way to shoot -> overlap is just evaluated if new units come
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
			ShooterPool.poolDestroy(this);
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
}
