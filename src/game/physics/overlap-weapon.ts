import { EventSetup } from "../setup/EventSetup";
import { addCombinatorialOverlap } from "./combinatorial";
import { physicsGroups } from "./groups";
import { ChainWeapons } from "../weapon/chain/group";

export function addWeaponOverlap(scene, physicsGroups: physicsGroups) {
	addCombinatorialOverlap(scene, createWeaponArr(physicsGroups), doDamage, tryDamage);
}

function createWeaponArr(physicsGroups: physicsGroups) {
	let result = [];

	let enemyGroups = [...Object.values(physicsGroups.buildings), ...Object.values(physicsGroups.enemies)];
	let playerWeaponVsEnemyUnits = [[physicsGroups.playerWeapon.weaponGroup], enemyGroups];
	result.push(playerWeaponVsEnemyUnits);

	let allWeaponGroups = [];
	for (let enemyWeapon of Object.values(physicsGroups.enemyWeapons)) {
		allWeaponGroups = allWeaponGroups.concat(
			Object.values(enemyWeapon).map((enemyWeapon) => (enemyWeapon as ChainWeapons).weaponGroup)
		);
	}
	let enemyWeaponsVsPlayerUnits = [
		allWeaponGroups,
		[physicsGroups.player, physicsGroups.shooters, physicsGroups.healers],
	];
	result.push(enemyWeaponsVsPlayerUnits);

	let enemyWeaponsVsOtherUnits = [];
	let campIDs = Object.keys(physicsGroups.enemyWeapons);
	// this is so nested because we have three types per camp
	for (let campID of campIDs) {
		let curEnemyWeapon = physicsGroups.enemyWeapons[campID];
		let curGroups = Object.values(curEnemyWeapon).map((enemyWeapon) => (enemyWeapon as ChainWeapons).weaponGroup);
		let otherIDs = campIDs.filter((id) => id !== campID);
		let otherEnemyWeapons = otherIDs.map((id) => physicsGroups.enemyWeapons[id]);
		let otherGroups = [];
		for (let enemyWeapon of otherEnemyWeapons) {
			otherGroups = otherGroups.concat(
				Object.values(enemyWeapon).map((enemyWeapon) => (enemyWeapon as ChainWeapons).weaponGroup)
			);
		}

		enemyWeaponsVsOtherUnits.push([curGroups, otherGroups]);
	}
	result.push(...enemyWeaponsVsOtherUnits);

	return result;
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
