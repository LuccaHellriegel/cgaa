import { CampSetup } from "../config/CampSetup";
import { EventSetup } from "../config/EventSetup";
import { Data } from "../data/data";
import { BitwiseCooperation } from "../engine/BitwiseCooperation";
import { Quests } from "../quests/Quests";
import { RelPos } from "../engine/RelPos";
import { PathAssigner } from "../path/PathAssigner";
import { createConfigs } from "../path/configuration";
import { producePaths } from "../path/calculation";
import { CampRouting } from "./CampRouting";
import { createRivalsMap, Rivalries } from "./Rivalries";
import EasyStar from "easystarjs";
import { GameMap } from "../types";
import { EnvSetup } from "../config/EnvSetup";

export interface State extends Data {
  cooperation: BitwiseCooperation;
  rivalries: Rivalries;
  router: CampRouting;
  quests: Quests;
  pathAssigner: PathAssigner;
}

function configureEasyStar(easyStar: EasyStar.js, map: GameMap) {
  easyStar.setGrid(map);
  easyStar.setAcceptableTiles([EnvSetup.walkableSymbol, EnvSetup.exitSymbol]);
}

export function state(
  scene,
  gameData: Data,
  commonWaypoint: (gameData: Data) => RelPos
): State {
  const cooperation = new BitwiseCooperation(CampSetup.campIDs, (id) => {
    scene.events.emit(EventSetup.cooperationEvent, id);
  });

  const rivalries = createRivalsMap(CampSetup.ordinaryCampIDs);
  const router = new CampRouting(scene.events, rivalries);

  const quests = new Quests();

  const configs = createConfigs(commonWaypoint(gameData), gameData.camps);

  const easyStar = new EasyStar.js();
  configureEasyStar(easyStar, gameData.gameMap);

  const pathAssigner = new PathAssigner(
    gameData.camps,
    producePaths(easyStar, configs),
    router
  );

  console.log(cooperation, rivalries, router, quests, pathAssigner);
  return { ...gameData, cooperation, rivalries, router, quests, pathAssigner };
}
