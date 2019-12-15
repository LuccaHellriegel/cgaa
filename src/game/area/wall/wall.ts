import { gridPartHalfSize } from "../../base/globals/globalSizes";
import { exitSymbol, wallSymbol } from "../../base/globals/globalSymbols";
import { ZeroOneMap } from "../../base/types";
import { Point } from "../../base/polygons/Point";
import { WallSide } from "./WallSide";
import { AreaConfig } from "../../base/interfaces";
import { exitToGlobalPositon, relativePosToRealPos } from "../../base/position";

function splitupAtExit(exitPosition, positionArr) {
	console.log(positionArr);
	let firstPositionArr: Point[] = [];
	let secondPositionArr: Point[] = [];

	let exitWidth = 0;
	positionArr.forEach(position => {
		if (exitPosition.y > position.y) {
			firstPositionArr.push(position);
		} else if (exitPosition.y < position.y && exitWidth === 3) {
			secondPositionArr.push(position);
		} else {
			console.log("here");
			exitWidth++;
		}
	});
	console.log(firstPositionArr, secondPositionArr);
	return [firstPositionArr, secondPositionArr];
}

export function createWalls(config: AreaConfig, map: ZeroOneMap) {
	let x = config.topLeftX;
	let y = config.topLeftY;

	let leftPartPositions: Point[] = [];
	let rightPartPositions: Point[] = [];
	let topPartPositions: Point[] = [];
	let bottomPartPositions: Point[] = [];

	for (let row = 0; row < config.wallBase.sizeOfYAxis; row++) {
		for (let column = 0; column < config.wallBase.sizeOfXAxis; column++) {
			let isExit = map[row][column] === exitSymbol;
			let isLeftWall = column === 0;
			let isRightWall = column === config.wallBase.sizeOfXAxis - 1;
			let isTopWall = row === 0;
			let isBottomWall = row === config.wallBase.sizeOfYAxis - 1;
			let isWall = isLeftWall || isRightWall || isTopWall || isBottomWall;
			if (isLeftWall) leftPartPositions.push({ x, y });
			if (isRightWall) rightPartPositions.push({ x, y });
			if (isTopWall) topPartPositions.push({ x, y });
			if (isBottomWall) bottomPartPositions.push({ x, y });
			if (!isExit && isWall) {
				map[row][column] = wallSymbol;
			}
			x += 2 * gridPartHalfSize;
		}
		y += 2 * gridPartHalfSize;
		x = config.topLeftX;
	}

	let globalPos = exitToGlobalPositon(config);
	let globalExitPosition = relativePosToRealPos(globalPos.column, globalPos.row);

	let positionArrs = [topPartPositions, bottomPartPositions];
	let splitupArrs;
	if (config.exit.wallSide === "left") {
		positionArrs.push(rightPartPositions);
		splitupArrs = splitupAtExit(globalExitPosition, leftPartPositions);
	} else {
		positionArrs.push(leftPartPositions);
		splitupArrs = splitupAtExit(globalExitPosition, rightPartPositions);
	}

	positionArrs.push(splitupArrs[0], splitupArrs[1]);

	console.log(positionArrs);
	positionArrs.forEach(positions => {
		new WallSide(config.wallBase.staticConfig.scene, config.wallBase.staticConfig.physicsGroup, positions);
	});
}
