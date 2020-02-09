import { Weapon } from "../weapon/Weapon";
import { EventSetup } from "../setup/EventSetup";

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
		//Player unit has no healthbar
		let enemyKilled = weapon.owner.unitType === "player" && damage >= enemy.healthbar.value;
		if (enemyKilled) {
			damage = enemy.healthbar.value;
			//Gain souls if player kill or player friend kill
			if (weapon.owner.unitType === "player" || weapon.owner.campID === "blue") {
				EventSetup.gainSouls(scene, 100);
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
