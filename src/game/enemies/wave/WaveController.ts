import { Gameplay } from "../../../scenes/Gameplay";
import { Camps } from "../camp/Camps";

export class WaveController {
	private activeCampColor: string = "";

	constructor(private scene: Gameplay, private camps: Camps) {
		this.spawnWave();
	}

	private spawnWave() {
		this.scene.events.emit("end-wave-" + this.activeCampColor);

		this.activeCampColor = this.camps.getNextActiveCampColor();
		if (this.activeCampColor) {
			this.scene.events.emit("start-wave-" + this.activeCampColor);

			this.scene.time.addEvent({
				delay: 15000,
				callback: () => {
					this.spawnWave();
				},
				repeat: 0
			});
		}
	}
}
