import { CircleFactory } from "../units/CircleFactory";
import { Enemies } from "../units/Enemies";
import { InteractionCircle } from "../units/InteractionCircle";
import { Gameplay } from "../scenes/Gameplay";
import { Building } from "./Building";
import { CampMap } from "../data/data";
import {
  layoutAreaToMapTopLeft,
  filterRelPosInsideArea,
} from "../data/data-layout";
import { arrayMiddle } from "../engine/array";
import { RealDict } from "../engine/RealDict";
import { Camp } from "../types";
import { CampPopulator } from "./CampPopulator";
import { CampsState } from "./CampsState";
import { CampID, CampSetup } from "../config/CampSetup";
import { EnvSetup } from "../config/EnvSetup";
import { UnitSetup } from "../config/UnitSetup";
import { RelPos } from "../engine/RelPos";
import { Physics } from "../physics/physics";
import { Pools } from "../pool/pools";
import { EnemySpawnObj } from "../spawn/EnemySpawnObj";
import { FinalState } from "../start";

function createBuildings(
  camp: Camp,
  scene: Gameplay,
  addBuildingToPhysics: (building: Building) => void,
  spawnUnits: string[]
) {
  const result: Building[] = [];
  const spawnUnitStrings = [...spawnUnits];

  for (const buildingPos of camp.buildingPositionsInMap) {
    let point = buildingPos.positionInMap.toPoint();
    const building = new Building(
      scene,
      point.x,
      point.y,
      addBuildingToPhysics,
      spawnUnitStrings.pop(),
      camp.id as CampID,
      camp.campMask
    );

    result.push(building);
  }
  return result;
}

function createDiplomats(camp: Camp, factory: CircleFactory) {
  const result: InteractionCircle[] = [];
  for (const exitPosition of camp.exitPositionsInMap) {
    let circleConfig = {
      ...arrayMiddle(exitPosition.positionsInMap).toPoint(),
      size: "Big",
      weaponType: "chain",
    };
    const diplomat = factory.createInteractionCircle(circleConfig);
    result.push(diplomat);
  }
  return result;
}

export function campsStaticUnits(
  scene,
  campMap: CampMap,
  physics: Physics,
  enemies: Enemies,
  weaponPools
) {
  const camps = campMap.values();
  const result = [];
  for (const camp of camps) {
    if (CampSetup.ordinaryCampIDs.includes(camp.id as CampID)) {
      const buildings = createBuildings(camp, scene, physics.addBuilding, [
        ...UnitSetup.circleSizeNames,
      ]);
      const diplomats = createDiplomats(
        camp,
        new CircleFactory(
          scene,
          camp.id as CampID,
          camp.campMask,
          physics.addUnit,
          enemies,
          weaponPools[camp.id]
        )
      );
      result.push({ buildings, diplomats });
    }
  }
  return result;
}

function relPosToDictInput(pos: RelPos[]) {
  return pos.map((pos) => [pos.toPoint(), EnvSetup.walkableSymbol]);
}

export function areaRealSpawnDict(
  layoutArea: RelPos,
  areaSize,
  mapSpawnPos: RelPos[]
) {
  const areaMapTopLeft = layoutAreaToMapTopLeft(layoutArea, areaSize);
  const areaSpawnPos = filterRelPosInsideArea(
    areaMapTopLeft,
    areaSize,
    mapSpawnPos
  );
  return new RealDict(relPosToDictInput(areaSpawnPos));
}

function populateCamp(
  scene,
  camp: Camp,
  campsState: CampsState,
  enemies: Enemies,
  circleFactory: CircleFactory,
  mapSpawnPos: RelPos[]
) {
  const spawnDict = areaRealSpawnDict(
    camp.areaInLayout,
    camp.areaSize,
    mapSpawnPos
  );
  new CampPopulator(
    camp.id as CampID,
    scene,
    () => circleFactory.createEnemy("Big"),
    new EnemySpawnObj(spawnDict, enemies),
    UnitSetup.maxCampPopulation,
    campsState
  );
}

export function populateCamps(
  scene,
  campMap: CampMap,
  enemies: Enemies,
  campsState: CampsState,
  mapSpawnPos: RelPos[],
  state: FinalState,
  pools: Pools
) {
  const camps = campMap.values();

  for (const camp of camps) {
    if (CampSetup.ordinaryCampIDs.includes(camp.id as CampID))
      populateCamp(
        scene,
        camp,
        campsState,
        enemies,
        new CircleFactory(
          scene,
          camp.id,
          camp.campMask,
          state.physics.addUnit,
          enemies,
          pools.weapons[camp.id]
        ),
        mapSpawnPos
      );
  }
}
