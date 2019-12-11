export function extractSpawnPosFromSpawnableMap(SpawnableMap) {
	let spawnPos = [];
	for (let row = 0; row < SpawnableMap.length; row++) {
		for (let column = 0; column < SpawnableMap[0].length; column++) {
			if (SpawnableMap[row][column] === 0) spawnPos.push({ row: row, column: column });
		}
	}
	return spawnPos;
}

export function extractSpawnPosFromSpawnableMapForArea(
	relativeAreaTopLeftX,
	realtiveAreaTopLeftY,
	relativeAreaWidth,
	relativeAreaHeight,
	SpawnableMap: any[]
) {
	let spawnPos = this.extractSpawnPosFromSpawnableMap(SpawnableMap);
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
