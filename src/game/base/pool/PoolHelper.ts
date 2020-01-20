export class PoolHelper {
	private constructor() {}

	static destroyTower(tower) {
		tower.bullets.forEach(bullet => bullet.reset());
		tower.scene.events.emit("inactive-" + tower.id, tower.id);
		tower.disableBody(true, true);
		tower.healthbar.bar.setActive(false).setVisible(false);
		tower.healthbar.value = tower.healthbar.defaultValue;
	}

	static activateTower(tower, x, y) {
		tower.enableBody(true, x, y, true, true);
		tower.healthbar.bar.setActive(true).setVisible(true);
		tower.healthbar.move(x, y);
		tower.bullets.forEach(bullet => bullet.reset());
	}

	static destroyEnemyCircle(circle) {
		circle.scene.events.emit("inactive-" + circle.id, circle.id);
		circle.disableBody(true, true);
		circle.setPosition(-1000, -1000);
		circle.weapon.disableBody(true, true);
		circle.healthbar.bar.setActive(false).setVisible(false);
		circle.healthbar.value = circle.healthbar.defaultValue;
	}

	static activateEnemyCircle(circle, x, y) {
		circle.enableBody(true, x, y, true, true);
		circle.weapon.enableBody(true, x, y, true, true);
		circle.healthbar.bar.setActive(true).setVisible(true);
	}
}
