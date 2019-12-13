import { wallPartHalfSize } from "../../globals/globalSizes";
import { exitSymbol, wallSymbol } from "../../globals/globalSymbols";
import { WallPart } from "./WallPart";
import { StaticConfig } from "../base/types";
import { ZeroOneMap } from "../base/map/map";
import { calculateBorderWallSize } from "./calculate";

export type WallBase = { staticConfig: StaticConfig; sizeOfXAxis: number; sizeOfYAxis: number };

export interface WallsConfig {
	wallBase: WallBase;
	topLeftX: number;
	topLeftY: number;
}

function isWall(config: WallsConfig, column: number, row: number): boolean {
	let isLeftWall = column === 0;
	let isRightWall = column === config.wallBase.sizeOfXAxis - 1;
	let isTopWall = row === 0;
	let isBottomWall = row === config.wallBase.sizeOfYAxis - 1;
	return isLeftWall || isRightWall || isTopWall || isBottomWall;
}

export function createWalls(config: WallsConfig, map: ZeroOneMap) {
	let x = config.topLeftX;
	let y = config.topLeftY;
	for (let row = 0; row < config.wallBase.sizeOfYAxis; row++) {
		for (let column = 0; column < config.wallBase.sizeOfXAxis; column++) {
			let isExit = map[row][column] === exitSymbol;
			if (!isExit && isWall(config, column, row)) {
				map[row][column] = wallSymbol;
				new WallPart(config.wallBase.staticConfig.scene, x, y, config.wallBase.staticConfig.physicsGroup);
			}
			x += 2 * wallPartHalfSize;
		}
		y += 2 * wallPartHalfSize;
		x = config.topLeftX;
	}
}

export function createBorderWall(config: WallsConfig) {
	let x = config.topLeftX;
	let y = config.topLeftY;
	for (let row = 0; row < config.wallBase.sizeOfYAxis; row++) {
		for (let column = 0; column < config.wallBase.sizeOfXAxis; column++) {
			if (isWall(config, column, row)) {
				new WallPart(config.wallBase.staticConfig.scene, x, y, config.wallBase.staticConfig.physicsGroup);
			}
			x += 2 * wallPartHalfSize;
		}
		y += 2 * wallPartHalfSize;
		x = config.topLeftX;
	}

	return calculateBorderWallSize(config);
}
