import { EnemySize } from "../../unit/CircleFactory";
import { weaponGeoms, weaponDists } from "./data";
import { CircleChain, PhysicsGeoms } from "./types";
import { unitArrowHeadConfig } from "./const";
import { ChainWeapon } from "./weapon";

export function weaponGeomsToPhysicsCircles(scene: Phaser.Scene, unitSize: EnemySize, parent: ChainWeapon) {
	let geoms = weaponGeoms[unitSize];
	let result: PhysicsGeoms = {
		frame1: { topCircle: circleChainToPhysicsTopCircle(scene, geoms.frame1.bigChain, parent, 1) },
		frame2: {
			topCircle: circleChainToPhysicsTopCircle(scene, geoms.frame2.bigChain, parent, 2),
		},
	};

	// top physics circle should overlap arrow and the top circle of the big chain
	let { height, width } = unitArrowHeadConfig[unitSize];
	let { distArrowAndChain } = weaponDists[unitSize];
	setTopCircleToIncludeArrow(result.frame1.topCircle, height, width, distArrowAndChain);
	setTopCircleToIncludeArrow(result.frame2.topCircle, height, width, distArrowAndChain);

	return result;
}

function setTopCircleToIncludeArrow(
	topCircle: Phaser.Physics.Arcade.Sprite,
	arrowHeight: number,
	arrowWidth,
	distArrowAndChain: number
) {
	let topYOfArrow = topCircle.y - distArrowAndChain - arrowHeight / 2;
	let centerYOfNewTopCircle = topYOfArrow + arrowWidth / 2;
	topCircle
		.setPosition(topCircle.x, centerYOfNewTopCircle)
		.setSize(arrowWidth, arrowWidth)
		.setCircle(arrowWidth / 2);
}

function circleChainToPhysicsTopCircle(scene: Phaser.Scene, chain: CircleChain, parent: ChainWeapon, frame: number) {
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

	return result;
}
