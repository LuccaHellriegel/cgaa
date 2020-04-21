import { Point } from "../../base/types";
import { EnemySize } from "../../unit/CircleFactory";

export type WeaponRadius = {
	[key in EnemySize]: {
		bigRadius: number;
		smallRadius: number;
	};
};

export type WeaponDists = {
	distArrowAndChain: number;
	distBetweenBigCircles: number;
	distBetweenBigAndSmallChain: number;
	distBetweenSmallCircles: number;
};

export type AllWeaponDists = {
	[key in EnemySize]: WeaponDists;
};

export type WeaponHeight = {
	frame0: number;
	frame1: number;
	frame2: number;
};

export type AllWeaponHeights = {
	[key in EnemySize]: WeaponHeight;
};

export type WeaponTopLefts = {
	frame0: Point;
	frame1: Point;
	frame2: Point;
};

export type AllWeaponTopLefts = {
	[key in EnemySize]: WeaponTopLefts;
};

export type WeaponChain = {
	smallCircles: number;
	bigCircles: number;
};

export type ArrowConfig = {
	width: number;
	height: number;
};

export type ArrowHead = Point[];

export type CircleChain = {
	radius: number;
	points: Point[];
};

export type WeaponGeom = { arrow: ArrowHead; bigChain?: CircleChain; smallChain?: CircleChain };

export type WeaponGeoms = {
	frame0: { arrow: ArrowHead };
	frame1: { bigChain: CircleChain };
	frame2: { arrow: ArrowHead; bigChain: CircleChain; smallChain: CircleChain };
};

export type AllWeaponGeoms = { [key in EnemySize]: WeaponGeoms };

export type PhysicsGeoms = {
	frame1: { topCircle: Phaser.Physics.Arcade.Sprite };
	frame2: { topCircle: Phaser.Physics.Arcade.Sprite };
};
