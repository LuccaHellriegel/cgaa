export class PoolHelper {
	private constructor() {}

	private static genericDestroy(unit) {
		unit.scene.events.emit("inactive-" + unit.id, unit.id);
		unit.disableBody(true, true);
		unit.setPosition(-1000, -1000);
		unit.healthbar.bar.setActive(false).setVisible(false);
		unit.healthbar.value = unit.healthbar.defaultValue;
	}

	private static genericActivate(unit, x, y) {
		unit.enableBody(true, x, y, true, true);
		unit.healthbar.bar.setActive(true).setVisible(true);
		unit.healthbar.move(x, y);
	}

	static activateDangerousCircle(circle, x, y) {
		this.genericActivate(circle, x, y);
		circle.weapon.enableBody(true, x, y, true, true);
	}

	static destroyDangerousCircle(circle) {
		this.genericDestroy(circle);
		circle.weapon.disableBody(true, true);
	}
}
