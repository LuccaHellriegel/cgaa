import { addOverlap, PhysicGroups, isInSight } from "./collisionBase";
import { executeOverAllCamps } from "../base/globals/global";
import { gainSouls } from "../base/events/player";

function addWeaponOverlap(weapon: Phaser.Physics.Arcade.Group, unit) {
	//otherwise scene might be already deleted if enemy died
	let withAddedScene = (weapon, unit) => {
		doDamage(weapon.scene, weapon, unit);
	};

	addOverlap(weapon, unit, withAddedScene, isInSight);
}

function doDamage(scene: Phaser.Scene, weapon, enemy) {
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

export function addWeaponCollision(physicGroups: PhysicGroups) {
	let func = color => {
		addWeaponOverlap(physicGroups.playerWeapon, physicGroups.enemies[color]);
		addWeaponOverlap(physicGroups.playerWeapon, physicGroups.buildings[color]);

		addWeaponOverlap(physicGroups.enemyWeapons[color], physicGroups.player);
		addWeaponOverlap(physicGroups.enemyWeapons[color], physicGroups.towers);
		let secondFunc = secondColor => {
			if (secondColor !== color) {
				addWeaponOverlap(physicGroups.enemyWeapons[color], physicGroups.enemies[secondColor]);
				addWeaponOverlap(physicGroups.enemyWeapons[color], physicGroups.buildings[secondColor]);
			}
		};
		executeOverAllCamps(secondFunc);
	};
	executeOverAllCamps(func);
}
