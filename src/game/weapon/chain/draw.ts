import { WeaponGeoms } from "./types";

export function drawChainWeapon(graphics: Phaser.GameObjects.Graphics, geoms: WeaponGeoms) {
	let { frame0, frame1, frame2 } = geoms;
	drawChainWeaponFrame(graphics, frame0);
	drawChainWeaponFrame(graphics, frame1);
	drawChainWeaponFrame(graphics, frame2);
}

function drawChainWeaponFrame(graphics: Phaser.GameObjects.Graphics, geom) {
	if (geom.arrow) graphics.fillPoints(geom.arrow, true, true);
	if (geom.bigChain) {
		for (let joint of geom.bigChain.points) graphics.fillCircle(joint.x, joint.y, geom.bigChain.radius);
	}
	if (geom.smallChain) {
		for (let joint of geom.smallChain.points) graphics.fillCircle(joint.x, joint.y, geom.smallChain.radius);
	}
}
