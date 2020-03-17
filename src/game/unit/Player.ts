import { Circle } from "./Circle";
import { CirclePolygon } from "../polygons/CirclePolygon";
import { UnitSetup } from "../setup/UnitSetup";
import { ChainWeapon } from "../weapon/ChainWeapon";
import { CampSetup } from "../setup/CampSetup";
import { EventSetup } from "../setup/EventSetup";
import { healable } from "../base/interfaces";

const playerStartX = 1400;
const playerStartY = 1200;
const playerTextureName = "blueNormalCircle";

export class Player extends Circle implements healable {
	stateHandler: { spotted: any; obstacle: any };

	constructor(scene, physicsGroup, weapon, playerX, playerY) {
		let polygon = new CirclePolygon(playerX, playerY, UnitSetup.normalCircleRadius);

		super({
			scene,
			x: playerX,
			y: playerY,
			texture: playerTextureName,
			physicsGroup,
			polygon,
			weapon,
			radius: UnitSetup.normalCircleRadius,
			campID: CampSetup.playerCampID
		});
		this.unitType = "player";

		this.stateHandler = { spotted: null, obstacle: null };
	}

	setVelocityX(velo) {
		this.weapon.setVelocityX(velo);
		return super.setVelocityX(velo);
	}

	setVelocityY(velo) {
		this.weapon.setVelocityY(velo);
		return super.setVelocityY(velo);
	}

	heal(amount: number) {
		this.scene.events.emit(EventSetup.healPlayer, amount);
	}

	//TODO: Player should spawn in PlayerAreaCamp
	static withChainWeapon(scene, playerPhysicsGroup, playerWeaponPhysicsGroup, playerX, playerY) {
		let weapon = new ChainWeapon(
			scene,
			playerX,
			playerY,
			playerWeaponPhysicsGroup,
			null,
			UnitSetup.normalCircleRadius,
			"Normal"
		);
		let circle = new Player(scene, playerPhysicsGroup, weapon, playerX, playerY);
		weapon.owner = circle;

		weapon.amount = 40;
		weapon.amount = 40000;
		return circle;
	}
}
