import { Polygon } from "./Polygon";

export class SymmetricCrossPolygon extends Polygon {
	constructor(x, y, rectWidth, rectHeight) {
		super(x, y, SymmetricCrossPolygon.points(x, y, rectWidth, rectHeight));
	}

	static points(x, y, rectWidth, rectHeight) {
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

		return [
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
			innerRectBottomLeft,
		];
	}
}

// export class Cross extends Phaser.GameObjects.Graphics {
// 	constructor(scene, x, y, rectWidth, rectHeight) {
// 		super(scene, { fillStyle: { color: 0xffffff } });
// 		this.strokePoints(this.points(x, y, rectWidth, rectHeight));
// 	}

// 	points(x, y, rectWidth, rectHeight) {
// 		let mostLeftUp = { x: x - rectWidth / 2, y: y - rectHeight / 2 };
// 		let mostLeftDown = { x: x - rectWidth / 2, y: y + rectHeight / 2 };

// 		let leftUp = { x: x - rectHeight / 2, y: y - rectWidth / 2 };
// 		let rightUp = { x: x + rectHeight / 2, y: y - rectWidth / 2 };

// 		let innerRectTopLeft = { x: x - rectHeight / 2, y: y - rectHeight / 2 };
// 		let innerRectTopRight = { x: x + rectHeight / 2, y: y - rectHeight / 2 };
// 		let innerRectBottomLeft = { x: x - rectHeight / 2, y: y + rectHeight / 2 };
// 		let innerRectBottomRight = { x: x + rectHeight / 2, y: y + rectHeight / 2 };

// 		let mostRightUp = { x: x + rectWidth / 2, y: y - rectHeight / 2 };
// 		let mostRightDown = { x: x + rectWidth / 2, y: y + rectHeight / 2 };

// 		let leftDown = { x: x - rectHeight / 2, y: y + rectWidth / 2 };
// 		let rightDown = { x: x + rectHeight / 2, y: y + rectWidth / 2 };

// 		return [
// 			mostLeftDown,
// 			mostLeftUp,
// 			innerRectTopLeft,
// 			leftUp,
// 			rightUp,
// 			innerRectTopRight,
// 			mostRightUp,
// 			mostRightDown,
// 			innerRectBottomRight,
// 			rightDown,
// 			leftDown,
// 			innerRectBottomLeft,
// 		];
// 	}
// }
