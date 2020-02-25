export class PoolHelper {
	private constructor() {}

	static genericDestroy(unit) {
		unit.scene.events.emit("inactive-" + unit.id, unit.id);
		unit.disableBody(true, true);
		unit.setPosition(-1000, -1000);
		unit.healthbar.bar.setActive(false).setVisible(false);
		unit.healthbar.value = unit.healthbar.defaultValue;
	}

	static genericActivate(unit, x, y) {
		unit.enableBody(true, x, y, true, true);
		unit.healthbar.bar.setActive(true).setVisible(true);
		unit.healthbar.move(x, y);
	}
}
