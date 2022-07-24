import { equal2DPositions } from "../engine/navigation";
import { RelPos } from "../engine/RelPos";
import { BuildingPosition, Camp, CGAAData, GameMap, WallSide } from "../types";
import {
  randomBuildingPositions,
  addBuildingPositionsToGameMap,
} from "./data-building";
import {
  areaLayoutToMap,
  areaLayoutToWallSides,
  exitLayoutToExits,
  mapSpawnablePos,
  randomMapCampIDsToAreas,
  mapAreaTopLeftToMapMiddle,
  layoutAreaToMapTopLeft,
} from "./data-layout";
import { splitUpWallSidesAtExits, addWallSidesToGameMap } from "./data-wall";

type Exit = {
  areaInLayout: RelPos;
  positionsInMap: RelPos[];
};

export type CampArea = {
  id: string;
  campMask: number;
  areaInLayout: RelPos;
};

function mapExitsToCamps(exits: Exit[], campAreas: CampArea[]) {
  const result: {
    id: string;
    campMask: number;
    areaInLayout: RelPos;
    exitPositionsInMap: { positionsInMap: RelPos[] }[];
  }[] = [];

  for (const campArea of campAreas) {
    // multiple exits are possible, so need to add all
    const temp = { ...campArea, exitPositionsInMap: [] };
    for (const exit of exits) {
      if (equal2DPositions(exit.areaInLayout, campArea.areaInLayout)) {
        temp.exitPositionsInMap.push({ positionsInMap: exit.positionsInMap });
      }
    }
    result.push(temp);
  }

  return result;
}

function mapBuildingPositionsToCamps(
  buildingPositions: BuildingPosition[],
  campObjs: {
    id: string;
    campMask: number;
    areaInLayout: RelPos;
    exitPositionsInMap: { positionsInMap: RelPos[] }[];
  }[]
) {
  const result = [];

  for (const campObj of campObjs) {
    // multiple buildings are possible, so need to add all
    const temp = { ...campObj, buildingPositionsInMap: [] };
    for (const pos of buildingPositions) {
      if (equal2DPositions(pos.areaInLayout, campObj.areaInLayout)) {
        temp.buildingPositionsInMap.push({
          positionInMap: pos.positionInMap,
          spawnPos: pos.spawnPos,
        });
      }
    }
    result.push(temp);
  }

  return result;
}

function middle(arr: any[][]) {
  return new RelPos(Math.floor(arr.length / 2), Math.floor(arr[0].length / 2));
}

export type CampMap = Map<string, Camp>;

export interface Data extends CGAAData {
  gameMap: GameMap;
  gameMapMiddle: RelPos;
  camps: CampMap;
  wallSides: WallSide[];
  exits: Exit[];
}

export function GameData(config: CGAAData): Data {
  const gameMap = areaLayoutToMap(
    config.areaLayout,
    config.areaSize,
    config.mapDefaultSymbol
  );

  const wallSides: WallSide[] = areaLayoutToWallSides(
    config.areaLayout,
    config.areaSize
  );
  const exits: Exit[] = exitLayoutToExits(config.exitLayout, config.areaSize);
  const splitUpWallSides: WallSide[] = splitUpWallSidesAtExits(
    wallSides,
    exits
  );
  addWallSidesToGameMap(gameMap, splitUpWallSides, config.mapWallSymbol);

  const buildingPositions: BuildingPosition[] = randomBuildingPositions(
    config.areaLayout,
    config.areaSymbol,
    config.areaSize,
    config.buildingsPerCamp,
    mapSpawnablePos(gameMap, config.mapDefaultSymbol, exits),
    gameMap,
    config.mapDefaultSymbol,
    config.mapBuildingSymbol
  );
  addBuildingPositionsToGameMap(
    gameMap,
    buildingPositions,
    config.mapBuildingSymbol
  );

  const campAreas: CampArea[] = randomMapCampIDsToAreas(
    config.campIDs,
    config.areaLayout,
    config.areaSymbol
  );
  const enrichCampData = (campData) => {
    return {
      ...campData,
      areaSize: config.areaSize,
      areaMapMiddle: mapAreaTopLeftToMapMiddle(
        layoutAreaToMapTopLeft(campData.areaInLayout, config.areaSize),
        config.areaSize
      ),
    };
  };
  const campArr: Camp[] = mapBuildingPositionsToCamps(
    buildingPositions,
    mapExitsToCamps(exits, campAreas)
  ).map(enrichCampData);
  const camps = new Map();
  for (const camp of campArr) {
    camps.set(camp.id, camp);
  }

  console.log(gameMap, middle(gameMap), camps, splitUpWallSides);
  return {
    ...config,
    gameMap,
    gameMapMiddle: middle(gameMap),
    camps,
    wallSides: splitUpWallSides,
    exits,
  };
}
