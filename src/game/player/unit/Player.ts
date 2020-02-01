import { Circle } from "../../base/classes/Circle";
import { ChainWeapon } from "../../weapons/ChainWeapon";
import { normalCircleRadius } from "../../base/globals/globalSizes";
import { CirclePolygon } from "../../base/polygons/CirclePolygon";

const playerStartX = 1400;
const playerStartY = 1200;
const playerTextureName = "blueCircle";

export class Player extends Circle {
	color: string;
	constructor(scene, physicsGroup, weapon) {
		let polygon = new CirclePolygon(playerStartX, playerStartY, normalCircleRadius);

		super({
			scene,
			x: playerStartX,
			y: playerStartY,
			texture: playerTextureName,
			physicsGroup,
			polygon,
			weapon,
			radius: normalCircleRadius
		});
		this.color = "blue";
		this.unitType = "player";
	}

	setVelocityX(velo) {
		this.weapon.setVelocityX(velo);
		return super.setVelocityX(velo);
	}

	setVelocityY(velo) {
		this.weapon.setVelocityY(velo);
		return super.setVelocityY(velo);
	}

	//TODO: Player should spawn in PlayerAreaCamp
	static withChainWeapon(scene, playerPhysicsGroup, playerWeaponPhysicsGroup) {
		let weapon = new ChainWeapon(
			scene,
			playerStartX,
			playerStartY,
			playerWeaponPhysicsGroup,
			null,
			normalCircleRadius,
			"Normal"
		);
		let circle = new Player(scene, playerPhysicsGroup, weapon);
		weapon.owner = circle;

		weapon.amount = 40;
		weapon.amount = 40000;
		return circle;
	}
}
