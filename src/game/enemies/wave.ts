import { Gameplay } from "../../scenes/Gameplay";
import { campColors } from "../base/globals/globalColors";
import { executeOverAllCamps } from "../base/globals/global";

export function spawnWave(scene: Gameplay, index) {
	let destroyedCamps = [];
	executeOverAllCamps(color => {
		scene.events.on("destroyed-" + color, () => {
			destroyedCamps.push(color);
		});
	});

	let prevIndex = index - 1;
	if (index === 0) prevIndex = campColors.length;
	scene.events.emit("end-wave-" + campColors[prevIndex]);

	let curColor = campColors[index];
	if (!destroyedCamps.includes(curColor)) scene.events.emit("start-wave-" + curColor);

	index++;
	if (index === campColors.length) index = 0;
	scene.time.addEvent({
		delay: 15000,
		callback: () => {
			spawnWave(scene, index);
		},
		callbackScope: this,
		repeat: 0
	});
}
