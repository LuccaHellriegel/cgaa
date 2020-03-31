import { Bullets } from "./Bullet";
import { Tower, Towers } from "../Tower";
import { Gameplay } from "../../../scenes/Gameplay";
import { PoolHelper } from "../../pool/PoolHelper";
import { TowerSetup } from "../../setup/TowerSetup";

export class Shooters extends Towers {
	constructor(scene, private bullets: Bullets) {
		super(scene);

		this.maxSize = TowerSetup.maxShooters;

		this.createMultiple({
			frameQuantity: TowerSetup.maxShooters / 2,
			key: "shooter",
			active: false,
			visible: false,
			classType: Shooter
		});
	}

	placeTower(x, y) {
		let shooter = this.getFirstDead(true);
		shooter.place(x, y, this.bullets);
	}
}

export class Shooter extends Tower {
	canFire = true;
	bullets: Bullets;

	constructor(scene: Gameplay, x, y) {
		super(scene, x, y, "shooter");
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
			this.bullets.fireBullet(this.x, this.y, target.x, target.y, this);
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

	place(x, y, bullets) {
		this.scene.children.sendToBack(this);

		this.bullets = bullets;
		super.place(x, y, null);
	}

	poolDestroy() {
		PoolHelper.genericDestroy(this);
	}

	poolActivate(x, y) {
		PoolHelper.genericActivate(this, x, y);
	}
}
