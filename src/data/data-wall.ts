import { splitArr } from "../engine/array";
import { equal2DPositions } from "../engine/navigation";
import { RelPos } from "../engine/RelPos";
import { WallSide, Exit, GameMap } from "../types";

function splitRelPosArrAtGaps(positions: RelPos[]): RelPos[][] {
	const tester = (lastPos, curPos) => {
		// 1 or 0 means the positions are next to each other/ the same
		const distanceInOneDirectionDetected =
			(Math.abs(lastPos.column - curPos.column) > 1 && Math.abs(lastPos.row - curPos.row) == 0) ||
			(Math.abs(lastPos.row - curPos.row) > 1 && Math.abs(lastPos.column - curPos.column) == 0);

		return distanceInOneDirectionDetected;
	};

	return splitArr(positions, tester);
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
					if (equal2DPositions(wallPos, pos)) {
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
					if (equal2DPositions(wallPos, pos)) {
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
