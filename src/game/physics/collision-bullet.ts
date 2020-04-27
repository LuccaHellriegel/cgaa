import { Bullet } from "../tower/shooter/Bullet";
import { DangerousCircle } from "../unit/DangerousCircle";
import { EventSetup } from "../setup/EventSetup";

export function initBulletGroupPair(scene: Phaser.Scene) {
	const bullets = scene.physics.add.staticGroup();
	const enemies = scene.physics.add.group();
	scene.physics.add.collider(bullets, enemies, collision);

	return {
		addToBullets: function (bullet: Phaser.GameObjects.GameObject) {
			bullets.add(bullet);
		},
		addToEnemies: function (enemy: Phaser.GameObjects.GameObject) {
			enemies.add(enemy);
		},
	};
}

function collision(bullet: Bullet, enemy: DangerousCircle) {
	let damage = bullet.amount;
	let enemyKilled = damage >= enemy.healthbar.value;
	if (enemyKilled) {
		damage = enemy.healthbar.value;
		EventSetup.gainSouls(bullet.scene, enemy.type);
	}
	enemy.damage(damage);
	if (enemy instanceof DangerousCircle) enemy.stateHandler.spotted = bullet.owner;
	bullet.hitTarget();
}
