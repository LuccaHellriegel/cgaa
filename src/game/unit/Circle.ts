import { CirclePolygon } from "../polygons/CirclePolygon";
import { Gameplay } from "../../scenes/Gameplay";
import { ChainWeapon } from "../weapon/ChainWeapon";
import { CampID } from "../setup/CampSetup";

// export class Circles extends Phaser.Physics.Arcade.Group {
// 	constructor(scene) {
// 		super(scene.physics.world, scene);

// 		this.maxSize = TowerSetup.maxShooters * TowerSetup.maxBullets;

// 		this.createMultiple({
// 			frameQuantity: TowerSetup.maxShooters * 2,
// 			key: "bullet",
// 			active: false,
// 			visible: false,
// 			classType: Bullet
// 		});
// 	}

// 	placeCircle(x, y) {
// 		let circle = this.getFirstDead(true);
// 		circle.place(x, y);
// 	}
// }

export class Circle extends Phaser.Physics.Arcade.Sprite {
	weapon: ChainWeapon;
	polygon: CirclePolygon;
	unitType: string;
	id: string;
	scene: Gameplay;
	campID: CampID;
	radius: number;

	constructor(
		scene: Gameplay,
		x: number,
		y: number,
		texture: string,
		campID: CampID,
		weapon: ChainWeapon,
		physicsGroup: Phaser.Physics.Arcade.Group
	) {
		super(scene, x, y, texture);
		this.radius = this.scene.textures.get(texture).get(0).halfHeight;

		this.id =
			"_" +
			Math.random()
				.toString(36)
				.substr(2, 9);

		this.on(
			"animationcomplete",
			function(anim, frame) {
				this.emit("animationcomplete_" + anim.key, anim, frame);
			},
			this
		);
		this.polygon = new CirclePolygon(this.x, this.y, this.radius);

		scene.add.existing(this);
		physicsGroup.add(this);
		this.campID = campID;
		this.unitType = "circle";
		this.setCircle(this.radius);
		this.setupAnimEvents();
		this.weapon = weapon;
	}

	place(campID, weapon) {
		if (!this.campID) this.campID = campID;
		if (!this.weapon) this.weapon = weapon;
		if (!this.body.isCircle) this.setCircle(this.radius);
	}

	attack() {
		if (!this.weapon.attacking) {
			this.weapon.attacking = true;
			this.weapon.anims.play("attack-" + this.weapon.texture.key);
		}
	}

	rotateWeaponAroundCircle() {
		let point = Phaser.Math.RotateAround(
			new Phaser.Geom.Point(this.x + this.weapon.unitOffSetX, this.y + this.weapon.unitOffSetY),
			this.x,
			this.y,
			this.rotation
		);
		this.weapon.setPosition(point.x, point.y);
		this.weapon.setRotation(this.rotation);
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.rotateWeaponAroundCircle();
	}

	setupAnimEvents() {
		this.on(
			"animationcomplete_damage-" + this.texture.key,
			function() {
				this.anims.play("idle-" + this.texture.key);
			},
			this
		);
	}

	damage(_) {
		this.anims.play("damage-" + this.texture.key);
	}

	syncPolygon() {
		this.polygon.setPosition(this.x, this.y);
	}
}
