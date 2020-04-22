import { Gameplay } from "../../scenes/Gameplay";
import { DangerousCircle } from "../unit/DangerousCircle";
import { Shooter } from "../tower/shooter/Shooter";
import { Cooperation } from "../state/Cooperation";
import { ChainWeapon } from "../weapon/chain/weapon";
import { addCombinatorialOverlap } from "./combinatorial";
import { physicsGroups } from "./groups";

export function addSightOverlap(scene: Gameplay, physicsGroups: physicsGroups, cooperation: Cooperation) {
	addCombinatorialOverlap(
		scene,
		createSightArray(physicsGroups),
		(unit, obj) => {
			isInSight(unit, obj, cooperation);
		},
		null
	);
}

function createSightArray(physicsGroups: physicsGroups) {
	let result = [];
	result.push(
		...Object.keys(physicsGroups.sights).map((campID) => {
			return [
				[physicsGroups.sights[campID]],
				Object.keys(physicsGroups.sights)
					.filter((secondCampID) => secondCampID !== campID)
					.map((secondCampID) => physicsGroups.sights[secondCampID]),
			];
		})
	);
	return result;
}

function isInSight(chainWeapon: ChainWeapon, enemy, cooperation) {
	let isNotInCooperation = !cooperation.hasCooperation((chainWeapon.owner as DangerousCircle).campID, enemy.campID);

	if (isNotInCooperation) {
		if (enemy instanceof Shooter) {
			enemy.fire(chainWeapon.owner);
		} else {
			(chainWeapon.owner as DangerousCircle).stateHandler.spotted = enemy;
		}

		return false;
	}
}
