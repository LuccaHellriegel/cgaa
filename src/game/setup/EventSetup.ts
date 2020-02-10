import { CampID } from "./CampSetup";

export class EventSetup {
	//TODO: make actual object with scene
	private constructor() {}

	static partialReroutingEvent = "reroute-";

	static gainSouls(scene: Phaser.Scene, type) {
		//TODO: gain dependent on size and type
		//TODO: make general type?
		scene.events.emit("souls-gained", 100);
	}

	static spendSouls(scene: Phaser.Scene, amount) {
		scene.events.emit("souls-spent", amount);
	}

	static interactionCircleDestroyEvent = "interactionCircle-destroyed";

	static destroyInteractionCircle(scene: Phaser.Scene, campID: CampID) {
		scene.events.emit(this.interactionCircleDestroyEvent, campID);
	}

	static buildingDestroyEvent = "building-destroyed";

	static destroyBuilding(scene: Phaser.Scene, campID: CampID, buildingID: string) {
		scene.events.emit(this.buildingDestroyEvent, { campID, buildingID });
	}

	static campDestroyEvent = "camp-destroyed";

	static destroyCamp(scene: Phaser.Scene, campID: CampID) {
		scene.events.emit(this.campDestroyEvent, campID);
	}

	static cooperationEvent = "cooperation-initialized";

	static cooperate(scene: Phaser.Scene, campID: CampID) {
		scene.events.emit(this.cooperationEvent, campID);
	}

	static conqueredEvent = "camps-conquered";

	static campsConquered(scene: Phaser.Scene) {
		scene.events.emit(this.conqueredEvent);
	}

	static startWaveEvent = "start-wave";

	static startWave(scene: Phaser.Scene, campID: CampID) {
		scene.events.emit(this.startWaveEvent, campID);
	}

	static endWaveEvent = "end-wave";

	static endWave(scene: Phaser.Scene, campID: CampID) {
		scene.events.emit(this.endWaveEvent, campID);
	}

	static questAccecptedEvent = "quest-accepted";
}
