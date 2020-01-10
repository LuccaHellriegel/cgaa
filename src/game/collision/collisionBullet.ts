import { gainSouls } from "../base/events/player";
import { PhysicGroups, addCollider } from "./collisionBase";
import { executeOverAllCamps } from "../base/globals/global";
import { Bullet } from "../player/towers/Bullet";
import { EnemyCircle } from "../enemies/camp/unit/EnemyCircle";

function doDamageBullet(scene: Phaser.Scene, bullet: Bullet, enemy: EnemyCircle) {
	enemy.damage(bullet.amount);
	let damage = bullet.amount > enemy.healthbar.value ? enemy.healthbar.value : bullet.amount;

	gainSouls(scene, damage);
	if (enemy.state !== "ambush") {
		enemy.spotted = bullet.owner;
		enemy.state = "guard";
	}
	bullet.reset();
}

export function addBulletCollision(physicGroups: PhysicGroups) {
	let func = color => {
		//otherwise scene might be already deleted if enemy died
		let withAddedScene = (bullet: Bullet, enemy: EnemyCircle) => {
			doDamageBullet(physicGroups.towerBulletGroup.scene, bullet, enemy);
		};

		addCollider(physicGroups.towerBulletGroup, physicGroups.enemies[color], withAddedScene, () => true);
		addCollider(physicGroups.towerBulletGroup, physicGroups.buildings[color], withAddedScene, () => true);
	};

	executeOverAllCamps(func);
}
