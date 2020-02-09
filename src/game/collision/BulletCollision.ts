import { Gameplay } from "../../scenes/Gameplay";
import { Bullet } from "../tower/shooter/Bullet";
import { EnemyCircle } from "../unit/EnemyCircle";
import { EventSetup } from "../setup/EventSetup";

export class BulletCollision {
	constructor(private scene: Gameplay, bulletGroup: Phaser.Physics.Arcade.Group, otherGroups) {
		otherGroups.forEach(group => {
			scene.physics.add.collider(bulletGroup, group, this.collision.bind(this));
		});
	}

	private collision(bullet: Bullet, enemy: EnemyCircle) {
		let damage = bullet.amount;
		let enemyKilled = damage >= enemy.healthbar.value;
		if (enemyKilled) {
			damage = enemy.healthbar.value;
			EventSetup.gainSouls(this.scene, 100);
		}
		enemy.damage(damage);

		//TODO:
		if (enemy.state !== "ambush" && enemy.stateHandler) {
			enemy.stateHandler.spotted = bullet.owner;
			enemy.state = "guard";
		}
		bullet.reset();
	}
}
