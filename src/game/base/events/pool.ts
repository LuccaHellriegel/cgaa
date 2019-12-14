export function addToInactivePool(scene, unit) {
	scene.events.emit("inactive-" + unit.id, unit.id);
}
