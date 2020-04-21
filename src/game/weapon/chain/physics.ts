import { EnemySize } from "../../unit/CircleFactory";
import { weaponGeoms, weaponDists } from "./data";
import { CircleChain, PhysicsGeoms } from "./types";
import { unitArrowHeadConfig } from "./const";
import { ChainWeapon } from "./weapon";

export function weaponGeomsToPhysicsCircles(
	scene: Phaser.Scene,
	unitSize: EnemySize,
	parent: ChainWeapon,
	weaponGroup: Phaser.Physics.Arcade.Group
) {
	let geoms = weaponGeoms[unitSize];
	let result: PhysicsGeoms = {
		frame1: { bigChain: circleChainToPhysicsChain(scene, geoms.frame1.bigChain, parent, weaponGroup, 1) },
		frame2: {
			bigChain: circleChainToPhysicsChain(scene, geoms.frame2.bigChain, parent, weaponGroup, 2),
			smallChain: circleChainToPhysicsChain(scene, geoms.frame2.smallChain, parent, weaponGroup, 2),
		},
	};

	// top physics circle should overlap arrow and the top circle of the big chain
	let { height, width } = unitArrowHeadConfig[unitSize];
	let { distArrowAndChain } = weaponDists[unitSize];
	setTopCircleToIncludeArrow(result.frame1.bigChain[0], height, width, distArrowAndChain);
	setTopCircleToIncludeArrow(result.frame2.bigChain[0], height, width, distArrowAndChain);

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

function circleChainToPhysicsChain(
	scene: Phaser.Scene,
	chain: CircleChain,
	parent: ChainWeapon,
	weaponGroup: Phaser.Physics.Arcade.Group,
	frame: number
) {
	let points = chain.points;
	let radius = chain.radius;
	let result = [];

	for (let point of points)
		result.push(
			scene.physics.add
				.sprite(point.x, point.y, "")
				.setVisible(false)
				.setActive(false)
				// to get correct circle position, we need to first change default size then set circle
				// (weird internal repositioning)
				.setSize(radius * 2, radius * 2)
				.setCircle(radius)
				.setImmovable(true)
				.setData("weapon", parent)
				.setData("frame", frame)
		);

	weaponGroup.addMultiple(result);

	return result;
}
