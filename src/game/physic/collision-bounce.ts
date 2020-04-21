import { Gameplay } from "../../scenes/Gameplay";
import { Cooperation } from "../state/Cooperation";
import { CampID } from "../setup/CampSetup";
import { addCombinatorialCollider } from "./Collision";

export function addBounceCollision(scene: Gameplay, combinatorialArr, cooperation: Cooperation) {}

function getBounceCombinatorialArr() {
	let result = [];
	result.push([
		[...Object.values(this.physicsGroups.enemies)],
		[
			this.physicsGroups.player,
			this.physicsGroups.shooters,
			this.physicsGroups.healers,
			...Object.values(this.physicsGroups.buildings),
		],
	]);
	result.push(
		...Object.keys(this.physicsGroups.enemies).map((campID) => {
			return [
				[this.physicsGroups.enemies[campID]],
				Object.keys(this.physicsGroups.enemies)
					.filter((secondCampID) => secondCampID !== campID)
					.map((secondCampID) => this.physicsGroups.enemies[secondCampID]),
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

export class BounceCollision {
	constructor(scene: Gameplay, combinatorialArr, cooperation: Cooperation) {
		addCombinatorialCollider(
			scene,
			combinatorialArr,
			(unit, obj) => {
				bounceCallback(unit, obj, cooperation);
			},
			null
		);
		//this.bounceCallback.bind(this), null);
	}

	// private bounceCallback(unit, obj, cooperation: Cooperation) {
	// 	if (unit.campID === obj.campID) {
	// 		unit.stateHandler.moveBack();
	// 	} else {
	// 		let cooperationSet = this.cooperation.dict[unit.campID] as Set<CampID>;
	// 		if (!cooperationSet.has(obj.campID)) {
	// 			unit.stateHandler.obstacle = obj;
	// 		}
	// 	}
	// }
}
