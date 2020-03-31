import { CompositePolygon } from "../polygons/CompositePolygon";
import { Circle } from "../unit/Circle";

const chainWeaponConfig = {
	Small: { numberOfSmallCircles: 7, numberOfBiggerCircles: 1, arrowWidth: 30, arrowHeight: 15, amount: 5 },
	Normal: { numberOfSmallCircles: 5, numberOfBiggerCircles: 2, arrowWidth: 42, arrowHeight: 21, amount: 10 },
	Big: { numberOfSmallCircles: 2, numberOfBiggerCircles: 3, arrowWidth: 84, arrowHeight: 42, amount: 20 }
};

export class ChainWeapons extends Phaser.Physics.Arcade.Group {
	constructor(scene, private ownerSize, private ownerSizeName, amount) {
		super(scene.physics.world, scene);

		this.createMultiple({
			frameQuantity: amount,
			key: ownerSizeName + "chainWeapon",
			active: false,
			visible: false,
			classType: ChainWeapon
		});

		this.getChildren().forEach(child => (child as Phaser.Physics.Arcade.Sprite).disableBody());
	}

	placeWeapon(x, y) {
		let weapon = this.getFirstDead(true);
		weapon.place(x, y, this.ownerSize, this.ownerSizeName);
		return weapon;
	}
}

export class ChainWeapon extends Phaser.Physics.Arcade.Sprite {
	numberOfSmallCircles: number;
	numberOfBiggerCircles: number;
	arrowWidth: number;
	arrowHeight: number;
	biggerCirclesRadius: number;
	smallerCirclesRadius: number;
	polygon: CompositePolygon;
	alreadyAttacked: string[] = [];
	attacking: boolean = false;
	unitOffSetX: number;
	unitOffSetY: number;
	amount: number;
	id: string;
	polygonArr: CompositePolygon[];
	offSetArr: number[][];
	owner: Circle;
	ownerSize: any;

	constructor(scene, x, y, texture) {
		super(scene, x, y, texture);
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

	place(x, y, ownerSize, ownerSizeName) {
		if (!this.ownerSize) this.ownerSize = ownerSize;
		if (!this.numberOfBiggerCircles) {
			let sizes = chainWeaponConfig[ownerSizeName];

			this.numberOfSmallCircles = sizes.numberOfSmallCircles;
			this.numberOfBiggerCircles = sizes.numberOfBiggerCircles;

			this.arrowWidth = sizes.arrowWidth;
			this.arrowHeight = sizes.arrowHeight;
			this.biggerCirclesRadius = this.arrowWidth / 3 / 2;
			this.smallerCirclesRadius = 2 * (this.biggerCirclesRadius / 3);

			this.amount = sizes.amount;
			this.createPolygons();
			this.setOffSetArr();
		}

		this.unitOffSetX = this.offSetArr[0][0];
		this.unitOffSetY = this.offSetArr[0][1];
		this.enableBody(true, x, y, true, true);
		this.setSize(444, 444);
	}

	setOwner(owner) {
		this.owner = owner;
	}

	setOffSetArr() {
		this.offSetArr = [
			[0, -this.ownerSize - this.polygon.height / 2],
			[0, -this.ownerSize - this.polygonArr[1].height / 2],
			[0, -this.ownerSize - this.polygonArr[2].height / 2]
		];
	}

	createPolygons() {
		this.createArrowHeadPolygon();
		let middleStagePolygon = this.createMiddleStagePolygon();
		let finalStagePolygon = this.createFinalStagePolygon();
		this.polygonArr = [this.polygon, middleStagePolygon, finalStagePolygon];
	}

	createArrowHeadPolygon() {
		let arrowHeadConfig = [this.createArrowHeadConfig([])];
		this.polygon = new CompositePolygon(arrowHeadConfig);
	}

	createMiddleStagePolygon() {
		let biggerCirclesConfig = this.createBiggerCirclesConfig([]);
		let arrowHeadConfig = [this.createArrowHeadConfig(biggerCirclesConfig)];
		return new CompositePolygon(biggerCirclesConfig.concat(arrowHeadConfig));
	}

	createFinalStagePolygon() {
		let smallerCirclesConfig = this.createSmallCirclesConfig();
		let biggerCirclesConfig = this.createBiggerCirclesConfig(smallerCirclesConfig);
		let arrowHeadConfig = [this.createArrowHeadConfig(biggerCirclesConfig)];
		return new CompositePolygon(smallerCirclesConfig.concat(biggerCirclesConfig, arrowHeadConfig));
	}

	getLastXYFromConfig(lastConfigPart) {
		let lastIndex = lastConfigPart.length - 1;

		let lastX = lastIndex != -1 ? lastConfigPart[lastIndex][0] : this.x;
		let lastY = lastIndex != -1 ? lastConfigPart[lastIndex][1] : this.y;
		return {
			lastX,
			lastY
		};
	}

	createArrowHeadConfig(lastConfigPart) {
		let { lastX, lastY } = this.getLastXYFromConfig(lastConfigPart);
		let distanceOfArrowHeadFromNearestCircleCenter = lastY === this.y ? 0 : 3 * this.biggerCirclesRadius;
		let arrowHeadPolygonConfig = [
			lastX,
			lastY - distanceOfArrowHeadFromNearestCircleCenter,
			this.arrowWidth,
			this.arrowHeight,
			"arrowHead"
		];
		return arrowHeadPolygonConfig;
	}

	createSmallCirclesConfig() {
		let smallerCirclesConfig = [];
		for (let index = 0; index < this.numberOfSmallCircles; index++) {
			let newX = this.x;
			let newY = this.y - index * this.smallerCirclesRadius * 3.5;
			smallerCirclesConfig.push([newX, newY, this.smallerCirclesRadius]);
		}
		return smallerCirclesConfig;
	}

	createBiggerCirclesConfig(lastConfigPart) {
		let biggerCirclesConfig = [];
		let { lastX, lastY } = this.getLastXYFromConfig(lastConfigPart);

		lastY -= 2 * this.smallerCirclesRadius + this.biggerCirclesRadius;

		for (let index = 0; index < this.numberOfBiggerCircles; index++) {
			let newX = lastX;
			let newY = lastY - index * (this.smallerCirclesRadius * 1.5 + this.biggerCirclesRadius * 2);
			biggerCirclesConfig.push([newX, newY, this.biggerCirclesRadius]);
		}

		return biggerCirclesConfig;
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

	setOffSetForFrame() {
		let curFrameIndex = parseInt(this.frame.name) - 1;
		this.unitOffSetX = this.offSetArr[curFrameIndex][0];
		this.unitOffSetY = this.offSetArr[curFrameIndex][1];
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.setOffSetForFrame();
	}

	toggle() {
		if (this.visible) {
			this.setVisible(false);
		} else {
			this.setVisible(true);
		}
	}
}
