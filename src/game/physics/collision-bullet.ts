import { Gameplay } from "../../scenes/Gameplay";
import { Bullet } from "../tower/shooter/Bullet";
import { DangerousCircle } from "../unit/DangerousCircle";
import { EventSetup } from "../setup/EventSetup";
import { physicsGroups } from "./groups";

export function addBulletCollision(scene: Gameplay, physicsGroups: physicsGroups) {
	let bulletGroup = physicsGroups.bulletGroup;
	let enemyGroups = [...Object.values(physicsGroups.buildings), ...Object.values(physicsGroups.enemies)];
	enemyGroups.forEach((group) => {
		scene.physics.add.collider(bulletGroup, group as Phaser.Physics.Arcade.Group, collision);
	});
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
