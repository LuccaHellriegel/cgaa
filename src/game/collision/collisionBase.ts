import { Weapon } from "../weapons/Weapon";
import { InteractionCircle } from "../enemies/unit/InteractionCircle";
import { EnemyCircle } from "../enemies/unit/EnemyCircle";
import { Tower } from "../player/towers/Tower";
import { WeaponHandler } from "./WeaponHandler";

export function addOverlap(first, second, actualCallback, truthyCallback) {
	first.scene.physics.add.overlap(first, second, actualCallback, truthyCallback);
}

export function addCollider(first, second, actualCallback, truthyCallback) {
	first.scene.physics.add.collider(first, second, actualCallback, truthyCallback);
}

export interface PhysicGroups {
	player: Phaser.Physics.Arcade.Group;
	playerWeapon: Phaser.Physics.Arcade.Group;
	towers: Phaser.Physics.Arcade.StaticGroup;
	enemies: {};
	enemyWeapons: {};
	areas: Phaser.Physics.Arcade.StaticGroup;
	towerBulletGroup: Phaser.Physics.Arcade.Group;
	buildings: {};
}

function shouldSwitchToGuard(weapon: Weapon, enemy) {
	let isNotPlayer = weapon.owner.unitType !== "player";
	let isNotInAmbush = weapon.owner.state !== "ambush";
	let isNotInteractionCircle = !(weapon.owner instanceof InteractionCircle);
	let isNotSameCamp = (weapon.owner as EnemyCircle).color !== enemy.color;
	let isNotAlreadyGuard = weapon.owner.state !== "guard";
	let isNotInCooperation =
		weapon.owner instanceof EnemyCircle &&
		!(weapon.owner as EnemyCircle).scene.cgaa.camps[(weapon.owner as EnemyCircle).color].dontAttackList.includes(
			enemy.color
		);
	return (
		isNotPlayer && isNotInAmbush && isNotInteractionCircle && isNotSameCamp && isNotAlreadyGuard && isNotInCooperation
	);
}

export function isInSight(weapon: Weapon, enemy) {
	let isNotInCooperationWithPlayer =
		weapon.owner instanceof EnemyCircle &&
		!(weapon.owner as EnemyCircle).scene.cgaa.camps[(weapon.owner as EnemyCircle).color].dontAttackList.includes(
			"blue"
		);
	if (enemy instanceof Tower && isNotInCooperationWithPlayer) {
		enemy.fire(weapon.owner);
	}
	if (WeaponHandler.shouldTryDamage(weapon, enemy)) {
		return WeaponHandler.tryCollision(weapon, enemy);
	} else if (shouldSwitchToGuard(weapon, enemy)) {
		(weapon.owner as EnemyCircle).stateHandler.spotted = enemy;
		weapon.owner.state = "guard";
	}

	return false;
}
