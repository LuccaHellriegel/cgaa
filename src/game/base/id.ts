export function extendWithNewId(obj) {
	obj.id =
		"_" +
		Math.random()
			.toString(36)
			.substr(2, 9);
}

export function constructColumnRowID(column, row) {
	return column + " " + row;
}

export function columnRowIDToIntArr(id: string): number[] {
	let arr = id.split(" ");
	return [parseInt(arr[0]), parseInt(arr[1])];
}
