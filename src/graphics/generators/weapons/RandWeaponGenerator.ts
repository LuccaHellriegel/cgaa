import { Gameplay } from "../../../scenes/Gameplay";
import { RandWeapon } from "../../../game/weapons/RandWeapon";
import { WeaponGenerator } from "./WeaponGenerator";

export class RandWeaponGenerator extends WeaponGenerator {
	randWeapon: RandWeapon;
	idlePolygonWidth: number;
	idlePolygonHeight: number;
	attackPolygonWidth: number;
	attackPolygonHeight: number;
	circleSize: any;

	constructor(hexColor: number, scene: Gameplay, circleSize) {
		super(hexColor, scene);
		this.randWeapon = new RandWeapon(
			scene,
			this.biggerThanWeapon,
			this.biggerThanWeapon,
			this.tempWeaponGroup,
			null,
			0,
			circleSize
		);
		this.circleSize = circleSize;
		this.generate();
	}

	drawFrames() {
		this.setPolygonMeasurementsForEasierPositioning();
		this.setPositionsForWeaponPolygonsForDrawing();
		this.drawRandWeaponPolygons();
	}

	setPolygonMeasurementsForEasierPositioning() {
		this.idlePolygonWidth = this.randWeapon.polygon.width;
		this.idlePolygonHeight = this.randWeapon.polygon.height;

		this.attackPolygonWidth = this.randWeapon.polygonArr[1].width;
		this.attackPolygonHeight = this.randWeapon.polygonArr[1].height;
	}

	setPositionsForWeaponPolygonsForDrawing() {
		this.randWeapon.polygon.setPosition(this.idlePolygonWidth / 2, this.idlePolygonHeight / 2);

		this.randWeapon.polygonArr[1].setPosition(
			this.idlePolygonWidth + this.attackPolygonWidth / 2,
			this.attackPolygonHeight / 2
		);
		let diffBetweenAttackCenterAndIdleCenterY =
			this.randWeapon.polygonArr[1].polygons[0].y - this.randWeapon.polygonArr[0].centerY;
		this.randWeapon.polygonArr[1].setPosition(
			this.idlePolygonWidth + this.attackPolygonWidth / 2,
			this.attackPolygonHeight / 2 - diffBetweenAttackCenterAndIdleCenterY
		);
	}

	drawRandWeaponPolygons() {
		this.randWeapon.polygon.draw(this.graphics, 0);
		this.randWeapon.polygonArr[1].draw(this.graphics, 0);
	}

	generateTexture() {
		this.graphics.generateTexture(
			this.circleSize + "randWeapon",
			this.idlePolygonWidth + this.attackPolygonWidth,
			this.attackPolygonHeight
		);
	}

	addFrames() {
		let topLeftX = 0;
		let topLeftY = 0;

		this.scene.textures.list[this.circleSize + "randWeapon"].add(
			1,
			0,
			topLeftX,
			topLeftY,
			this.idlePolygonWidth,
			this.idlePolygonHeight
		);

		topLeftX += this.idlePolygonWidth;
		this.scene.textures.list[this.circleSize + "randWeapon"].add(
			2,
			0,
			topLeftX,
			topLeftY,
			this.attackPolygonWidth,
			this.attackPolygonHeight
		);
	}

	destroyUsedObjects() {
		super.destroyUsedObjects();
		this.randWeapon.destroy();
	}
}
