import { Circle } from "./Circle";
import { CirclePolygon } from "../polygons/CirclePolygon";
import { UnitSetup } from "../setup/UnitSetup";
import { ChainWeapon } from "../weapon/ChainWeapon";
import { CampSetup } from "../setup/CampSetup";
import { EventSetup } from "../setup/EventSetup";
import { healable } from "../base/interfaces";

const playerTextureName = "blueNormalCircle";

export class Player extends Circle implements healable {
	stateHandler: { spotted: any; obstacle: any };

	constructor(scene, physicsGroup, weapon, playerX, playerY) {
		super(scene, playerX, playerY, playerTextureName, CampSetup.playerCampID, weapon, physicsGroup);
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

	static withChainWeapon(scene, playerPhysicsGroup, playerWeaponPhysicsGroup, playerX, playerY) {
		let weapon = new ChainWeapon(scene, playerX, playerY, "NormalchainWeapon");
		playerWeaponPhysicsGroup.add(weapon);

		scene.add.existing(weapon);
		weapon.place(playerX, playerY, UnitSetup.sizeDict["Normal"], "Normal");
		let circle = new Player(scene, playerPhysicsGroup, weapon, playerX, playerY);
		weapon.owner = circle;

		weapon.amount = 40;
		//weapon.amount = 40000;
		return circle;
	}
}
