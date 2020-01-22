import { Weapon } from "../weapons/Weapon";
import { gainSouls } from "../base/events/player";

export class WeaponHandler {
	private constructor() {}

	static shouldTryDamage(weapon: Weapon, enemy) {
		return weapon.attacking && !weapon.alreadyAttacked.includes(enemy.id);
	}

	static tryCollision(weapon: Weapon, enemy) {
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

	static doDamage(scene: Phaser.Scene, weapon, enemy) {
		weapon.alreadyAttacked.push(enemy.id);

		let damage;
		if (enemy.unitType !== "player") {
			damage = weapon.amount > enemy.healthbar.value ? enemy.healthbar.value : weapon.amount;
		} else {
			damage = weapon.amount;
		}

		enemy.scene.events.emit("damage-" + enemy.unitType, damage);
		if (weapon.owner.unitType === "player") {
			gainSouls(scene, damage);
		}

		enemy.damage(weapon.amount);
		enemy.spotted = weapon.owner;
		enemy.state = "guard";
	}
}
