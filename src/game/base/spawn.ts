export function calculateRelativeSpawnPositionsAround(column, row, width, height) {
	let validPositions: { column; row }[] = [];

	//TODO: assumes symmetrical objects that fit perfectly on the grid

	let rowSize = Math.floor(height / 2) + 1;
	let columnSize = Math.floor(width / 2) + 1;

	let startRow = row - rowSize;
	let startColumn = column - columnSize;

	for (let rowIndex = 0; rowIndex < height + 2; rowIndex++) {
		for (let columnIndex = 0; columnIndex < width + 2; columnIndex++) {
			let betweenRowEdges = startRow + rowIndex > row - rowSize && startRow + rowIndex < row + rowSize;
			let betweenColumnEdges =
				startColumn + columnIndex > column - columnSize && startColumn + columnIndex < column + columnSize;

			if (!betweenRowEdges || !betweenColumnEdges) {
				validPositions.push({ column: startColumn + columnIndex, row: startRow + rowIndex });
			}
		}
	}
	return validPositions;
}

export function extractSpawnPosFromSpawnableArr(spawnableArr) {
	let spawnPos = [];
	for (let row = 0; row < spawnableArr.length; row++) {
		for (let column = 0; column < spawnableArr[0].length; column++) {
			if (spawnableArr[row][column] === 0) spawnPos.push({ row: row, column: column });
		}
	}
	return spawnPos;
}

export function extractSpawnPosFromSpawnableArrForArea(
	relativeAreaTopLeftX,
	realtiveAreaTopLeftY,
	relativeAreaWidth,
	relativeAreaHeight,
	spawnableArr: any[]
) {
	let spawnPos = this.extractSpawnPosFromSpawnableArr(spawnableArr);
	let areaSpawnPos = [];
	spawnPos.forEach(pos => {
		if (
			pos.column < relativeAreaTopLeftX + relativeAreaWidth &&
			pos.column >= relativeAreaTopLeftX &&
			pos.row < realtiveAreaTopLeftY + relativeAreaHeight &&
			pos.row >= realtiveAreaTopLeftY
		) {
			areaSpawnPos.push(pos);
		}
	});
	return areaSpawnPos;
}

export function randomlyTryAllSpawnablePos(spawnablePos, randGenerationCallback, validTestingCallback) {
	let spawnablePosCount = spawnablePos.length - 1;
	let randPos = randGenerationCallback(spawnablePosCount);

	let positionsTried = 0;

	let chosenPosition = spawnablePos[randPos];

	while (!validTestingCallback(chosenPosition.column, chosenPosition.row)) {
		positionsTried++;
		if (positionsTried === spawnablePosCount + 1) {
			return null;
		}

		let reachedLastPos = randPos === spawnablePosCount;
		if (!reachedLastPos) {
			randPos++;
		} else {
			randPos = 0;
		}
		chosenPosition = spawnablePos[randPos];
	}

	return chosenPosition;
}
