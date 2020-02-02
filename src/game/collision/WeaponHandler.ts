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
		//Need this, otherwise all animation frames do damage
		weapon.alreadyAttacked.push(enemy.id);

		let damage = weapon.amount;
		let enemyKilled = enemy.unitType !== "player" ? damage >= enemy.healthbar.value : false;
		if (enemyKilled) {
			damage = enemy.healthbar.value;
			if (weapon.owner.unitType === "player") {
				gainSouls(scene, 100);
			}
		}

		//TODO: why emit this? For player damage?
		scene.events.emit("damage-" + enemy.unitType, damage);
		enemy.damage(damage);

		//TODO: which spotted is correct? (see BulletCollision)
		enemy.spotted = weapon.owner;
		enemy.state = "guard";
	}
}
