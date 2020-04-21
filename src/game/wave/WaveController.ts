import { Gameplay } from "../../scenes/Gameplay";
import { WaveOrder } from "./WaveOrder";
import { WaveSetup } from "../setup/WaveSetup";
import { EventSetup } from "../setup/EventSetup";
import { CampID } from "../setup/CampSetup";

export class WaveController {
	private activeCampColor: CampID | boolean;

	constructor(private scene: Gameplay, private order: WaveOrder) {
		this.activeCampColor = order.order[0];
		this.spawnWave();
	}

	private spawnWave() {
		EventSetup.endWave(this.scene, this.activeCampColor as CampID);

		this.activeCampColor = this.order.getNextCampID();
		if (this.activeCampColor !== false) {
			EventSetup.startWave(this.scene, this.activeCampColor as CampID);
			this.order.increment();
			this.scene.time.addEvent({
				delay: WaveSetup.timeBetweenWaves,
				callback: () => {
					this.spawnWave();
				},
				repeat: 0,
			});
		}
	}
}
