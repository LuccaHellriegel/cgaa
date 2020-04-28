import { CircleChain } from "./types";
import { ChainWeapon } from "./weapon";

export function circleChainToPhysicsTopCircle(
	scene: Phaser.Scene,
	chain: CircleChain,
	parent: ChainWeapon,
	frame: number,
	arrowHeight: number,
	arrowWidth,
	distArrowAndChain: number
) {
	let point = chain.points[0];
	let radius = chain.radius;
	let result = scene.physics.add
		.sprite(point.x, point.y, "")
		.setVisible(false)
		.setActive(false)
		// to get correct circle position, we need to first change default size then set circle
		// (weird internal repositioning)
		.setSize(radius * 2, radius * 2)
		.setCircle(radius)
		.setImmovable(true)
		.setData("weapon", parent)
		.setData("frame", frame);
	let topYOfArrow = result.y - distArrowAndChain - arrowHeight / 2;
	let centerYOfNewTopCircle = topYOfArrow + arrowWidth / 2;
	result
		.setPosition(result.x, centerYOfNewTopCircle)
		.setSize(arrowWidth, arrowWidth)
		.setCircle(arrowWidth / 2);
	return result;
}
