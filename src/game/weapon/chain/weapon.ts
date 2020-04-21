import { EnemySize } from "../../unit/CircleFactory";
import { weaponGeoms, weaponHeights } from "./data";
import { PhysicsGeoms } from "./types";
import { movePointPhaser, rotatePointPhaser } from "../../base/geometry";
import { weaponGeomsToPhysicsCircles } from "./physics";
import { unitArrowHeadConfig } from "./const";
import { UnitSetup } from "../../setup/UnitSetup";
import { listenToAnim } from "../../base/anim-listen";

export class ChainWeapon extends Phaser.Physics.Arcade.Sprite {
	physicsGeoms: PhysicsGeoms;
	owner: Phaser.Physics.Arcade.Image;
	initialized = false;
	attacking = false;
	alreadyAttacked = [];
	amount: number;

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture);
		scene.physics.add.existing(this);
		this.setSize(1, 1);
	}

	init(unitSize: EnemySize, x: number, y: number, amount: number, weaponGroup: Phaser.Physics.Arcade.Group) {
		this.enableBody(false, 0, 0, true, true);
		this.setPosition(x, y);

		this.amount = amount;

		this.physicsGeoms = weaponGeomsToPhysicsCircles(this.scene, unitSize, this, weaponGroup);
		let geoms = weaponGeoms[unitSize];
		let smallChain = geoms.frame2.smallChain;
		let points = smallChain.points;
		let radius = smallChain.radius;
		let bottomCircleOfGeom = points[points.length - 1];
		// everything is initially aligned on the x-axis
		// so we just need to adjust y to the fact that x,y is the middle of the frame
		let diffX = this.x - bottomCircleOfGeom.x;
		let diffY = this.y - bottomCircleOfGeom.y - radius + weaponHeights[unitSize].frame2 / 2;
		movePointPhaser(this.physicsGeoms.frame2.topCircle, diffX, diffY);

		// we align the second frame, then the offset between the frame geoms
		movePointPhaser(this.physicsGeoms.frame1.topCircle, diffX + unitArrowHeadConfig[unitSize].width, diffY);

		this.setRotation = this.setRotationCombined;
		this.setPosition = this.setPositionCombined;

		this.initialized = true;

		listenToAnim(this, { animComplete: true, attackComplete: this.finishAttack.bind(this) });

		this.scene.add.existing(this);
	}

	setOwner(owner: Phaser.Physics.Arcade.Image) {
		this.owner = owner;
	}

	attack() {
		if (!this.attacking) {
			this.attacking = true;
			this.anims.play("attack-" + this.texture.key);
		}
	}

	finishAttack() {
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
		rotatePointPhaser(this.physicsGeoms.frame1.topCircle, radians - this.rotation, this.x, this.y);
		rotatePointPhaser(this.physicsGeoms.frame2.topCircle, radians - this.rotation, this.x, this.y);
		return super.setRotation(radians);
	}

	setPhysicsPosition(x, y) {
		let diffX = x - this.x;
		let diffY = y - this.y;
		movePointPhaser(this.physicsGeoms.frame1.topCircle, diffX, diffY);
		movePointPhaser(this.physicsGeoms.frame2.topCircle, diffX, diffY);
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
		this.physicsGeoms.frame1.topCircle.setVelocityX(velo);
		this.physicsGeoms.frame2.topCircle.setVelocityX(velo);
		return super.setVelocityX(velo);
	}

	setVelocityY(velo) {
		this.physicsGeoms.frame1.topCircle.setVelocityY(velo);
		this.physicsGeoms.frame2.topCircle.setVelocityY(velo);
		return super.setVelocityY(velo);
	}

	enable(x, y) {
		this.setPosition(x, y);
		this.enableBody(false, 0, 0, true, true);
		this.physicsGeoms.frame1.topCircle.enableBody(false, 0, 0, false, false);
		this.physicsGeoms.frame2.topCircle.enableBody(false, 0, 0, false, false);
	}

	disable() {
		this.setPosition(-100, -100);
		// owner needs to be disabled and placed first
		this.setRotationAroundOwner();
		//TODO: Weapon should not be reused until I finish implementing the circle pool

		this.disableBody(false, true);
		// all the objs are already not visible or activated
		this.physicsGeoms.frame1.topCircle.disableBody();
		this.physicsGeoms.frame2.topCircle.disableBody();
	}
}
