import { CompositePolygon } from "../base/polygons/CompositePolygon";
import { SpriteWithAnimEvents } from "../base/classes/BasePhaser";
import { Circle } from "../base/classes/Circle";
import { Gameplay } from "../../scenes/Gameplay";

export abstract class Weapon extends SpriteWithAnimEvents {
	polygon: CompositePolygon;
	alreadyAttacked: string[];
	attacking: boolean;
	unitOffSetX: number;
	unitOffSetY: number;
	amount: number;

	constructor(
		scene: Gameplay,
		x: number,
		y: number,
		texture: string,
		weaponGroup: Phaser.Physics.Arcade.Group,
		public polygonArr: CompositePolygon[],
		public offSetArr: number[][],
		public owner: Circle,
		public ownerSize: number
	) {
		super({ scene, x, y, texture, physicsGroup: weaponGroup });
		this.setCollideWorldBounds(false);
		this.alreadyAttacked = [];
		this.attacking = false;
		this.setupAnimEvents();
		this.unitOffSetX = offSetArr[0][0];
		this.unitOffSetY = offSetArr[0][1];
		this.polygon = polygonArr[0];
		this.setSize(444, 444);
	}

	movePolygon() {
		if (this.polygon.centerX !== this.x || this.polygon.centerY !== this.y) {
			this.polygon.setPosition(this.x, this.y);
		}
		if (this.polygon.rotation !== this.rotation) {
			this.polygon.rotate(this.rotation);
		}
	}

	setPolygonForFrame() {
		this.polygon = this.polygonArr[parseInt(this.frame.name) - 1];
	}

	syncPolygon() {
		this.setPolygonForFrame();
		this.movePolygon();
	}

	setupAnimEvents() {
		this.on(
			"animationcomplete_attack-" + this.texture.key,
			function() {
				this.anims.play("idle-" + this.texture.key);
				this.attacking = false;
				this.alreadyAttacked = [];
			},
			this
		);
	}

	setOffSetForFrame() {
		let curFrameIndex = parseInt(this.frame.name) - 1;
		this.unitOffSetX = this.offSetArr[curFrameIndex][0];
		this.unitOffSetY = this.offSetArr[curFrameIndex][1];
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.setOffSetForFrame();
	}
}
