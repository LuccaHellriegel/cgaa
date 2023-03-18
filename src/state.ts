import { CampSetup } from "./config/CampSetup";
import { EventSetup } from "./config/EventSetup";
import { Data } from "./data/data";
import { BitwiseCooperation } from "./engine/BitwiseCooperation";
import { RelPos } from "./engine/RelPos";
import { PathAssigner } from "./path/PathAssigner";
import { createConfigs } from "./path/configuration";
import { producePaths } from "./path/calculation";
import EasyStar from "easystarjs";
import { GameMap } from "./types";
import { EnvSetup } from "./config/EnvSetup";
import { CampManager } from "./camps/CampManager";

export interface State extends Data {
  cooperation: BitwiseCooperation;
  pathAssigner: PathAssigner;
  manager: CampManager;
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

  const manager = new CampManager(scene);
  const configs = createConfigs(commonWaypoint(gameData), gameData.camps);

  const easyStar = new EasyStar.js();
  configureEasyStar(easyStar, gameData.gameMap);

  const pathAssigner = new PathAssigner(
    gameData.camps,
    producePaths(easyStar, configs),
    manager
  );

  console.log(cooperation, manager, pathAssigner);
  return {
    ...gameData,
    cooperation,
    pathAssigner,
    manager: manager,
  };
}
