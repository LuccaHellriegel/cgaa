import { CampSetup } from "../setup/CampSetup";
import { UnitSetup } from "../setup/UnitSetup";
import { ChainWeapons } from "../weapon/chain/pool";
import { Bullets } from "../tower/shooter/Bullet";
import { Shooters } from "../tower/shooter/Shooter";
import { Healers } from "../tower/healer/Healer";

export function initPools(scene: Phaser.Scene, addTowerToPhysics, addBulletToPhysics, player) {
	let friendWeapons = new ChainWeapons(scene, "Big", 9);
	let bossWeapons = new ChainWeapons(scene, "Big", 30);
	let bullets = new Bullets(scene, addBulletToPhysics);
	let shooters = new Shooters(scene, addTowerToPhysics, bullets);
	let healers = new Healers(scene, addTowerToPhysics, shooters, player);
	let weapons = {};
	for (let campID of CampSetup.ordinaryCampIDs) {
		weapons[campID] = {};
		for (let size of UnitSetup.circleSizeNames) {
			weapons[campID][size] = new ChainWeapons(scene, size, 30);
		}
	}

	return {
		healers,
		shooters,
		bullets,
		weapons,
		friendWeapons,
		bossWeapons,
	};
}
