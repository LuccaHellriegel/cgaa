import { EnemySize } from "../unit/CircleFactory";
import { Point } from "../base/types";
import { movePointPhaser, rotatePointsPhaser, movePointsPhaser } from "../base/geometry";
import { listenToAnim } from "../base/anim-listen";
import { UnitSetup } from "../setup/UnitSetup";

// TYPES

type WeaponRadius = {
	[key in EnemySize]: {
		bigRadius: number;
		smallRadius: number;
	};
};

type WeaponDists = {
	distArrowAndChain: number;
	distBetweenBigCircles: number;
	distBetweenBigAndSmallChain: number;
	distBetweenSmallCircles: number;
};

type AllWeaponDists = {
	[key in EnemySize]: WeaponDists;
};

type WeaponHeight = {
	frame0: number;
	frame1: number;
	frame2: number;
};

export type AllWeaponHeights = {
	[key in EnemySize]: WeaponHeight;
};

export type WeaponTopLefts = {
	frame0: Point;
	frame1: Point;
	frame2: Point;
};

export type AllWeaponTopLefts = {
	[key in EnemySize]: WeaponTopLefts;
};

export type WeaponChain = {
	smallCircles: number;
	bigCircles: number;
};

export type ArrowConfig = {
	width: number;
	height: number;
};

type ArrowHead = Point[];

export type CircleChain = {
	radius: number;
	points: Point[];
};

export type WeaponGeoms = {
	frame0: { arrow: ArrowHead };
	frame1: { bigChain: CircleChain };
	frame2: { arrow: ArrowHead; bigChain: CircleChain; smallChain: CircleChain };
};

export type AllWeaponGeoms = { [key in EnemySize]: WeaponGeoms };

// CONST

export const unitArrowHeadConfig: { [key in EnemySize]: ArrowConfig } = {
	Small: { width: 30, height: 15 },
	Normal: { width: 42, height: 21 },
	Big: { width: 84, height: 42 },
};

export const unitCircleChainsConfig: { [key in EnemySize]: WeaponChain } = {
	Small: { smallCircles: 7, bigCircles: 1 },
	Normal: { smallCircles: 5, bigCircles: 2 },
	Big: { smallCircles: 2, bigCircles: 3 },
};

export const chainWeaponColor = 0xff0000;

export const cirlceSizeNames: EnemySize[] = ["Small", "Normal", "Big"];

export const unitAmountConfig = {
	Small: { amount: 5 },
	Normal: { amount: 10 },
	Big: { amount: 20 },
};

// DATA

function weaponRadiusPerSize() {
	let result = {};

	for (let unitSize of cirlceSizeNames) {
		let { width } = unitArrowHeadConfig[unitSize];
		let bigRadius = width / 3 / 2;
		let smallRadius = 2 * (bigRadius / 3);
		result[unitSize] = { bigRadius, smallRadius };
	}

	return result as WeaponRadius;
}

export const weaponRadius: WeaponRadius = weaponRadiusPerSize();

function weaponDistsPerSize() {
	let result = {};
	for (let unitSize of cirlceSizeNames) {
		let { bigRadius, smallRadius } = weaponRadius[unitSize];

		let distArrowAndChain = 3 * bigRadius;
		let distBetweenBigCircles = smallRadius * 1.5 + bigRadius * 2;
		let distBetweenBigAndSmallChain = 2 * smallRadius + bigRadius;
		let distBetweenSmallCircles = smallRadius * 3.5;

		result[unitSize] = {
			distArrowAndChain,
			distBetweenBigCircles,
			distBetweenBigAndSmallChain,
			distBetweenSmallCircles,
		};
	}

	return result as AllWeaponDists;
}

export const weaponDists: AllWeaponDists = weaponDistsPerSize();

function weaponHeightPerSize() {
	let result = {};

	for (let unitSize of cirlceSizeNames) {
		let { smallCircles, bigCircles } = unitCircleChainsConfig[unitSize];
		let {
			distArrowAndChain,
			distBetweenBigAndSmallChain,
			distBetweenBigCircles,
			distBetweenSmallCircles,
		} = weaponDists[unitSize];
		let { height } = unitArrowHeadConfig[unitSize];
		let { bigRadius, smallRadius } = weaponRadius[unitSize];

		let arrowPlusBigCircles = height / 2 + distArrowAndChain + distBetweenBigCircles * (bigCircles - 1) + bigRadius;
		let fullHeight =
			arrowPlusBigCircles +
			distBetweenBigAndSmallChain +
			distBetweenSmallCircles * (smallCircles - 1) -
			bigRadius +
			smallRadius;
		result[unitSize] = { frame0: height, frame1: arrowPlusBigCircles, frame2: fullHeight };
	}

	return result as AllWeaponHeights;
}

