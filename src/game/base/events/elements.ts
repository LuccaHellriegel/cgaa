export function addEle(scene, name, ele) {
	scene.events.emit("added-" + name, ele);
}

export function removeEle(scene, name, ele) {
	scene.events.emit("removed-" + name, ele);
}

export function addInteractionEle(scene: Phaser.Scene, ele) {
	scene.events.emit("interaction-ele-added", ele);
}

export function removeInteractionEle(scene: Phaser.Scene, ele) {
	scene.events.emit("interaction-ele-removed", ele);
}
