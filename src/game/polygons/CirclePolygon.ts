import { shapeWord, Polygon } from "./Polygon";

export class CirclePolygon extends Polygon {
	r: number;

	constructor(x, y, radius) {
		super(x, y, [
			{
				x: x,
				y: y,
			},
		]);
		this.type = shapeWord.circle;
		this.r = radius;
	}

	createUnrotatedPoints() {
		return this.points;
	}

	calculateCenterPoint() {
		return [this.points[0].x, this.points[0].y];
	}

	setPosition(x, y) {
		this.points = [
			{
				x: x,
				y: y,
			},
		];
		this.x = x;
		this.y = y;
	}

	getDistance(x1, y1, x2, y2) {
		var xs = x2 - x1,
			ys = y2 - y1;

		xs *= xs;
		ys *= ys;

		return Math.sqrt(xs + ys);
	}

	checkForCollisonWithOtherCircle(otherCircle) {
		let distBetweenCircleCenters = this.getDistance(this.x, this.y, otherCircle.x, otherCircle.y);
		return distBetweenCircleCenters < this.r + otherCircle.r;
	}

	getLowestHighestY() {
		let lowestY = this.y - this.r;
		let highestY = this.y + this.r;
		return { lowestY, highestY };
	}

	draw(graphics, offset) {
		graphics.fillCircle(this.points[0].x + offset, this.points[0].y + offset, this.r);
	}
}
