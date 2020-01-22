import { relativeCoordinateToReal } from "./position";

export function constructXYIDfromColumnRow(column, row) {
	let x = relativeCoordinateToReal(column);
	let y = relativeCoordinateToReal(row);
	return x + " " + y;
}

export function constructXYID(x, y) {
	return x + " " + y;
}