export const weaponHeights: AllWeaponHeights = weaponHeightPerSize();

function weaponTopLeftsPerSize() {
	let result = {};

	let x = 0;
	let y = 0;
	for (let unitSize of cirlceSizeNames) {
		let { width } = unitArrowHeadConfig[unitSize];
		result[unitSize] = {
			frame0: { x, y },
			frame1: { x: x + width, y },
			frame2: { x: x + 2 * width, y },
		};
	}

	return result as AllWeaponTopLefts;
}

export const weaponTopLefts: AllWeaponTopLefts = weaponTopLeftsPerSize();

// GEOM

function weaponGeomsPerSize() {
	let result = {};
	for (let unitSize of cirlceSizeNames) {
		let arrowConfig = unitArrowHeadConfig[unitSize];
		let weaponChainConfig = unitCircleChainsConfig[unitSize];

		let topLefts = weaponTopLefts[unitSize];
		result[unitSize] = topDownWeaponGeom(topLefts, arrowConfig, weaponChainConfig, unitSize);
	}

	return result as AllWeaponGeoms;
}

function topDownWeaponGeom(
	topLefts: WeaponTopLefts,
	arrowConfig: ArrowConfig,
	weaponChainConfig: WeaponChain,
	unitSize: EnemySize
): WeaponGeoms {
	// need three frames, to allow empty space (all frames should start at the bottom)
	return {
		frame0: topDownWeaponGeomFrame0(topLefts.frame0, arrowConfig, unitSize),
		frame1: topDownWeaponGeomFrame1(topLefts.frame1, arrowConfig, weaponChainConfig, unitSize),
		frame2: topDownWeaponGeomFrame2(topLefts.frame2, arrowConfig, weaponChainConfig, unitSize),
	};
}

function topDownWeaponGeomFrame0(topLeft: Point, arrowConfig: ArrowConfig, unitSize: EnemySize) {
	let { width, height } = arrowConfig;
	let { x, y } = topLeft;
	let { frame0, frame2 } = weaponHeights[unitSize];
	y += frame2 - frame0;
	let arrow = arrowHeadPoints({ x, y }, width, height);

	return { arrow };
}

function topDownWeaponGeomFrame1(
	topLeft: Point,
	arrowConfig: ArrowConfig,
	weaponChainConfig: WeaponChain,
	unitSize: EnemySize
) {
	// calculate arrow
	let { width, height } = arrowConfig;
	let { x, y } = topLeft;
	let { frame1, frame2 } = weaponHeights[unitSize];
	y += frame2 - frame1;
	let arrow = arrowHeadPoints({ x, y }, width, height);

	// basic chain-circle data
	let { bigCircles } = weaponChainConfig;
	let { bigRadius } = weaponRadius[unitSize];
	let { distArrowAndChain, distBetweenBigCircles } = weaponDists[unitSize];

	// weapon geometry is aligned on x-axis, so any x = x
	let arrowCenterX = x + width / 2;
	let arrowCenterY = y + height / 2;

	// calculate bigChainTopCenter
	let bigChainTopCenter = { x: arrowCenterX, y: arrowCenterY + distArrowAndChain };

	// calculate bigChain
	let bigChain = { radius: bigRadius, points: topDownChain(bigChainTopCenter, distBetweenBigCircles, bigCircles) };

	return { arrow, bigChain };
}

