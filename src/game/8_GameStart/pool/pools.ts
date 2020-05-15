import { ChainWeapons } from "./ChainWeapons";
import { Bullets } from "../../4_GameUnit/tower/Bullet";
import { Shooters } from "../../4_GameUnit/tower/Shooter";
import { Healers } from "../../4_GameUnit/tower/Healer";
import { CampSetup } from "../../0_GameBase/setup/CampSetup";
import { UnitSetup } from "../../0_GameBase/setup/UnitSetup";

export type Pools = {
	healers: Healers;
	shooters: Shooters;
	bullets: Bullets;
	weapons: {};
	friendWeapons: ChainWeapons;
	bossWeapons: ChainWeapons;
};

export function initPools(scene: Phaser.Scene, addTowerToPhysics, addBulletToPhysics, player): Pools {
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
