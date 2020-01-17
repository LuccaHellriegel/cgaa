import { Gameplay } from "../../../scenes/Gameplay";

export function spawnWave(scene: Gameplay) {
	let allCampsDestroyed = scene.cgaa.activeCamps.length === 0;

	let prevColor = scene.cgaa.activeCamps.pop();
	scene.cgaa.activeCamps.unshift(prevColor);
	scene.events.emit("end-wave-" + prevColor);

	if (!allCampsDestroyed) {
		let curColor = scene.cgaa.activeCamps[scene.cgaa.activeCamps.length - 1];
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
