import { gainSouls } from "../base/events/player";
import { PhysicGroups, addCollider } from "./collisionBase";
import { executeOverAllCamps } from "../base/globals/global";

function doDamageBullet(bullet, enemy) {
	enemy.damage(bullet.amount);
	let damage = bullet.amount > enemy.healthbar.value ? enemy.healthbar.value : bullet.amount;

	gainSouls(enemy.scene, damage);
	if (enemy.state !== "ambush") {
		enemy.spotted = bullet.owner;
		enemy.state = "guard";
	}
	bullet.reset();
}

export function addBulletCollision(physicGroups: PhysicGroups) {
	let func = color => {
		addCollider(physicGroups.towerBulletGroup, physicGroups.enemies[color], doDamageBullet, () => true);
		addCollider(physicGroups.towerBulletGroup, physicGroups.buildings[color], doDamageBullet, () => true);
	};

	executeOverAllCamps(func);
}
