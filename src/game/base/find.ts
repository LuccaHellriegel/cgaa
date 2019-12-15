import { RelativePosition, Point } from "./types";

export function findClosestRelativePosition(arr: RelativePosition[], column, row): RelativePosition {
	let obj;
	let dist = Infinity;
	for (const key in arr) {
		let curObj = arr[key];
		let curDist = Phaser.Math.Distance.Between(column, row, curObj.column, curObj.row);
		if (curDist < dist) {
			obj = curObj;
			dist = curDist;
		}
	}
	return obj;
}

export function findClosestPoint(arr: Point[], x, y): Point {
	let obj;
	let dist = Infinity;
	for (const key in arr) {
		let curObj = arr[key];
		let curDist = Phaser.Math.Distance.Between(x, y, curObj.x, curObj.y);
		if (curDist < dist) {
			obj = curObj;
			dist = curDist;
		}
	}
	return obj;
}
