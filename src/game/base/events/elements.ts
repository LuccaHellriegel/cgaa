export function addEle(scene, name, ele) {
	scene.events.emit("added-" + name, ele);
}

export function removeEle(scene, name, ele) {
	scene.events.emit("removed-" + name, ele);
}

export function addToInteractionElements(scene: Phaser.Scene, ele) {
	scene.events.emit("interaction-ele-added", ele);
}

export function removeFromInteractionElements(scene: Phaser.Scene, ele) {
	scene.events.emit("interaction-ele-removed", ele);
}
