export function calculateRelativeSpawnPositionsAround(column, row, width, height) {
	let validPositions: { column; row }[] = [];

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

export function calculateUnifiedMap(areaMaps) {
	//assummption that all areas have the same number of rows, and that the input arr is symmetric
	let map: any[] = [];

	for (let rowIndexArea = 0; rowIndexArea < areaMaps.length; rowIndexArea++) {
		for (let rowIndex = 0; rowIndex < areaMaps[0][0].length; rowIndex++) {
			let cumulativeRow = [];

			for (let columnIndexArea = 0; columnIndexArea < areaMaps[0].length; columnIndexArea++) {
				cumulativeRow = cumulativeRow.concat(areaMaps[rowIndexArea][columnIndexArea][rowIndex]);
			}
			map.push(cumulativeRow);
		}
	}
	return map;
}
