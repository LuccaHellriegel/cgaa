import { Image } from "../../base/classes/BasePhaser";
import { HealthBar } from "../../base/classes/HealthBar";
import { damageable } from "../../base/interfaces";
import { RectPolygon } from "../../base/polygons/RectPolygon";
import { gridPartHalfSize } from "../../base/globals/globalSizes";
import { Bullet } from "./Bullet";
import { extendWithNewId } from "../../base/id";
import { addToInteractionElements } from "../../base/events/interaction";
import { disableForPool, activateForPool, addToInactivePool } from "../../base/pool";

export class Tower extends Image implements damageable {
	healthbar: HealthBar;
	id: string;
	polygon: RectPolygon;
	bulletGroup: any;
	bullets: Bullet[] = [];
	bulletPool: Bullet[] = [];
	canFire = true;
	color: string;

	constructor(scene, x, y, physicsGroup, bulletGroup) {
		super({ scene, x, y, texture: "tower", physicsGroup });
		this.setImmovable(true);

		this.polygon = new RectPolygon(
			x + scene.cameras.main.scrollX,
			y + scene.cameras.main.scrollY,
			2 * gridPartHalfSize,
			2 * gridPartHalfSize
		);

		this.setSize(this.polygon.width, this.polygon.height);

		extendWithNewId(this);
		this.healthbar = new HealthBar(x, y, {
			scene,
			posCorrectionX: -26,
			posCorrectionY: -38,
			healthWidth: 46,
			healthLength: 12,
			value: 100
		});
		this.healthbar.move(x, y);

		this.bulletGroup = bulletGroup;

		for (let index = 0; index < 10; index++) {
			let bullet = new Bullet(scene, bulletGroup, this);
			this.bullets.push(bullet);
		}

		this.color = "blue";
		addToInteractionElements(scene, this);
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

	syncPolygon() {
		this.polygon.setPosition(this.x, this.y);
	}

	poolDestroy() {
		this.bullets.forEach(bullet => bullet.reset());
		addToInactivePool(this);
		disableForPool(this, this.healthbar.bar);
		this.healthbar.value = 100;
	}

	activate(x, y) {
		activateForPool(x, y, this, this.healthbar.bar);
		this.healthbar.move(x, y);
		this.bullets.forEach(bullet => bullet.reset());
	}
}
