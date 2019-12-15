import { gridPartHalfSize } from "./globals/globalSizes";
import { Point, RelativePosition } from "./types";

export function snapCoordinateToGrid(coordinate) {
	let ceil = Math.ceil(coordinate / gridPartHalfSize) * gridPartHalfSize;
	let floor = Math.floor(coordinate / gridPartHalfSize) * gridPartHalfSize;

	if ((ceil / gridPartHalfSize) % 2 === 0) ceil = Infinity;
	if ((floor / gridPartHalfSize) % 2 === 0) floor = Infinity;

	let diffCeil = Math.abs(ceil - coordinate);
	let diffFloor = Math.abs(floor - coordinate);

	if (ceil === Infinity && floor === Infinity) {
		return coordinate - gridPartHalfSize;
	} else if (diffCeil < diffFloor) {
		return ceil;
	} else {
		return floor;
	}
}

export function snapXYToGrid(x, y) {
	let needToSnapX = (x - gridPartHalfSize) % (2 * gridPartHalfSize) !== 0;
	let needToSnapY = (y - gridPartHalfSize) % (2 * gridPartHalfSize) !== 0;

	if (!needToSnapX && !needToSnapY) return { newX: x, newY: y };

	let newX;
	let newY;

	if (needToSnapX) {
		newX = snapCoordinateToGrid(x);
	} else {
		newX = x;
	}

	if (needToSnapY) {
		newY = snapCoordinateToGrid(y);
	} else {
		newY = y;
	}
	return { newX, newY };
}

export function relativeCoordinateToReal(coordinate) {
	return 0 + gridPartHalfSize + coordinate * 2 * gridPartHalfSize;
}

export function relativePositionToPoint(column, row): Point {
	let x = relativeCoordinateToReal(column);
	let y = relativeCoordinateToReal(row);
	return { x, y };
}

export function realCoordinateToRelative(coordinate) {
	return (snapCoordinateToGrid(coordinate) - gridPartHalfSize) / (2 * gridPartHalfSize);
}

export function exitToGlobalPoint(areaConfig): Point {
	let x = relativeCoordinateToReal(areaConfig.exit.exitPosition.column) + areaConfig.topLeftX - gridPartHalfSize;
	let y = relativeCoordinateToReal(areaConfig.exit.exitPosition.row) + areaConfig.topLeftY - gridPartHalfSize;
	return { x, y };
}

export function exitToGlobalRelativePosition(areaConfig): RelativePosition {
	let column = areaConfig.exit.exitPosition.column + realCoordinateToRelative(areaConfig.topLeftX);
	let row = areaConfig.exit.exitPosition.row + realCoordinateToRelative(areaConfig.topLeftY);
	return { column, row };
}
