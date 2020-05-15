import { CampSetup } from "../../0_GameBase/setup/CampSetup";
import { CampMap } from "../../3_GameData";
import { RelPos } from "../../0_GameBase/engine/RelPos";
import { arrayMiddle } from "../../0_GameBase/engine/array";

export interface MultiPosPath {
	start: RelPos;
	waypoints: RelPos[];
	goal: RelPos;
}

export class PathConfig {
	private constructor() {}
	static createConfigs(commonWaypoint: RelPos, campMap: CampMap): MultiPosPath[] {
		let configs = [];
		const camps = campMap.values();

		for (const camp of camps) {
			//TODO: multiple exits, now we just take middle of first
			const waypoints = [arrayMiddle(camp.exitPositionsInMap[0].positionsInMap), commonWaypoint];
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
}
