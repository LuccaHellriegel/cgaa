import { towerHalfSize } from "../../globals/globalSizes";

export function findClosestTower(towers, x, y) {
	let dist = Infinity;
	let closestTower;
	towers.forEach(tower => {
		let newDist = Math.hypot(tower.x - x, tower.y - y);
		if (dist > newDist) {
			dist = newDist;
			closestTower = tower;
		}
	});
	if (!closestTower) dist = Infinity;
	return { closestTower, dist };
}

export function newTowerIsInRowOfCross(closestTower, x, y) {
	return Math.abs(y - closestTower.y) < towerHalfSize / 2 && Math.abs(x - closestTower.x) <= 3 * towerHalfSize;
}

export function newTowerIsInColumnOfCross(closestTower, x, y) {
	return Math.abs(x - closestTower.x) < towerHalfSize / 2 && Math.abs(y - closestTower.y) <= 3 * towerHalfSize;
}

export function newTowerIsInTopEdges(closestTower, x, y) {
	return (
		!this.newTowerIsInColumnOfCross(closestTower, x, y) &&
		!this.newTowerIsInRowOfCross(closestTower, x, y) &&
		y < closestTower.y &&
		Math.abs(y - closestTower.y) <= 3 * towerHalfSize &&
		Math.abs(x - closestTower.x) <= 3 * towerHalfSize
	);
}

export function newTowerIsInBottomEdges(closestTower, x, y) {
	return (
		!this.newTowerIsInColumnOfCross(closestTower, x, y) &&
		!this.newTowerIsInRowOfCross(closestTower, x, y) &&
		y > closestTower.y &&
		Math.abs(y - closestTower.y) <= 3 * towerHalfSize &&
		Math.abs(x - closestTower.x) <= 3 * towerHalfSize
	);
}
