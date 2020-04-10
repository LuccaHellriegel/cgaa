import { Point } from "../../base/types";

export type ArrowHead = Point[];

export type CircleChain = {
	radius: number;
	points: Point[];
};

export type WeaponGeom = {
	arrow: ArrowHead;
	bigChain: CircleChain;
	smallChain: CircleChain;
};

export type WeaponChain = {
	smallCircles: number;
	bigCircles: number;
};

export type ArrowConfig = {
	width: number;
	height: number;
};
