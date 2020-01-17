import { Gameplay } from "../../../scenes/Gameplay";
import { CampsState } from "../camp/CampsState";

export class WaveController {
	private activeCampColor: string = "";

	constructor(private scene: Gameplay, private campsState: CampsState) {
		this.spawnWave();
	}

	private spawnWave() {
		this.scene.events.emit("end-wave-" + this.activeCampColor);

		this.activeCampColor = this.campsState.getNextActiveCampColor();
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
