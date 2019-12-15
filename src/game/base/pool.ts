function addToInactivePool(unit) {
	unit.scene.events.emit("inactive-" + unit.id, unit.id);
}

export function disableForPool(...objs) {
	objs.forEach(obj => {
		if (obj.disableBody) {
			obj.disableBody(true, true);
		} else {
			obj.setActive(false).setVisible(false);
		}
		obj.setPosition(-1000, -1000);
	});
}

export function destroyPoolUnit(unit) {
	disableForPool(unit);
	addToInactivePool(unit);
}