function topDownWeaponGeomFrame2(
	topLeft: Point,
	arrowConfig: ArrowConfig,
	weaponChainConfig: WeaponChain,
	unitSize: EnemySize
) {
	// calculate arrow
	let { width, height } = arrowConfig;
	let arrow = arrowHeadPoints(topLeft, width, height);

	// basic chain-circle data
	let { smallCircles, bigCircles } = weaponChainConfig;
	let { bigRadius, smallRadius } = weaponRadius[unitSize];
	let { distArrowAndChain, distBetweenBigCircles, distBetweenBigAndSmallChain, distBetweenSmallCircles } = weaponDists[
		unitSize
	];

	// weapon geometry is aligned on x-axis, so any x = x
	let arrowCenterX = topLeft.x + width / 2;
	let arrowCenterY = topLeft.y + height / 2;

	// calculate bigChainTopCenter
	let bigChainTopCenter = { x: arrowCenterX, y: arrowCenterY + distArrowAndChain };

	// calculate bigChain
	let bigChain = { radius: bigRadius, points: topDownChain(bigChainTopCenter, distBetweenBigCircles, bigCircles) };

	// calculate smallChainTopCenter
	let lowestJoint = bigChain.points[bigChain.points.length - 1];
	let smallChainTopCenter = { x: arrowCenterX, y: lowestJoint.y + distBetweenBigAndSmallChain };

	// calculate smallChain
	let smallChain = {
		radius: smallRadius,
		points: topDownChain(smallChainTopCenter, distBetweenSmallCircles, smallCircles),
	};

	return { arrow, bigChain, smallChain };
}

function topDownChain(topCenter: Point, distance: number, numberOfJoints: number): Point[] {
	let { x, y } = topCenter;
	let result = [];
	for (let index = 0; index < numberOfJoints; index++) {
		result.push({ x: x, y: y });
		y += distance;
	}
	return result;
}

function arrowHeadPoints(topLeft: Point, width: number, height: number): Point[] {
	let { x, y } = topLeft;

	let ceilThirdWidth = Math.ceil(width / 3);
	let arrowLegLength = ceilThirdWidth;
	let emptySpaceBetweenLegs = width - 2 * ceilThirdWidth;

	let bottomLeft = { x: x, y: y + height };
	let bottomLeftMiddle = { x: x + arrowLegLength, y: y + height };
	let bottomTop = {
		x: x + arrowLegLength + emptySpaceBetweenLegs / 2,
		y: y + height - Math.floor(height / 3),
	};
	let bottomRightMiddle = { x: x + arrowLegLength + emptySpaceBetweenLegs, y: y + height };
	let bottomRight = { x: x + arrowLegLength + emptySpaceBetweenLegs + arrowLegLength, y: y + height };
	let top = { x: x + width / 2, y: y };

	return [bottomLeft, bottomLeftMiddle, bottomTop, bottomRightMiddle, bottomRight, top];
}

export const weaponGeoms: AllWeaponGeoms = weaponGeomsPerSize();

// DRAW

export function drawChainWeapon(graphics: Phaser.GameObjects.Graphics, geoms: WeaponGeoms) {
	let { frame0, frame1, frame2 } = geoms;
	drawChainWeaponFrame(graphics, frame0);
	drawChainWeaponFrame(graphics, frame1);
	drawChainWeaponFrame(graphics, frame2);
}

function drawChainWeaponFrame(graphics: Phaser.GameObjects.Graphics, geom) {
	if (geom.arrow) graphics.fillPoints(geom.arrow, true, true);
	if (geom.bigChain) {
		for (let joint of geom.bigChain.points) graphics.fillCircle(joint.x, joint.y, geom.bigChain.radius);
	}
	if (geom.smallChain) {
		for (let joint of geom.smallChain.points) graphics.fillCircle(joint.x, joint.y, geom.smallChain.radius);
	}
}

// PHYSICS

export function circleChainToPhysicsTopCircle(
	scene: Phaser.Scene,
	chain: CircleChain,
	parent: ChainWeapon,
	frame: number,
	arrowHeight: number,
	arrowWidth,
	distArrowAndChain: number
) {
	let point = chain.points[0];
	let radius = chain.radius;
	let result = scene.physics.add
		.sprite(point.x, point.y, "")
		.setVisible(false)
		.setActive(false)
		// to get correct circle position, we need to first change default size then set circle
		// (weird internal repositioning)
		.setSize(radius * 2, radius * 2)
		.setCircle(radius)
		.setImmovable(true)
		.setData("weapon", parent)
		.setData("frame", frame);
	let topYOfArrow = result.y - distArrowAndChain - arrowHeight / 2;
	let centerYOfNewTopCircle = topYOfArrow + arrowWidth / 2;
	result
		.setPosition(result.x, centerYOfNewTopCircle)
		.setSize(arrowWidth, arrowWidth)
		.setCircle(arrowWidth / 2);
	return result;
}

// TEXTURE

export function weaponTextures(scene: Phaser.Scene) {
	let g = scene.add.graphics({ fillStyle: { color: chainWeaponColor } });
	for (let unitSize of cirlceSizeNames) unitWeaponTexture(scene, unitSize, g);
}

