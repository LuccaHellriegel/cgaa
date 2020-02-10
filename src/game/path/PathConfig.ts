import { Orientation } from "./Orientation";
import { RelPos } from "../base/RelPos";
import { Camp } from "../camp/Camp";
import { CampSetup } from "../setup/CampSetup";
import { CampExits } from "../camp/CampExits";

export interface MultiPosPath {
	start: RelPos;
	waypoints: RelPos[];
	goal: RelPos;
}

export class PathConfig {
	private constructor() {}
	static createConfigs(orientation: Orientation, exits: CampExits, camps: Camp[]): MultiPosPath[] {
		let configs = [];

		camps.forEach(camp => {
			let waypoints = [exits.getExitFor(camp.id), orientation.middleOfGameMap];
			camp.buildingSetup.spawnPos.forEach(start => {
				configs.push({
					start,
					waypoints,
					goal: orientation.middleOfPlayerArea
				});
				configs.push({
					start,
					waypoints,
					goal: orientation.middleOfBossArea
				});

				//Reroute paths
				CampSetup.ordinaryCampIDs.forEach(id => {
					if (id !== camp.id) {
						configs.push({
							start,
							waypoints,
							goal: orientation.getPosFor(id)
						});
					}
				});
			});
		});
		return configs;
	}
}
