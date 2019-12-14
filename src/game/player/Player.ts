import { Circle } from "../base/classes/Circle";
import { playerStartX, playerStartY, playerTextureName } from "../../globals/globalConfig";
import { ChainWeapon } from "../weapons/ChainWeapon";
import { normalCircleRadius } from "../../globals/globalSizes";
import { CirclePolygon } from "../base/polygons/CirclePolygon";
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
		weapon.amount = 4000;
		return circle;
	}
}
