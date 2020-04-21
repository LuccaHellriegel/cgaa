import { EventSetup } from "../setup/EventSetup";
import { addCombinatorialOverlap } from "./Collision";

export function addWeaponOverlap(scene, combinatorialArr) {
	addCombinatorialOverlap(scene, combinatorialArr, doDamage, tryDamage);
}

function tryDamage(circle: Phaser.Physics.Arcade.Sprite, enemy) {
	let weapon = circle.getData("weapon");
	// only the physics circles that correspond to the current frame can do damage
	return (
		weapon.attacking && weapon.frame.name === circle.getData("frame") && !weapon.alreadyAttacked.includes(enemy.id)
	);
}

function doDamage(circle: Phaser.Physics.Arcade.Sprite, enemy) {
	let weapon = circle.getData("weapon");
	let damage = weapon.amount;
	let weaponOwner = weapon.owner;
	let enemyStateHandler = enemy.stateHandler;

	//Need this, otherwise all animation frames do damage
	weapon.alreadyAttacked.push(enemy.id);

	if (weaponOwner.unitType === "player") {
		//Gain souls if player kill (otherwise too much money)
		if (damage >= enemy.healthbar.value) EventSetup.gainSouls(weapon.scene, enemy.type);
	}

	enemy.damage(damage);

	if (enemyStateHandler) {
		enemyStateHandler.spotted = weaponOwner;
		enemyStateHandler.obstacle = weaponOwner;
	}
}
