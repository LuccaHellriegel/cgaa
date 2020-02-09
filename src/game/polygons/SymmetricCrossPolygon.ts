import { Polygon } from "./Polygon";
import { Point } from "../types";

export class SymmetricCrossPolygon extends Polygon {
	constructor(x, y, rectWidth, rectHeight) {
		let mostLeftUp = { x: x - rectWidth / 2, y: y - rectHeight / 2 };
		let mostLeftDown = { x: x - rectWidth / 2, y: y + rectHeight / 2 };

		let leftUp = { x: x - rectHeight / 2, y: y - rectWidth / 2 };
		let rightUp = { x: x + rectHeight / 2, y: y - rectWidth / 2 };

		let innerRectTopLeft = { x: x - rectHeight / 2, y: y - rectHeight / 2 };
		let innerRectTopRight = { x: x + rectHeight / 2, y: y - rectHeight / 2 };
		let innerRectBottomLeft = { x: x - rectHeight / 2, y: y + rectHeight / 2 };
		let innerRectBottomRight = { x: x + rectHeight / 2, y: y + rectHeight / 2 };

		let mostRightUp = { x: x + rectWidth / 2, y: y - rectHeight / 2 };
		let mostRightDown = { x: x + rectWidth / 2, y: y + rectHeight / 2 };

		let leftDown = { x: x - rectHeight / 2, y: y + rectWidth / 2 };
		let rightDown = { x: x + rectHeight / 2, y: y + rectWidth / 2 };

		let points: Point[] = [
			mostLeftDown,
			mostLeftUp,
			innerRectTopLeft,
			leftUp,
			rightUp,
			innerRectTopRight,
			mostRightUp,
			mostRightDown,
			innerRectBottomRight,
			rightDown,
			leftDown,
			innerRectBottomLeft
		];
		super(x, y, points);
	}
}
