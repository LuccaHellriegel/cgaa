import { Gameplay } from "../../scenes/Gameplay";
import { Cooperation } from "../state/Cooperation";
import { CampID } from "../setup/CampSetup";
import { addCombinatorialCollider } from "./combinatorial";
import { physicsGroups } from "./groups";

export function addBounceCollision(scene: Gameplay, physicsGroups: physicsGroups, cooperation: Cooperation) {
	addCombinatorialCollider(
		scene,
		createBounceCombinatorialArr(physicsGroups),
		(unit, obj) => {
			bounceCallback(unit, obj, cooperation);
		},
		null
	);
}

function createBounceCombinatorialArr(physicsGroups) {
	let result = [];
	result.push([
		[...Object.values(physicsGroups.enemies)],
		[physicsGroups.player, physicsGroups.shooters, physicsGroups.healers, ...Object.values(physicsGroups.buildings)],
	]);
	result.push(
		...Object.keys(physicsGroups.enemies).map((campID) => {
			return [
				[physicsGroups.enemies[campID]],
				Object.keys(physicsGroups.enemies)
					.filter((secondCampID) => secondCampID !== campID)
					.map((secondCampID) => physicsGroups.enemies[secondCampID]),
			];
		})
	);
	return result;
}

function bounceCallback(unit, obj, cooperation: Cooperation) {
	if (unit.campID === obj.campID) {
		unit.stateHandler.moveBack();
	} else {
		let cooperationSet = cooperation.dict[unit.campID] as Set<CampID>;
		if (!cooperationSet.has(obj.campID)) {
			unit.stateHandler.obstacle = obj;
		}
	}
}
