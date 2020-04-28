import { randomizeArr } from "../base/random";
import { CampSetup } from "../setup/CampSetup";

export type Rivalries = {
	getRival(campID);
};

export function initRivalries(): Rivalries {
	const rivalries = {};

	const campIDs = randomizeArr(CampSetup.ordinaryCampIDs);

	// only works for four camps
	let campID = campIDs.pop();
	let secondCampID = campIDs.pop();
	rivalries[campID] = secondCampID;
	rivalries[secondCampID] = campID;

	campID = campIDs.pop();
	secondCampID = campIDs.pop();
	rivalries[campID] = secondCampID;
	rivalries[secondCampID] = campID;

	return {
		getRival: function (campID) {
			return rivalries[campID];
		},
	};
}
