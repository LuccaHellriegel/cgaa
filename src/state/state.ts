import { CampSetup } from "../config/CampSetup";
import { EventSetup } from "../config/EventSetup";
import { Data } from "../data/data";
import { Cooperation } from "../engine/Cooperation";
import { Quests } from "../engine/quest/Quests";
import { RelPos } from "../engine/RelPos";
import { PathAssigner } from "../path/PathAssigner";
import { PathCalculator } from "../path/PathCalculator";
import { PathConfig } from "../path/PathConfig";
import { PathFactory } from "../path/PathFactory";
import { Paths } from "../path/Paths";
import { CampRouting } from "./CampRouting";
import { Rivalries } from "./Rivalries";

export interface State extends Data {
	cooperation: Cooperation;
	rivalries: Rivalries;
	router: CampRouting;
	quests: Quests;
	pathAssigner: PathAssigner;
}

export function state(scene, gameData: Data, commonWaypoint: (gameData: Data) => RelPos): State {
	const cooperation = new Cooperation((id) => {
		scene.events.emit(EventSetup.cooperationEvent, id);
	});
	cooperation.init(CampSetup.campIDs);

	const rivalries = new Rivalries(CampSetup.ordinaryCampIDs);
	const router = new CampRouting(scene.events, rivalries);

	const quests = new Quests();

	const configs = PathConfig.createConfigs(commonWaypoint(gameData), gameData.camps);
	const paths = new Paths(gameData.camps, PathFactory.produce(new PathCalculator(gameData.gameMap), configs));
	const pathAssigner = new PathAssigner(paths, router);

	console.log(cooperation, rivalries, router, quests, pathAssigner);
	return { ...gameData, cooperation, rivalries, router, quests, pathAssigner };
}
