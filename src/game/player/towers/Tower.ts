import { Image } from "../../base/classes/BasePhaser";
import { HealthBar } from "../../base/classes/HealthBar";
import { damageable } from "../../base/interfaces";
import { RectPolygon } from "../../base/polygons/RectPolygon";
import { towerHalfSize, wallPartHalfSize } from "../../../globals/globalSizes";
import { Bullet } from "./Bullet";
import { extendWithNewId } from "../../base/extend";

export class Tower extends Image implements damageable {
	healthbar: HealthBar;
	id: string;
	polygon: RectPolygon;
	sightElement: Image;
	bulletGroup: any;
	bullets: Bullet[] = [];
	bulletPool: Bullet[] = [];
	canFire = true;

	constructor(scene, x, y, physicsGroup, sightGroup, bulletGroup) {
		super({ scene, x, y, texture: "tower", physicsGroup });
		this.setImmovable(true);

		this.polygon = new RectPolygon(
			x + scene.cameras.main.scrollX,
			y + scene.cameras.main.scrollY,
			2 * towerHalfSize,
			2 * towerHalfSize
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

		//TODO: only one target at a time
		//TODO: just make camps offlimit for towers in general
		//TODO: sometimes I cant place any tower and no error
		this.bulletGroup = bulletGroup;
		this.sightElement = new Image({ scene, x: this.x, y: this.y, texture: "", physicsGroup: sightGroup });
		this.sightElement.setVisible(false);
		this.sightElement.owner = this;
		this.sightElement.setSize(12 * wallPartHalfSize, 12 * wallPartHalfSize);

		for (let index = 0; index < 10; index++) {
			let bullet = new Bullet(scene, bulletGroup, this);
			this.bullets.push(bullet);
		}
	}

	damage(amount: number) {
		if (this.healthbar.decrease(amount)) {
			this.destroy();
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
					},
					callbackScope: this,
					repeat: 0
				});
		}
	}

	syncPolygon() {
		this.polygon.setPosition(this.x, this.y);
	}

	destroy() {
		super.destroy();
		this.healthbar.destroy();
		this.bullets.forEach(bullet => bullet.destroy());
	}
}
