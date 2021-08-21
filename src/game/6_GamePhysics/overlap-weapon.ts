import { EventSetup } from "../0_GameBase/setup/EventSetup";
import { HealthBar } from "../4_GameUnit/healthbar/HealthBar";

export function initWeaponGroupPair(scene: Phaser.Scene) {
	const weapons = scene.physics.add.group();
	const enemies = scene.physics.add.group();
	const staticEnemies = scene.physics.add.staticGroup();

	scene.physics.add.overlap(weapons, enemies, doDamage, tryDamage);
	scene.physics.add.overlap(weapons, staticEnemies, doDamage, tryDamage);

	return {
		addToWeapon: function (newWeapon: Phaser.GameObjects.GameObject) {
			weapons.add(newWeapon);
		},
		addToEnemy: function (unit: Phaser.GameObjects.GameObject) {
			enemies.add(unit);
		},
		addToStaticEnemy: function (unit: Phaser.GameObjects.GameObject) {
			staticEnemies.add(unit);
		},
	};
}

function tryDamage(circle: Phaser.Physics.Arcade.Sprite, enemy) {
	let weapon = circle.getData("weapon");
	return weapon.attacking && !weapon.alreadyAttacked.includes(enemy.id);
}

function doDamage(circle: Phaser.Physics.Arcade.Sprite, enemy) {
	let weapon = circle.getData("weapon");
	let weaponOwner = weapon.owner;

	// need to have an eye if this is a good tradeoff vs having more groups
	if (weaponOwner.campID !== enemy.campID) {
		let damage = weapon.amount;
		let enemyStateHandler = enemy.stateHandler;

		//Need this, otherwise all animation frames do damage
		weapon.alreadyAttacked.push(enemy.id);

		if (weaponOwner.unitType === "player") {
			//Gain souls if player kill (otherwise too much money)
			if (damage >= (enemy.healthbar as HealthBar).health.current) EventSetup.gainSouls(weapon.scene, enemy.type);
		}

		enemy.damage(damage);

		if (enemyStateHandler) {
			enemyStateHandler.spotted = weaponOwner;
			enemyStateHandler.obstacle = weaponOwner;
		}
	}
}
