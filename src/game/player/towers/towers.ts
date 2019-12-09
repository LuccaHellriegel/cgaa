import { towerHalfSize } from "../../../globals/globalSizes";

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

//TODO: optimize the double calculation
export function snapTowerPosToClosestTower(closestTower, x, y) {
	if (closestTower.x === x && closestTower.y === y) {
		return null;
	}

	let isRightOfCenterX = x > closestTower.x;
	let isOverCenterY = y < closestTower.y;

	let isInRowOfCross = this.newTowerIsInRowOfCross(closestTower, x, y);
	let isInColumnOfCross = this.newTowerIsInColumnOfCross(closestTower, x, y);
	let isInTopEdges = this.newTowerIsInTopEdges(closestTower, x, y);
	let isInBottomEdges = this.newTowerIsInBottomEdges(closestTower, x, y);

	let changeX = 0;
	let changeY = 0;

	if (isInRowOfCross && isInColumnOfCross) {
		let isMoreInColumn = Math.abs(y - closestTower.y) > Math.abs(x - closestTower.x);
		if (isMoreInColumn) {
			isInColumnOfCross = true;
			isInRowOfCross = false;
		} else {
			isInColumnOfCross = false;
			isInRowOfCross = true;
		}
	}

	if (isInColumnOfCross) {
		if (isOverCenterY) {
			changeY = -2 * towerHalfSize;
		} else {
			changeY = 2 * towerHalfSize;
		}
	}

	if (isInRowOfCross) {
		if (isRightOfCenterX) {
			changeX = 2 * towerHalfSize;
		} else {
			changeX = -2 * towerHalfSize;
		}
	}

	if (isInTopEdges) {
		if (isRightOfCenterX) {
			changeX = 2 * towerHalfSize;
		} else {
			changeX = -2 * towerHalfSize;
		}
		changeY = -2 * towerHalfSize;
	}

	if (isInBottomEdges) {
		if (isRightOfCenterX) {
			changeX = 2 * towerHalfSize;
		} else {
			changeX = -2 * towerHalfSize;
		}
		changeY = 2 * towerHalfSize;
	}

	//TODO: other side of map is also out of boundss
	if (closestTower.x + changeX < towerHalfSize || closestTower.y + changeY < towerHalfSize) return null;

	return { newX: closestTower.x + changeX, newY: closestTower.y + changeY };
}