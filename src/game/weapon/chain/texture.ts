import { EnemySize } from "../../unit/CircleFactory";
import { unitArrowHeadConfig, unitCircleChainsConfig, chainWeaponColor, cirlceSizeNames } from "./const";
import { topDownWeaponGeom, distanceArrowCenterToChain, topDownChainHeight } from "./geom";
import { drawChainWeapon } from "./draw";
import { WeaponGeom, ArrowConfig } from "./types";
import { Point } from "../../base/types";

export function weaponTextures(scene: Phaser.Scene) {
	let g = scene.add.graphics({ fillStyle: { color: chainWeaponColor } });
	let topLeft = { x: 0, y: 0 };
	for (let unitSize of cirlceSizeNames) unitWeaponTexture(scene, topLeft, unitSize, g);
}

export function unitWeaponTexture(
	scene: Phaser.Scene,
	topLeft: Point,
	unitSize: EnemySize,
	g: Phaser.GameObjects.Graphics
) {
	let arrowConfig = unitArrowHeadConfig[unitSize];
	let weaponChainConfig = unitCircleChainsConfig[unitSize];
	let geom = topDownWeaponGeom(topLeft, arrowConfig, weaponChainConfig);

	drawChainWeapon(g, geom);
	captureChainWeaponTexture(scene, g, unitSize + "chainWeapon", geom, topLeft, arrowConfig);

	g.clear();
}

function captureChainWeaponTexture(
	scene: Phaser.Scene,
	graphics: Phaser.GameObjects.Graphics,
	title: string,
	geom: WeaponGeom,
	topLeft: Point,
	config: ArrowConfig
) {
	// weapon width = arrow width
	let { width, height } = config;
	let { smallChain, bigChain } = geom;

	// assumes points are alligned on x-axis
	// need to add radius to reach end of weapon (chain ends in center of last point)
	let fullHeight = Math.abs(topLeft.y - smallChain.points[smallChain.points.length - 1].y) + smallChain.radius;

	// needs to be the same graphics object that was used for ALL of the drawing
	// (no game objects allowed, e.g. add.circle)
	// drawing needs to be perfectly alligned with 0,0 being top-left
	graphics.generateTexture(title, width, fullHeight);

	// capture frames

	// caputure arrow-head frame
	scene.textures.list[title].add(0, 0, 0, 0, width, height);

	// capture arrow-head + big chain
	// arrow center starts at 0 + height/2
	let topToBigChainTopCenter = height / 2 + distanceArrowCenterToChain(bigChain.radius);
	// chain height is between centers, add radius to reach bottom
	let bigChainTopCenterToBigChainRealBottom = topDownChainHeight(bigChain.points) + bigChain.radius;
	scene.textures.list[title].add(1, 0, 0, 0, width, topToBigChainTopCenter + bigChainTopCenterToBigChainRealBottom);

	// capture full weapon
	// TODO weird endless rectanlge appears below full texture
	scene.textures.list[title].add(2, 0, 0, 0, width, fullHeight);
}
