import { Image } from "../../base/classes/BasePhaser";
import { HealthBar } from "../../base/ui/HealthBar";
import { damageable } from "../../base/interfaces";
import { RectPolygon } from "../../base/polygons/RectPolygon";
import { gridPartHalfSize } from "../../base/globals/globalSizes";
import { Bullet } from "./Bullet";
import { HealthBarFactory } from "../../base/ui/HealthBarFactory";
import { PoolHelper } from "../../base/pool/PoolHelper";
import { Annotator } from "../../base/classes/Annotator";

export class Shooter extends Image implements damageable {
	healthbar: HealthBar;
	id: string;
	polygon: RectPolygon;
	bullets: Bullet[] = [];
	bulletPool: Bullet[] = [];
	canFire = true;
	color: string;

	constructor(scene, x, y, physicsGroup, private bulletGroup: Phaser.Physics.Arcade.Group) {
		super({ scene, x, y, texture: "shooter", physicsGroup });

		this.initUnitStats();

		this.healthbar = HealthBarFactory.createShooterHealthBar(scene, x, y);

		this.initBullets();

		//TODO: on spawn we need to find a way to shoot -> overlap is just evaluated if new units come
		//TODO: can be spawned ontop of units - why?
	}

	private initUnitStats() {
		Annotator.annotate(this, "id", "immovable");

		this.polygon = new RectPolygon(
			this.x + this.scene.cameras.main.scrollX,
			this.y + this.scene.cameras.main.scrollY,
			2 * gridPartHalfSize,
			2 * gridPartHalfSize
		);
		this.color = "blue";
		this.setSize(this.polygon.width, this.polygon.height);
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

	syncPolygon() {
		this.polygon.setPosition(this.x, this.y);
	}

	poolDestroy() {
		PoolHelper.destroyShooter(this);
	}

	activate(x, y) {
		PoolHelper.activateShooter(this, x, y);
	}
}
