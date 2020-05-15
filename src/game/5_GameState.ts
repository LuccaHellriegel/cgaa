import { CampSetup } from "./0_GameBase/setup/CampSetup";
import { Rivalries } from "./5_GameState/state/Rivalries";
import { Cooperation } from "./0_GameBase/engine/Cooperation";
import { EventSetup } from "./0_GameBase/setup/EventSetup";
import { CampRouting } from "./5_GameState/state/CampRouting";
import { PathConfig } from "./5_GameState/path/PathConfig";
import { Paths } from "./5_GameState/path/Paths";
import { PathFactory } from "./5_GameState/path/PathFactory";
import { PathCalculator } from "./5_GameState/path/PathCalculator";
import { PathAssigner } from "./5_GameState/path/PathAssigner";
import { Quests } from "./0_GameBase/engine/quest/Quests";
import { Data } from "./3_GameData";
import { RelPos } from "./0_GameBase/engine/RelPos";

export interface State extends Data {
	cooperation: Cooperation;
	rivalries: Rivalries;
	router: CampRouting;
	quests: Quests;
	pathAssigner: PathAssigner;
}

export function GameState(scene, gameData: Data, commonWaypoint: (gameData: Data) => RelPos): State {
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
