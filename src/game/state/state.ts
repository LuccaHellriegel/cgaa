import { initRivalries } from "./rivalries";
import { CampRouting } from "../camp/CampRouting";
import { Quests } from "./Quests";
import { Cooperation } from "./Cooperation";

export function initStartState(scene: Phaser.Scene) {
	let rivalries = initRivalries();
	let router = new CampRouting(scene.events, rivalries);
	let quests = new Quests();
	let cooperation = new Cooperation(scene);

	return { rivalries, router, quests, cooperation };
}
