import { Point } from "./types";
import { RelPos } from "./RelPos";

export abstract class Dict {
	dict = {};
	constructor(obj: any[][]) {
		obj.forEach(vals => this.set(vals[0], vals[1]));
	}
	protected abstract toID(idparams): string;
	abstract get(idParams);
	abstract set(idParams, value);
}

export class RealDict extends Dict {
	protected toID(point: Point) {
		return point.x + " " + point.y;
	}
	get(point: Point) {
		return this.dict[this.toID(point)];
	}
	set(point: Point, value) {
		this.dict[this.toID(point)] = value;
	}

	static fromDict(dict) {
		let real = new RealDict([]);
		real.dict = dict;
		return real;
	}
}

export class RelativeDict extends Dict {
	protected toID(pos: RelPos) {
		return pos.column + " " + pos.row;
	}
	get(pos: RelPos) {
		return this.dict[this.toID(pos)];
	}
	set(pos: RelPos, value) {
		this.dict[this.toID(pos)] = value;
	}

	static fromDict(dict) {
		let relative = new RelativeDict([]);
		relative.dict = dict;
		return relative;
	}
}