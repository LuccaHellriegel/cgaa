import { Bullets } from "./Bullet";
import { Tower } from "../Tower";
import { Gameplay } from "../../../scenes/Gameplay";
import { PoolHelper } from "../../pool/PoolHelper";

export class Shooter extends Tower {
	canFire = true;

	constructor(scene: Gameplay, x, y, physicsGroup: Phaser.Physics.Arcade.StaticGroup, private bullets: Bullets) {
		super(scene, x, y, "shooter", physicsGroup);
		this.type = "Shooter";

		//TODO: can be spawned ontop of units because I dont check enemies in TowerModus
	}

	damage(amount: number) {
		if (this.healthbar.decrease(amount)) {
			this.poolDestroy();
		}
	}

	fire(target) {
		if (this.canFire) {
			this.bullets.fireBullet(this.x, this.y, target.x, target.y);
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
	}

	poolActivate(x, y) {
		PoolHelper.genericActivate(this, x, y);
	}
}
