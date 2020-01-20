import { Image } from "../../base/classes/BasePhaser";
import { HealthBar } from "../../base/ui/HealthBar";
import { damageable } from "../../base/interfaces";
import { RectPolygon } from "../../base/polygons/RectPolygon";
import { gridPartHalfSize } from "../../base/globals/globalSizes";
import { Bullet } from "./Bullet";
import { extendWithNewId } from "../../base/id";
import { HealthBarFactory } from "../../base/ui/HealthBarFactory";

export class Tower extends Image implements damageable {
	healthbar: HealthBar;
	id: string;
	polygon: RectPolygon;
	bullets: Bullet[] = [];
	bulletPool: Bullet[] = [];
	canFire = true;
	color: string;

	constructor(scene, x, y, physicsGroup, bulletGroup: Phaser.Physics.Arcade.Group) {
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
		this.healthbar = HealthBarFactory.createTowerHealthBar(scene, x, y);

		for (let index = 0; index < 10; index++) {
			let bullet = new Bullet(scene, bulletGroup, this);
			this.bullets.push(bullet);
		}

		this.color = "blue";

		//TODO: on spawn we need to find a way to shoot -> overlap is just evaluated if new units come
		//TODO: can be spawned ontop of units - why?

		scene.cgaa.interactionElements.push(this);
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
		this.scene.events.emit("inactive-" + this.id, this.id);
		this.disableBody(true, true);
		this.healthbar.bar.setActive(false).setVisible(false);
		this.healthbar.value = this.healthbar.defaultValue;
	}

	activate(x, y) {
		this.enableBody(true, x, y, true, true);
		this.healthbar.bar.setActive(true).setVisible(true);
		this.healthbar.move(x, y);
		this.bullets.forEach(bullet => bullet.reset());
	}
}
