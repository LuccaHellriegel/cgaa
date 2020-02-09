import { Orientation } from "./Orientation";
import { RelPos } from "../base/RelPos";
import { Camp } from "../camp/Camp";

export interface MultiPosPath {
	start: RelPos;
	waypoints: RelPos[];
	goal: RelPos;
}

export class PathConfig {
	private constructor() {}
	static createConfigs(orientation: Orientation, camps: Camp[]): MultiPosPath[] {
		let configs = [];

		camps.forEach(camp => {
			let waypoints = [orientation.getPosFor(camp.id), orientation.middleOfGameMap];
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
			});
		});
		return configs;
	}
}
