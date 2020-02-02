import { Gameplay } from "../../scenes/Gameplay";
import { Bullet } from "../player/unit/shooter/Bullet";
import { EnemyCircle } from "../enemies/unit/EnemyCircle";
import { gainSouls } from "../base/events/player";

export class BulletCollision {
	constructor(private scene: Gameplay, bulletGroup: Phaser.Physics.Arcade.Group, otherGroups) {
		otherGroups.forEach(group => {
			scene.physics.add.collider(bulletGroup, group, this.collision.bind(this));
		});
	}

	private collision(bullet: Bullet, enemy: EnemyCircle) {
		let damage = bullet.amount;
		let enemyKilled = enemy.unitType !== "player" ? damage >= enemy.healthbar.value : false;
		if (enemyKilled) {
			damage = enemy.healthbar.value;
			gainSouls(this.scene, 100);
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
