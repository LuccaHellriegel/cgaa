import { PhysicsGroups, addCombinatorialCollider } from "./Collision";
import { Gameplay } from "../../scenes/Gameplay";

export function addBasicCollision(scene: Gameplay, physicsGroups: PhysicsGroups) {
	addCombinatorialCollider(scene, createBasicCollisionCombArr(physicsGroups), null, null);
}

function createBasicCollisionCombArr(physicsGroups: PhysicsGroups) {
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

function getEnemyGroups(physicsGroups: PhysicsGroups) {
	return [...Object.values(physicsGroups.buildings), ...Object.values(physicsGroups.enemies)];
}
