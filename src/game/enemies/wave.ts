import { Gameplay } from "../../scenes/Gameplay";
import { campColors } from "../base/globals/globalColors";

export function spawnWave(scene: Gameplay, index) {
	scene.events.emit("start-wave-" + campColors[index]);
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
