export function gainSouls(scene: Phaser.Scene, amount) {
	scene.events.emit("souls-gained", amount);
}

export function spendSouls(scene: Phaser.Scene, amount) {
	scene.events.emit("souls-spent", amount);
}

export function addInteractionEle(scene: Phaser.Scene, ele) {
	scene.events.emit("interaction-ele-added", ele);
}

export function removeInteractionEle(scene: Phaser.Scene, ele) {
	scene.events.emit("interaction-ele-removed", ele);
}

export function establishCooperation(scene: Phaser.Scene, campColor, cooperationColor) {
	scene.events.emit("cooperation-established", campColor, cooperationColor);
}
