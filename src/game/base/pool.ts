export function addToInactivePool(unit) {
	unit.scene.events.emit("inactive-" + unit.id, unit.id);
}

export function disableForPool(...objs) {
	objs.forEach(obj => {
		if (obj.disableBody) {
			obj.disableBody(true, true);
			obj.setPosition(-1000, -1000);
		} else {
			obj.setActive(false).setVisible(false);
		}
	});
}

export function activateForPool(x, y, ...objs) {
	objs.forEach(obj => {
		if (obj.enableBody) {
			obj.enableBody(true, x, y, true, true);
		} else {
			obj.setActive(true).setVisible(true);
		}
	});
}
