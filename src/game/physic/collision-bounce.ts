import { Gameplay } from "../../scenes/Gameplay";
import { Cooperation } from "../state/Cooperation";
import { CampID } from "../setup/CampSetup";
import { addCombinatorialCollider } from "./Collision";

export function addBounceCollision(scene: Gameplay, combinatorialArr, cooperation: Cooperation) {}

function getBounceCombinatorialArr() {
	let result = [];
	result.push([
		[...Object.values(this.PhysicsGroups.enemies)],
		[
			this.PhysicsGroups.player,
			this.PhysicsGroups.shooters,
			this.PhysicsGroups.healers,
			...Object.values(this.PhysicsGroups.buildings),
		],
	]);
	result.push(
		...Object.keys(this.PhysicsGroups.enemies).map((campID) => {
			return [
				[this.PhysicsGroups.enemies[campID]],
				Object.keys(this.PhysicsGroups.enemies)
					.filter((secondCampID) => secondCampID !== campID)
					.map((secondCampID) => this.PhysicsGroups.enemies[secondCampID]),
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
