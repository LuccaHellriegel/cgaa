import { wallPartHalfSize } from "../../../globals/globalSizes";

export function snapCoordinateToGrid(coordinate) {
	let ceil = Math.ceil(coordinate / wallPartHalfSize) * wallPartHalfSize;
	let floor = Math.floor(coordinate / wallPartHalfSize) * wallPartHalfSize;

	if ((ceil / wallPartHalfSize) % 2 === 0) ceil = Infinity;
	if ((floor / wallPartHalfSize) % 2 === 0) floor = Infinity;

	let diffCeil = Math.abs(ceil - coordinate);
	let diffFloor = Math.abs(floor - coordinate);

	if (ceil === Infinity && floor === Infinity) {
		return coordinate - wallPartHalfSize;
	} else if (diffCeil < diffFloor) {
		return ceil;
	} else {
		return floor;
	}
}

export function snapXYToGrid(x, y) {
	let needToSnapX = (x - wallPartHalfSize) % (2 * wallPartHalfSize) !== 0;
	let needToSnapY = (y - wallPartHalfSize) % (2 * wallPartHalfSize) !== 0;

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
	return 0 + wallPartHalfSize + coordinate * 2 * wallPartHalfSize;
}

export function relativePosToRealPos(column, row) {
	let x = relativeCoordinateToReal(column);
	let y = relativeCoordinateToReal(row);
	return { x, y };
}

export function realCoordinateToRelative(coordinate) {
	coordinate = snapCoordinateToGrid(coordinate);
	return (coordinate - wallPartHalfSize) / (2 * wallPartHalfSize);
}

export function realPosToRelativePos(x, y) {
	let { newX, newY } = snapXYToGrid(x, y);
	let row = (newY - wallPartHalfSize) / (2 * wallPartHalfSize);
	let column = (newX - wallPartHalfSize) / (2 * wallPartHalfSize);
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

export function calculateRelativeCrossPostioning(x, y, x2, y2) {
	let xDirection = x2 < x;
	let yDirection = y2 < y;
	if (xDirection) {
		return "left";
	}
	if (yDirection) {
		return "top";
	}
	if (x2 == x) {
		return "bottom";
	}
	return "right";
}
