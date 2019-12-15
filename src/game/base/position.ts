import { gridPartHalfSize } from "./globals/globalSizes";
import { RelativePosition } from "./types";
import { AreaConfig } from "./interfaces";

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

export function relativePosToRealPos(column, row) {
	let x = relativeCoordinateToReal(column);
	let y = relativeCoordinateToReal(row);
	return { x, y };
}

export function realCoordinateToRelative(coordinate) {
	coordinate = snapCoordinateToGrid(coordinate);
	return (coordinate - gridPartHalfSize) / (2 * gridPartHalfSize);
}

export function realPosToRelativePos(x, y) {
	let { newX, newY } = snapXYToGrid(x, y);
	let row = (newY - gridPartHalfSize) / (2 * gridPartHalfSize);
	let column = (newX - gridPartHalfSize) / (2 * gridPartHalfSize);
	return { row: row, column: column };
}

export function realPosToRelativePosInArea(x, y, area) {
	let { row, column } = realPosToRelativePos(x, y);

	let rowRelativeToArea = row - area.relativeTopLeftY;
	let columnRelativeToArea = column - area.relativeTopLeftX;
	return { row: rowRelativeToArea, column: columnRelativeToArea };
}

export function getRelativePosOfElements(elements) {
	let relativePositions: any[] = [];
	elements.forEach(ele => {
		let eleNotDestroyed = ele.scene;
		if (eleNotDestroyed) {
			let pos = realPosToRelativePos(ele.x, ele.y);
			relativePositions.push(pos);
		}
	});
	return relativePositions;
}

export function exitToGlobalPositon(areaConfig: AreaConfig): RelativePosition {
	let column = areaConfig.exit.exitPosition.column + realCoordinateToRelative(areaConfig.topLeftX);
	let row = areaConfig.exit.exitPosition.row + realCoordinateToRelative(areaConfig.topLeftY);
	return { column, row };
}
