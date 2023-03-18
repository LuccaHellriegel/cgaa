import { Point } from "../engine/Point";
import { EnemySize } from "../units/CircleFactory";
// TYPES
export type WeaponRadius = {
  [key in EnemySize]: {
    bigRadius: number;
    smallRadius: number;
  };
};
type WeaponDists = {
  distArrowAndChain: number;
  distBetweenBigCircles: number;
  distBetweenBigAndSmallChain: number;
  distBetweenSmallCircles: number;
};
export type AllWeaponDists = {
  [key in EnemySize]: WeaponDists;
};
type WeaponHeight = {
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
type ArrowHead = Point[];
export type CircleChain = {
  radius: number;
  points: Point[];
};
export type WeaponGeoms = {
  frame0: {
    arrow: ArrowHead;
  };
  frame1: {
    bigChain: CircleChain;
  };
  frame2: {
    arrow: ArrowHead;
    bigChain: CircleChain;
    smallChain: CircleChain;
  };
};
export type AllWeaponGeoms = {
  [key in EnemySize]: WeaponGeoms;
};
// CONST
export const unitArrowHeadConfig: {
  [key in EnemySize]: ArrowConfig;
} = {
  Small: { width: 30, height: 15 },
  Normal: { width: 42, height: 21 },
  Big: { width: 84, height: 42 },
};
export const unitCircleChainsConfig: {
  [key in EnemySize]: WeaponChain;
} = {
  Small: { smallCircles: 7, bigCircles: 1 },
  Normal: { smallCircles: 5, bigCircles: 2 },
  Big: { smallCircles: 2, bigCircles: 3 },
};
export const chainWeaponColor = 0xff0000;
export const cirlceSizeNames: EnemySize[] = ["Small", "Normal", "Big"];
export const unitAmountConfig = {
  Small: { amount: 5 },
  Normal: { amount: 10 },
  Big: { amount: 20 },
};
