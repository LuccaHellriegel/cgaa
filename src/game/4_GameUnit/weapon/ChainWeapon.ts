import { EnemySize } from "../unit/CircleFactory";
import { movePointPhaser, rotatePointsPhaser, movePointsPhaser } from "../../0_GameBase/engine/geometry";
import { listenToAnim } from "../../0_GameBase/engine/anim-listen";
import { UnitSetup } from "../../0_GameBase/setup/UnitSetup";
import { weaponGeoms } from "../../0_GameBase/weapon/chain-weapon-geom";
import { weaponHeights, weaponDists } from "../../0_GameBase/weapon/chain-weapon-data";
import { CircleChain, unitArrowHeadConfig } from "../../0_GameBase/weapon/chain-weapon-base";

// PHYSICS
function circleChainToPhysicsTopCircle(
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
