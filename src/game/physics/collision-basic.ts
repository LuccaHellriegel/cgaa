import { addCombinatorialCollider } from "./combinatorial";
import { physicsGroups } from "./groups";
import { Gameplay } from "../../scenes/Gameplay";

export function addBasicCollision(scene: Gameplay, physicsGroups: physicsGroups) {
	addCombinatorialCollider(scene, createBasicCollisionCombArr(physicsGroups), null, null);
}

function createBasicCollisionCombArr(physicsGroups: physicsGroups) {
	// all units should collide with each other, buildings and walls
	let result = [];

	let unitsVsWalls = [[...Object.values(physicsGroups.enemies), physicsGroups.player], [physicsGroups.areas]];
	result.push(unitsVsWalls);

	let playerUnitsVsUnitsAndTowers = [
		[physicsGroups.player],
		[...getEnemyGroups(physicsGroups), physicsGroups.shooters, physicsGroups.healers],
	];
	result.push(playerUnitsVsUnitsAndTowers);

	return result;
}

function getEnemyGroups(physicsGroups: physicsGroups) {
	return [...Object.values(physicsGroups.buildings), ...Object.values(physicsGroups.enemies)];
}
