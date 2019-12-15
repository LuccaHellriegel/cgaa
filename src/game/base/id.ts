import { relativeCoordinateToReal } from "./position";

export function extendWithNewId(obj) {
	obj.id =
		"_" +
		Math.random()
			.toString(36)
			.substr(2, 9);
}

export function constructXYIDfromColumnRow(column, row) {
	let x = relativeCoordinateToReal(column);
	let y = relativeCoordinateToReal(row);
	return x + " " + y;
}

export function constructXYID(x, y) {
	return x + " " + y;
}
