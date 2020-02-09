import { PathMarking } from "./PathMarking";
import { Paths } from "../Paths";
import { Path } from "../Path";
import { Gameplay } from "../../../scenes/Gameplay";

export class PathDrawer {
	ends: PathMarking[] = [];
	constructor(scene: Gameplay, paths: Paths) {
		let pathArrs: Path[] = Object.values(paths.pathDict);
		pathArrs.forEach(path => {
			this.drawPath(scene, path.getRealPath());
		});
		this.ends.forEach(endMarking => {
			scene.children.bringToTop(endMarking);
		});
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
		let marking = new PathMarking(scene, curPos.x, curPos.y, prevDirection, nextDirection);
		marking.setTint(0x013220, 0x013220, 0x013220, 0x013220);
		this.ends.push(marking);
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