function unitWeaponTexture(scene: Phaser.Scene, unitSize: EnemySize, g: Phaser.GameObjects.Graphics) {
	let geom = weaponGeoms[unitSize];
	let title = unitSize + "chainWeapon";
	let arrowConfig = unitArrowHeadConfig[unitSize];

	drawChainWeapon(g, geom);
	captureChainWeaponTexture(scene, g, title, unitSize, arrowConfig);

	g.clear();
}

function captureChainWeaponTexture(
	scene: Phaser.Scene,
	graphics: Phaser.GameObjects.Graphics,
	title: string,
	unitSize: EnemySize,
	config: ArrowConfig
) {
	// weapon width = arrow width
	let { width } = config;
	let { frame2 } = weaponHeights[unitSize];

	// needs to be the same graphics object that was used for ALL of the drawing
	// (no game objects allowed, e.g. add.circle)
	// drawing needs to be perfectly alligned with 0,0 being top-left
	graphics.generateTexture(title, width * 3, frame2);

	// capture frames

	// caputure arrow-head frame + empty space
	scene.textures.list[title].add(0, 0, 0, 0, width, frame2);

	// capture arrow-head + big chain + emptyspace
	scene.textures.list[title].add(1, 0, 0 + width, 0, width, frame2);

	// capture full weapon
	// TODO weird endless rectanlge appears below full texture
	scene.textures.list[title].add(2, 0, 0 + 2 * width, 0, width, frame2);
}

// WEAPON

