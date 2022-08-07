import { CampSetup } from "../config/CampSetup";
import { CampMap } from "../data/data";
import { arrayMiddle } from "../engine/array";
import { RelPos } from "../engine/RelPos";

export interface MultiPosPath {
  start: RelPos;
  waypoints: RelPos[];
  goal: RelPos;
}

export function createConfigs(
  commonWaypoint: RelPos,
  campMap: CampMap
): MultiPosPath[] {
  let configs = [];
  const camps = campMap.values();

  for (const camp of camps) {
    //TODO: multiple exits, now we just take middle of first
    const waypoints = [
      arrayMiddle(camp.exitPositionsInMap[0].positionsInMap),
      commonWaypoint,
    ];
    for (const buildingPos of camp.buildingPositionsInMap) {
      buildingPos.spawnPos.forEach((start) => {
        configs.push({
          start,
          waypoints,
          goal: campMap.get(CampSetup.playerCampID).areaMapMiddle,
        });
        configs.push({
          start,
          waypoints,
          goal: campMap.get(CampSetup.bossCampID).areaMapMiddle,
        });

        //Reroute paths
        CampSetup.ordinaryCampIDs.forEach((id) => {
          if (id !== camp.id) {
            configs.push({
              start,
              waypoints,
              goal: campMap.get(id).areaMapMiddle,
            });
          }
        });
      });
    }
  }

  return configs;
}
