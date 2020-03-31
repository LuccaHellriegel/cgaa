import { ChainWeapon } from "../weapon/ChainWeapon";
import { EventSetup } from "../setup/EventSetup";
import { Gameplay } from "../../scenes/Gameplay";

export class WeaponHandler {
	private constructor() {}

	static shouldTryDamage(weapon: ChainWeapon, enemy) {
		return weapon.attacking && !weapon.alreadyAttacked.includes(enemy.id);
	}

	static tryCollision(weapon: ChainWeapon, enemy) {
		weapon.syncPolygon();
		enemy.syncPolygon();

		let hasColided = false;
		try {
			hasColided = weapon.polygon.checkForCollision(enemy.polygon);
		} catch (error) {
			console.log(error, weapon, enemy);
		}
		return hasColided;
	}

	static doDamage(scene: Gameplay, weapon, enemy) {
		//Need this, otherwise all animation frames do damage
		weapon.alreadyAttacked.push(enemy.id);

		let damage = weapon.amount;
		//Player unit has no healthbar
		let isPlayer = weapon.owner.unitType === "player";

		if (isPlayer) {
			//Gain souls if player kill (otherwise too much money)
			if (damage >= enemy.healthbar.value) EventSetup.gainSouls(scene, enemy.type);
		}
		scene.events.emit(EventSetup.partialDamage + enemy.unitType, damage);
		enemy.damage(damage);

		if (enemy.stateHandler) {
			//TODO: this is suboptimal?
			enemy.stateHandler.spotted = weapon.owner;
			enemy.stateHandler.obstacle = weapon.owner;
		}
	}
}
