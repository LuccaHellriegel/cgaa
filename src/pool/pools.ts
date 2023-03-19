import { Healers } from "../towers/Healers";
import { Bullets } from "../towers/Bullets";
import { Shooters } from "../towers/Shooters";

export type Pools = {
  healers: Healers;
  shooters: Shooters;
  bullets: Bullets;
};

export function initPools(
  scene: Phaser.Scene,
  addTowerToPhysics,
  addBulletToPhysics,
  player
): Pools {
  let bullets = new Bullets(scene, addBulletToPhysics);
  let shooters = new Shooters(scene, addTowerToPhysics, bullets);
  let healers = new Healers(scene, addTowerToPhysics, shooters, player);

  return {
    healers,
    shooters,
    bullets,
  };
}
