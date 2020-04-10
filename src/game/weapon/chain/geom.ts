import { Point } from "../../base/types";
import { ArrowConfig, WeaponChain, WeaponGeom } from "./types";

export function distanceArrowCenterToChain(bigRadius: number) {
	return 3 * bigRadius;
}

export function topDownChainHeight(points: Point[]) {
	// assumes points are alligned on x-axis
	let topPointY = points[0].y;
	let bottomPointY = points[points.length - 1].y;
	return Math.abs(topPointY - bottomPointY);
}

export function topDownWeaponGeom(
	topLeft: Point,
	arrowConfig: ArrowConfig,
	weaponChainConfig: WeaponChain
): WeaponGeom {
	// calculate arrow
	let { width, height } = arrowConfig;
	let arrow = arrowHeadPoints(topLeft, width, height);

	// basic chain-circle data
	let { smallCircles, bigCircles } = weaponChainConfig;
	let bigRadius = width / 3 / 2;
	let smallRadius = 2 * (bigRadius / 3);

	// weapon geometry is aligned on x-axis, so any x = x
	let arrowCenterX = topLeft.x + width / 2;
	let arrowCenterY = topLeft.y + height / 2;

	// calculate bigChainTopCenter
	let distArrowAndChain = distanceArrowCenterToChain(bigRadius);
	let bigChainTopCenter = { x: arrowCenterX, y: arrowCenterY + distArrowAndChain };

	// calculate bigChain
	let distBetweenBigCircles = smallRadius * 1.5 + bigRadius * 2;
	let bigChain = { radius: bigRadius, points: topDownChain(bigChainTopCenter, distBetweenBigCircles, bigCircles) };

	// calculate smallChainTopCenter
	let distBetweenBigAndSmallChain = 2 * smallRadius + bigRadius;
	let lowestJoint = bigChain.points[bigChain.points.length - 1];
	let smallChainTopCenter = { x: arrowCenterX, y: lowestJoint.y + distBetweenBigAndSmallChain };

	// calculate smallChain
	let distBetweenSmallCircles = smallRadius * 3.5;
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
