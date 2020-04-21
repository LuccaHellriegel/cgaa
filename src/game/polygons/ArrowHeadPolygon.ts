import { Polygon } from "./Polygon";
import { Point } from "../base/types";

export class ArrowHeadPolygon extends Polygon {
	width: number;
	height: number;
	type: string;
	x: number;
	y: number;
	points: Point[];

	constructor(x, y, width, height) {
		super(x, y, []);
		this.width = width;
		this.height = height;
		this.points = this.createUnrotatedPoints();
	}

	createUnrotatedPoints() {
		let x = this.x - this.width / 2;
		let y = this.y - this.height / 2;
		let width = this.width;
		let height = this.height;

		let ceilThirdWidth = Math.ceil(width / 3);
		let arrowLegLength = ceilThirdWidth;
		let emptySpaceBetweenLegs = width - 2 * ceilThirdWidth;

		let bottomLeft = { x: x, y: y + height };
		let bottomLeftMiddle = { x: x + arrowLegLength, y: y + height };

		let bottomTop = { x: x + arrowLegLength + emptySpaceBetweenLegs / 2, y: y + height - Math.floor(height / 3) };

		let bottomRightMiddle = { x: x + arrowLegLength + emptySpaceBetweenLegs, y: y + height };
		let bottomRight = { x: x + arrowLegLength + emptySpaceBetweenLegs + arrowLegLength, y: y + height };

		let top = { x: x + width / 2, y: y };

		return [bottomLeft, bottomLeftMiddle, bottomTop, bottomRightMiddle, bottomRight, top];
	}

	pointsToArr() {
		let pointsArr: number[][] = [];
		this.points.forEach((point) => {
			pointsArr.push([point.x, point.y]);
		});
		return pointsArr;
	}

	calculateCenterPoint() {
		let pointsArr = this.pointsToArr();
		var x = pointsArr.map((x) => x[0]);
		var y = pointsArr.map((x) => x[1]);
		var cx = (Math.min(...x) + Math.max(...x)) / 2;
		var cy = (Math.min(...y) + Math.max(...y)) / 2;
		return [cx, cy];
	}

	movePoints(diffX, diffY) {
		this.points.forEach((_, index, array) => {
			array[index].x += diffX;
			array[index].y += diffY;
		});
	}

	setPosition(x, y) {
		let diffX = x - this.x;
		let diffY = y - this.y;
		this.movePoints(diffX, diffY);
		this.x = x;
		this.y = y;
	}

	rotatePoints(rotation, centerX, centerY) {
		let originalPoints = this.createUnrotatedPoints();
		let newPoints: Point[] = [];
		originalPoints.forEach((point) => {
			let x1 = point.x - centerX;
			let y1 = point.y - centerY;

			let temp_x1 = x1 * Math.cos(rotation) - y1 * Math.sin(rotation);
			let temp_y1 = x1 * Math.sin(rotation) + y1 * Math.cos(rotation);

			let x = Math.round((temp_x1 + centerX + Number.EPSILON) * 10000) / 10000;
			let y = Math.round((temp_y1 + centerY + Number.EPSILON) * 10000) / 10000;

			if (x == -0) x = 0;
			if (y == -0) y = 0;

			newPoints.push({
				x: x,
				y: y,
			});
		});
		this.points = newPoints;
	}

	rotateWithCenter(rotation, centerX, centerY) {
		this.rotatePoints(rotation, centerX, centerY);
	}

	rotate(rotation) {
		this.rotatePoints(rotation, this.x, this.y);
	}

	getLowestHighestY() {
		let lowestY = Infinity;
		let highestY = -Infinity;
		this.points.forEach((point) => {
			if (point.y < lowestY) lowestY = point.y;
			if (point.y > highestY) highestY = point.y;
		});
		return {
			lowestY,
			highestY,
		};
	}

	getLowestHighestX() {
		let lowestX = Infinity;
		let highestX = -Infinity;
		this.points.forEach((point) => {
			if (point.x < lowestX) lowestX = point.x;
			if (point.x > highestX) highestX = point.x;
		});
		return {
			lowestX,
			highestX,
		};
	}

	draw(graphics, offset) {
		graphics.beginPath();
		graphics.moveTo(this.points[0].x + offset, this.points[0].y + offset);
		for (let index = 0; index < this.points.length; index++) {
			graphics.lineTo(this.points[index].x + offset, this.points[index].y + offset);
		}
		graphics.fillPath();
		graphics.closePath();
		graphics.strokePath();
	}
}
