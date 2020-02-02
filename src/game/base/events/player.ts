export function gainSouls(scene: Phaser.Scene, type) {
	//TODO: gain dependent on size and type
	//TODO: make general type?
	scene.events.emit("souls-gained", 100);
}

export function spendSouls(scene: Phaser.Scene, amount) {
	scene.events.emit("souls-spent", amount);
}
