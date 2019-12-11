export function gainSouls(scene: Phaser.Scene, amount) {
	scene.events.emit("souls-gained", amount);
}

export function spendSouls(scene: Phaser.Scene, amount) {
	scene.events.emit("souls-spent", amount);
}

export function gainLife(scene: Phaser.Scene, amount) {
	scene.events.emit("life-gained", amount);
}

export function establishCooperation(scene: Phaser.Scene, campColor, cooperationColor) {
	scene.events.emit("cooperation-established", campColor, cooperationColor);
}
