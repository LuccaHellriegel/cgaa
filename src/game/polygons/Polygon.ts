import { Point } from "../base/types";

export let shapeWord = {
	line: "line",
	point: "point",
	circle: "circle",
	polygon: "polygon"
};

export class Polygon {
	type: string;
	x: number;
	y: number;
	points: Point[];

	constructor(x, y, points) {
		this.type = shapeWord.polygon;
		this.x = x;
		this.y = y;
		this.points = points;
	}

	pointsToArr() {
		let pointsArr: number[][] = [];
		this.points.forEach(point => {
			pointsArr.push([point.x, point.y]);
		});
		return pointsArr;
	}

	calculateCenterPoint() {
		let pointsArr = this.pointsToArr();
		var x = pointsArr.map(x => x[0]);
		var y = pointsArr.map(x => x[1]);
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
		originalPoints.forEach(point => {
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
				y: y
			});
		});
		this.points = newPoints;
	}
	createUnrotatedPoints() {
		return this.points;
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
		this.points.forEach(point => {
			if (point.y < lowestY) lowestY = point.y;
			if (point.y > highestY) highestY = point.y;
		});
		return {
			lowestY,
			highestY
		};
	}

	getLowestHighestX() {
		let lowestX = Infinity;
		let highestX = -Infinity;
		this.points.forEach(point => {
			if (point.x < lowestX) lowestX = point.x;
			if (point.x > highestX) highestX = point.x;
		});
		return {
			lowestX,
			highestX
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
