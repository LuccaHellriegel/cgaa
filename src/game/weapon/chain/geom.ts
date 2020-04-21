import { Point } from "../../base/types";
import { ArrowConfig, WeaponChain, WeaponGeoms, WeaponTopLefts, AllWeaponGeoms } from "./types";
import { cirlceSizeNames, unitArrowHeadConfig, unitCircleChainsConfig } from "./const";
import { EnemySize } from "../../unit/CircleFactory";
import { weaponDists, weaponRadius, weaponTopLefts, weaponHeights } from "./data";

export function weaponGeomsPerSize() {
	let result = {};
	for (let unitSize of cirlceSizeNames) {
		let arrowConfig = unitArrowHeadConfig[unitSize];
		let weaponChainConfig = unitCircleChainsConfig[unitSize];

		let topLefts = weaponTopLefts[unitSize];
		result[unitSize] = topDownWeaponGeom(topLefts, arrowConfig, weaponChainConfig, unitSize);
	}

	return result as AllWeaponGeoms;
}

function topDownWeaponGeom(
	topLefts: WeaponTopLefts,
	arrowConfig: ArrowConfig,
	weaponChainConfig: WeaponChain,
	unitSize: EnemySize
): WeaponGeoms {
	// need three frames, to allow empty space (all frames should start at the bottom)
	return {
		frame0: topDownWeaponGeomFrame0(topLefts.frame0, arrowConfig, unitSize),
		frame1: topDownWeaponGeomFrame1(topLefts.frame1, arrowConfig, weaponChainConfig, unitSize),
		frame2: topDownWeaponGeomFrame2(topLefts.frame2, arrowConfig, weaponChainConfig, unitSize),
	};
}

function topDownWeaponGeomFrame0(topLeft: Point, arrowConfig: ArrowConfig, unitSize: EnemySize) {
	let { width, height } = arrowConfig;
	let { x, y } = topLeft;
	let { frame0, frame2 } = weaponHeights[unitSize];
	y += frame2 - frame0;
	let arrow = arrowHeadPoints({ x, y }, width, height);

	return { arrow };
}

function topDownWeaponGeomFrame1(
	topLeft: Point,
	arrowConfig: ArrowConfig,
	weaponChainConfig: WeaponChain,
	unitSize: EnemySize
) {
	// calculate arrow
	let { width, height } = arrowConfig;
	let { x, y } = topLeft;
	let { frame1, frame2 } = weaponHeights[unitSize];
	y += frame2 - frame1;
	let arrow = arrowHeadPoints({ x, y }, width, height);

	// basic chain-circle data
	let { bigCircles } = weaponChainConfig;
	let { bigRadius } = weaponRadius[unitSize];
	let { distArrowAndChain, distBetweenBigCircles } = weaponDists[unitSize];

	// weapon geometry is aligned on x-axis, so any x = x
	let arrowCenterX = x + width / 2;
	let arrowCenterY = y + height / 2;

	// calculate bigChainTopCenter
	let bigChainTopCenter = { x: arrowCenterX, y: arrowCenterY + distArrowAndChain };

	// calculate bigChain
	let bigChain = { radius: bigRadius, points: topDownChain(bigChainTopCenter, distBetweenBigCircles, bigCircles) };

	return { arrow, bigChain };
}

function topDownWeaponGeomFrame2(
	topLeft: Point,
	arrowConfig: ArrowConfig,
	weaponChainConfig: WeaponChain,
	unitSize: EnemySize
) {
	// calculate arrow
	let { width, height } = arrowConfig;
	let arrow = arrowHeadPoints(topLeft, width, height);

	// basic chain-circle data
	let { smallCircles, bigCircles } = weaponChainConfig;
	let { bigRadius, smallRadius } = weaponRadius[unitSize];
	let { distArrowAndChain, distBetweenBigCircles, distBetweenBigAndSmallChain, distBetweenSmallCircles } = weaponDists[
		unitSize
	];

	// weapon geometry is aligned on x-axis, so any x = x
	let arrowCenterX = topLeft.x + width / 2;
	let arrowCenterY = topLeft.y + height / 2;

	// calculate bigChainTopCenter
	let bigChainTopCenter = { x: arrowCenterX, y: arrowCenterY + distArrowAndChain };

	// calculate bigChain
	let bigChain = { radius: bigRadius, points: topDownChain(bigChainTopCenter, distBetweenBigCircles, bigCircles) };

	// calculate smallChainTopCenter
	let lowestJoint = bigChain.points[bigChain.points.length - 1];
	let smallChainTopCenter = { x: arrowCenterX, y: lowestJoint.y + distBetweenBigAndSmallChain };

	// calculate smallChain
	let smallChain = {
		radius: smallRadius,
		points: topDownChain(smallChainTopCenter, distBetweenSmallCircles, smallCircles),
	};

	return { arrow, bigChain, smallChain };
}

function topDownChain(topCenter: Point, distance: number, numberOfJoints: number): Point[] {
	let { x, y } = topCenter;
	let result = [];
	for (let index = 0; index < numberOfJoints; index++) {
		result.push({ x: x, y: y });
		y += distance;
	}
	return result;
}

function arrowHeadPoints(topLeft: Point, width: number, height: number): Point[] {
	let { x, y } = topLeft;

	let ceilThirdWidth = Math.ceil(width / 3);
	let arrowLegLength = ceilThirdWidth;
	let emptySpaceBetweenLegs = width - 2 * ceilThirdWidth;

	let bottomLeft = { x: x, y: y + height };
	let bottomLeftMiddle = { x: x + arrowLegLength, y: y + height };
	let bottomTop = {
		x: x + arrowLegLength + emptySpaceBetweenLegs / 2,
		y: y + height - Math.floor(height / 3),
	};
	let bottomRightMiddle = { x: x + arrowLegLength + emptySpaceBetweenLegs, y: y + height };
	let bottomRight = { x: x + arrowLegLength + emptySpaceBetweenLegs + arrowLegLength, y: y + height };
	let top = { x: x + width / 2, y: y };

	return [bottomLeft, bottomLeftMiddle, bottomTop, bottomRightMiddle, bottomRight, top];
}
