export function gainSouls(scene: Phaser.Scene, amount) {
	scene.events.emit("souls-gained", amount);
}

export function spendSouls(scene: Phaser.Scene, amount) {
	scene.events.emit("souls-spent", amount);
}
