import { SpriteWithAnimEvents } from "../base/BasePhaser";
import { CirclePolygon } from "../polygons/CirclePolygon";
import { Gameplay } from "../../scenes/Gameplay";
import { Weapon } from "../weapon/Weapon";
import { CampID } from "../setup/CampSetup";
import { CircleConfig } from "./CircleFactory";

export class Circle extends SpriteWithAnimEvents {
	weapon: Weapon;
	polygon: CirclePolygon;
	unitType: string;
	id: string;
	scene: Gameplay;
	campID: CampID;

	constructor(config: CircleConfig) {
		super(config);
		this.campID = config.campID;
		this.polygon = config.polygon;
		this.unitType = "circle";
		this.setCircle(config.radius);
		this.setupAnimEvents();
		this.weapon = config.weapon;
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
