import { Weapon } from "../weapons/Weapon";
import { InteractionCircle } from "../enemies/unit/InteractionCircle";
import { EnemyCircle } from "../enemies/unit/EnemyCircle";
import { Tower } from "../player/towers/Tower";

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

export function isInSight(weapon: Weapon, enemy) {
	if (weapon.attacking && !weapon.alreadyAttacked.includes(enemy.id)) {
		weapon.syncPolygon();
		enemy.syncPolygon();
		let collision = weapon.polygon.checkForCollision(enemy.polygon);
		return collision;
	} else if (
		weapon.owner.unitType !== "player" &&
		weapon.owner.state !== "ambush" &&
		!(weapon.owner instanceof InteractionCircle) &&
		(weapon.owner as EnemyCircle).color !== enemy.color &&
		weapon.owner.state !== "guard" &&
		!(weapon.owner as EnemyCircle).scene.cgaa.camps[(weapon.owner as EnemyCircle).color].dontAttackList.includes(
			enemy.color
		)
	) {
		(weapon.owner as EnemyCircle).stateHandler.spotted = enemy;
		weapon.owner.state = "guard";
	}

	if (
		enemy instanceof Tower &&
		!(weapon.owner as EnemyCircle).scene.cgaa.camps[(weapon.owner as EnemyCircle).color].dontAttackList.includes("blue")
	) {
		enemy.fire(weapon.owner);
	}
	return false;
}