export class ChainWeapon extends Phaser.Physics.Arcade.Sprite {
	owner: Phaser.Physics.Arcade.Image;
	initialized = false;
	attacking = false;
	alreadyAttacked = [];
	amount: number;
	circle: Phaser.Physics.Arcade.Sprite;
	circleFrame1: Phaser.Physics.Arcade.Sprite;
	circleFrame2: Phaser.Physics.Arcade.Sprite;

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture);
		scene.physics.add.existing(this);
		this.setSize(1, 1);
	}

	init(unitSize: EnemySize, x: number, y: number, amount: number) {
		this.enableBody(false, 0, 0, true, true);
		this.setPosition(x, y);

		//for sight
		this.setSize(444, 444);

		this.amount = amount;

		let geoms = weaponGeoms[unitSize];
		let smallChain = geoms.frame2.smallChain;
		let points = smallChain.points;
		let radius = smallChain.radius;
		let bottomCircleOfGeom = points[points.length - 1];
		// everything is initially aligned on the x-axis
		// so we just need to adjust y to the fact that x,y is the middle of the frame
		let diffX = this.x - bottomCircleOfGeom.x;
		let diffY = this.y - bottomCircleOfGeom.y - radius + weaponHeights[unitSize].frame2 / 2;

		let { height, width } = unitArrowHeadConfig[unitSize];
		let { distArrowAndChain } = weaponDists[unitSize];

		this.circle = circleChainToPhysicsTopCircle(
			this.scene,
			geoms.frame1.bigChain,
			this,
			1,
			height,
			width,
			distArrowAndChain
		);
		this.circle.disableBody(true, true);
		//	this.circleFrame0 = this.scene.add.circle(this.x)
		this.circleFrame1 = circleChainToPhysicsTopCircle(
			this.scene,
			geoms.frame1.bigChain,
			this,
			1,
			height,
			width,
			distArrowAndChain
		);
		this.circleFrame2 = circleChainToPhysicsTopCircle(
			this.scene,
			geoms.frame2.bigChain,
			this,
			1,
			height,
			width,
			distArrowAndChain
		);
		this.circleFrame1.body.debugShowBody = false;
		this.circleFrame2.body.debugShowBody = false;

		movePointPhaser(this.circleFrame2, diffX, diffY);

		// we align the second frame, then the offset between the frame geoms
		movePointPhaser(this.circleFrame1, diffX + unitArrowHeadConfig[unitSize].width, diffY);

		this.setRotation = this.setRotationCombined;
		this.setPosition = this.setPositionCombined;

		this.initialized = true;

		listenToAnim(this, {
			animComplete: true,
			attackComplete: this.finishAttack.bind(this),
			animUpdateCustom: this.alignCircles.bind(this),
		});

		this.scene.add.existing(this);
	}

	setOwner(owner: Phaser.Physics.Arcade.Image) {
		this.owner = owner;
	}

	alignCircles(key, frame) {
		if (frame.index === 2) {
			this.circle.setPosition(this.circleFrame1.x, this.circleFrame1.y);
		} else {
			// index === 3
			this.circle.setPosition(this.circleFrame2.x, this.circleFrame2.y);
		}
	}

	attack() {
		if (!this.attacking) {
			this.circle.enableBody(false, 0, 0, false, false);

			this.attacking = true;
			this.anims.play("attack-" + this.texture.key);
		}
	}

	finishAttack() {
		this.circle.disableBody(true, true);
		this.anims.play("idle-" + this.texture.key);
		this.attacking = false;
		this.alreadyAttacked = [];
	}

	setRotationAroundOwner() {
		// always calculate new rotation base point from current position of owner
		// this way we catch position changes of owner
		// We still need to use velocity, because it seems velocity changes are updated after preUpdate
		let point = Phaser.Math.RotateAround(
			new Phaser.Geom.Point(
				this.owner.x,
				this.owner.y - UnitSetup.sizeDict[this.owner.type] - weaponHeights[this.owner.type].frame2 / 2
			),
			this.owner.x,
			this.owner.y,
			this.owner.rotation
		);
		this.setPosition(point.x, point.y);
		this.setRotation(this.owner.rotation);
	}

	setRotationCombined(radians) {
		// setRotation starts always at 0, rotate around starts at the last value
		// so we need to only rotate the difference
		rotatePointsPhaser([this.circle, this.circleFrame1, this.circleFrame2], radians - this.rotation, this.x, this.y);
		return super.setRotation(radians);
	}

	setPhysicsPosition(x, y) {
		let diffX = x - this.x;
		let diffY = y - this.y;
		movePointsPhaser([this.circle, this.circleFrame1, this.circleFrame2], diffX, diffY);
	}

	setPositionCombined(x, y, z, w) {
		this.setPhysicsPosition(x, y);
		return super.setPosition(x, y, z, w);
	}

	setVelocity(x, y) {
		this.setVelocityX(x);
		this.setVelocityY(y);
		return this;
	}

	setVelocityOfOwner() {
		let velo = this.owner.body.velocity;
		this.setVelocityX(velo.x);
		this.setVelocityY(velo.y);
	}

	setVelocityX(velo) {
		this.circle.setVelocityX(velo);
		this.circleFrame1.setVelocityX(velo);
		this.circleFrame2.setVelocityX(velo);
		return super.setVelocityX(velo);
	}

	setVelocityY(velo) {
		this.circle.setVelocityY(velo);
		this.circleFrame1.setVelocityY(velo);
		this.circleFrame2.setVelocityY(velo);
		return super.setVelocityY(velo);
	}

	enable(x, y) {
		this.setPosition(x, y);
		this.enableBody(false, 0, 0, true, true);
		this.circle.enableBody(false, 0, 0, false, false);
		this.circleFrame1.enableBody(false, 0, 0, false, false);
		this.circleFrame2.enableBody(false, 0, 0, false, false);
	}

	disable() {
		this.setPosition(-100, -100);
		// owner needs to be disabled and placed first
		this.setRotationAroundOwner();
		//TODO: Weapon should not be reused until I finish implementing the circle pool

		this.disableBody(false, true);
		// all the objs are already not visible or activated
		this.circle.disableBody();
		this.circleFrame1.disableBody();
		this.circleFrame2.disableBody();
	}

	destroy() {
		this.circle.destroy();
		this.circleFrame1.destroy();
		this.circleFrame2.destroy();
		super.destroy();
	}

	toggle() {
		this.setVisible(!this.visible);
	}
}

// POOL

export class ChainWeapons extends Phaser.Physics.Arcade.Group {
	constructor(scene, private ownerSizeName, amount) {
		super(scene.physics.world, scene);
		this.createMultiple({
			frameQuantity: amount,
			key: ownerSizeName + "chainWeapon",
			active: false,
			visible: false,
			classType: ChainWeapon,
		});
		this.getChildren().forEach((child) => (child as Phaser.Physics.Arcade.Sprite).disableBody());
	}

	placeWeapon(x, y) {
		let weapon: ChainWeapon = this.getFirstDead(true);
		weapon.init(this.ownerSizeName, x, y, unitAmountConfig[this.ownerSizeName].amount);

		// new weapons are missing textures?
		// if (weapon.initialized) {
		// 	weapon.enable(x, y);
		// } else {
		// }
		return weapon;
	}
}
