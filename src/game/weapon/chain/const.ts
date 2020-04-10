import { EnemySize } from "../../unit/CircleFactory";
import { ArrowConfig, WeaponChain } from "./types";

export const unitArrowHeadConfig: { [key in EnemySize]: ArrowConfig } = {
	Small: { width: 30, height: 15 },
	Normal: { width: 42, height: 21 },
	Big: { width: 84, height: 42 },
};

export const unitCircleChainsConfig: { [key in EnemySize]: WeaponChain } = {
	Small: { smallCircles: 7, bigCircles: 1 },
	Normal: { smallCircles: 5, bigCircles: 2 },
	Big: { smallCircles: 2, bigCircles: 3 },
};

export const chainWeaponColor = 0xff0000;

export const cirlceSizeNames: EnemySize[] = ["Small", "Normal", "Big"];
