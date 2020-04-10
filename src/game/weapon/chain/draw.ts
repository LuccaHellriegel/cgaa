import { WeaponGeom } from "./types";

export function drawChainWeapon(graphics: Phaser.GameObjects.Graphics, geom: WeaponGeom) {
	graphics.fillPoints(geom.arrow);
	for (let joint of geom.bigChain.points) graphics.fillCircle(joint.x, joint.y, geom.bigChain.radius);
	for (let joint of geom.smallChain.points) graphics.fillCircle(joint.x, joint.y, geom.smallChain.radius);
}
