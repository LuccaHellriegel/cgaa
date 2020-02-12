import { Gameplay } from "../../scenes/Gameplay";
import { Bullet } from "../tower/shooter/Bullet";
import { DangerousCircle } from "../unit/DangerousCircle";
import { EventSetup } from "../setup/EventSetup";

export class BulletCollision {
	constructor(private scene: Gameplay, bulletGroup: Phaser.Physics.Arcade.Group, otherGroups) {
		otherGroups.forEach(group => {
			scene.physics.add.collider(bulletGroup, group, this.collision.bind(this));
		});
	}

	private collision(bullet: Bullet, enemy: DangerousCircle) {
		let damage = bullet.amount;
		let enemyKilled = damage >= enemy.healthbar.value;
		if (enemyKilled) {
			damage = enemy.healthbar.value;
			EventSetup.gainSouls(this.scene, 100);
		}
		enemy.damage(damage);
		enemy.stateHandler.spotted = bullet.owner;
		bullet.reset();
	}
}
