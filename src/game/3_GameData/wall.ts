import { RelPos } from "../0_GameBase/engine/RelPos";
import { WallSide, Exit, GameMap } from "../0_GameBase/types";

function splitRelPosArrAtGaps(positions: RelPos[]): RelPos[][] {
	let splitArrs = [[positions[0]]];
	let splitArrsIndex = 0;
	let lastPos = positions[0];
	for (let posIndex = 1; posIndex < positions.length; posIndex++) {
		const pos = positions[posIndex];
		// 1 or 0 means the positions are next to each other/ the same
		const distanceInOneDirectionDetected =
			(Math.abs(lastPos.column - pos.column) > 1 && Math.abs(lastPos.row - pos.row) == 0) ||
			(Math.abs(lastPos.row - pos.row) > 1 && Math.abs(lastPos.column - pos.column) == 0);
		// switch to next arr
		if (distanceInOneDirectionDetected) {
			splitArrsIndex++;
			splitArrs.push([]);
		}
		splitArrs[splitArrsIndex].push(pos);
		lastPos = pos;
	}
	return splitArrs;
}

export function splitUpWallSidesAtExits(wallSides: WallSide[], exits: Exit[]) {
	let result: WallSide[] = [];
	// trade-off: flatter data structure and simpler algorithm for wallSide-creation for longer computation
	// (but just while game loads)
	for (const wallSide of wallSides) {
		let tempPosArr = [];
		let overlap = false;
		let overlapExit;
		for (const wallPos of wallSide.positionsInMap) {
			for (const exit of exits) {
				for (const pos of exit.positionsInMap) {
					if (wallPos.column == pos.column && wallPos.row == pos.row) {
						// assumes just a single overlap is possible
						overlap = true;
						overlapExit = exit;
					}
				}
			}
		}

		if (overlap) {
			for (const wallPos of wallSide.positionsInMap) {
				let posOverlaps = false;
				for (const pos of overlapExit.positionsInMap) {
					if (wallPos.column == pos.column && wallPos.row == pos.row) {
						posOverlaps = true;
					}
				}
				if (!posOverlaps) tempPosArr.push(wallPos);
			}

			const splitArrs = splitRelPosArrAtGaps(tempPosArr);
			for (const posArr of splitArrs) {
				result.push({ positionsInMap: posArr });
			}
		} else {
			result.push(wallSide);
		}
	}
	return result;
}

export function addWallSidesToGameMap(gameMap: GameMap, wallSides: WallSide[], wallSymbol) {
	for (const wallSide of wallSides) {
		for (const pos of wallSide.positionsInMap) {
			gameMap[pos.row][pos.column] = wallSymbol;
		}
	}
}
