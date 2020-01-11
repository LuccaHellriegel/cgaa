import { Gameplay } from "../../scenes/Gameplay";

export function spawnWave(scene: Gameplay) {
	let allCampsDestroyed = scene.activeCamps.length === 0;

	let prevColor = scene.activeCamps.pop();
	scene.activeCamps.unshift(prevColor);
	scene.events.emit("end-wave-" + prevColor);

	if (!allCampsDestroyed) {
		let curColor = scene.activeCamps[scene.activeCamps.length - 1];
		scene.events.emit("start-wave-" + curColor);

		scene.time.addEvent({
			delay: 15000,
			callback: () => {
				spawnWave(scene);
			},
			repeat: 0
		});
	}
}
