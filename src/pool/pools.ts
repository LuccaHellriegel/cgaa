import { CampSetup } from "../config/CampSetup";
import { UnitSetup } from "../config/UnitSetup";
import { Healers } from "../towers/Healers";
import { Bullets } from "../towers/Bullets";
import { Shooters } from "../towers/Shooters";
import { ChainWeapons } from "../weapons/ChainWeapon/ChainWeapons";

export type Pools = {
  healers: Healers;
  shooters: Shooters;
  bullets: Bullets;
  weapons: {};
  friendWeapons: ChainWeapons;
  bossWeapons: ChainWeapons;
};

export function initPools(
  scene: Phaser.Scene,
  addTowerToPhysics,
  addBulletToPhysics,
  player
): Pools {
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
