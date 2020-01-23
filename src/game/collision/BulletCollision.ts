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
		//TODO: somehow if shooter is destroyed it creates a black hole
		enemy.damage(bullet.amount);

		let damage = bullet.amount > enemy.healthbar.value ? enemy.healthbar.value : bullet.amount;
		gainSouls(this.scene, damage);
		if (enemy.state !== "ambush") {
			enemy.stateHandler.spotted = bullet.owner;
			enemy.state = "guard";
		}
		bullet.reset();
	}
}
