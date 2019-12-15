export function addToInteractionElements(scene: Phaser.Scene, ele) {
	scene.events.emit("interaction-ele-added", ele);
}

export function removeFromInteractionElements(scene: Phaser.Scene, ele) {
	scene.events.emit("interaction-ele-removed", ele);
}
