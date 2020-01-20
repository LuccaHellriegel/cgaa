import { PathMarking } from "./PathMarking";

export class PathDrawer {
	constructor(scene, realPath) {
		this.drawPath(scene, realPath);
	}
	private drawPath(scene, realPath) {
		let curPos = realPath[0];
		let prevDirection = this.calculateRelativeCrossPostioning(curPos.x, curPos.y, curPos.x - 1, curPos.y);
		let nextPos = realPath[1];
		let nextDirection = this.calculateRelativeCrossPostioning(curPos.x, curPos.y, nextPos.x, nextPos.y);
		new PathMarking(scene, curPos.x, curPos.y, prevDirection, nextDirection);
		for (let index = 1; index < realPath.length - 1; index++) {
			let prevPos = realPath[index - 1];
			curPos = realPath[index];

			prevDirection = this.calculateRelativeCrossPostioning(curPos.x, curPos.y, prevPos.x, prevPos.y);
			nextPos = realPath[index + 1];
			nextDirection = this.calculateRelativeCrossPostioning(curPos.x, curPos.y, nextPos.x, nextPos.y);
			new PathMarking(scene, curPos.x, curPos.y, prevDirection, nextDirection);
		}
		let prevPos = realPath[realPath.length - 1 - 1];
		curPos = realPath[realPath.length - 1];
		prevDirection = this.calculateRelativeCrossPostioning(curPos.x, curPos.y, prevPos.x, prevPos.y);
		nextDirection = this.calculateRelativeCrossPostioning(curPos.x, curPos.y, curPos.x + 1, curPos.y);
		new PathMarking(scene, curPos.x, curPos.y, prevDirection, nextDirection);
	}
	private calculateRelativeCrossPostioning(x, y, x2, y2) {
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
}
