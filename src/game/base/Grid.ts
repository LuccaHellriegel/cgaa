import { EnvSetup } from "../setup/EnvSetup";

export class Grid {
	private constructor() {}

	static snapCoordinateToGrid(coordinate) {
		let ceil = Math.ceil(coordinate / EnvSetup.halfGridPartSize) * EnvSetup.halfGridPartSize;
		let floor = Math.floor(coordinate / EnvSetup.halfGridPartSize) * EnvSetup.halfGridPartSize;

		if ((ceil / EnvSetup.halfGridPartSize) % 2 === 0) ceil = Infinity;
		if ((floor / EnvSetup.halfGridPartSize) % 2 === 0) floor = Infinity;

		let diffCeil = Math.abs(ceil - coordinate);
		let diffFloor = Math.abs(floor - coordinate);

		if (ceil === Infinity && floor === Infinity) {
			return coordinate - EnvSetup.halfGridPartSize;
		} else if (diffCeil < diffFloor) {
			return ceil;
		} else {
			return floor;
		}
	}

	static snapXYToGrid(x, y) {
		let needToSnapX = (x - EnvSetup.halfGridPartSize) % EnvSetup.gridPartSize !== 0;
		let needToSnapY = (y - EnvSetup.halfGridPartSize) % EnvSetup.gridPartSize !== 0;

		if (!needToSnapX && !needToSnapY) return { newX: x, newY: y };

		let newX;
		let newY;

		if (needToSnapX) {
			newX = Grid.snapCoordinateToGrid(x);
		} else {
			newX = x;
		}

		if (needToSnapY) {
			newY = Grid.snapCoordinateToGrid(y);
		} else {
			newY = y;
		}
		return { newX, newY };
	}
}
