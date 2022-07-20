import { EnvSetup } from "../../config/EnvSetup";
import { TowerSetup } from "../../config/TowerSetup";
import { RealDict } from "../../engine/Dict";
import { RelPos } from "../../engine/RelPos";
import { Pools } from "../../pool/pools";
import { TowerSpawnObj } from "../../spawn/TowerSpawnObj";
import { BuildManager } from "../../ui/build/BuildManager";
import { SelectorRect } from "../../ui/SelectorRect";
import { Enemies } from "../../units/Enemies";
import { Player } from "../Player";
import { MouseMovement } from "./MouseMovement";
import { Movement } from "./Movement";
import { Spawner } from "./Spawner";
import { TowerModus } from "./TowerModus";
import { WASD } from "./WASD";

export function playerInput(
  scene,
  player: Player,
  mapSpawnPos: RelPos[],
  enemies: Enemies,
  pools: Pools
) {
  const towerSpawnObj = new TowerSpawnObj(
    new RealDict(
      mapSpawnPos.map((pos) => [pos.toPoint(), EnvSetup.walkableSymbol])
    ),
    enemies
  );

  //Depending on start-money can spawn or not
  const healerSpawner = Spawner.createHealerSpawner(
    scene,
    pools.healers,
    towerSpawnObj
  );
  const shooterSpawner = Spawner.createShooterSpawner(
    scene,
    pools.shooters,
    towerSpawnObj
  );
  shooterSpawner.canSpawn = true;

  const selectorRect = new SelectorRect(scene, 0, 0);
  const healerMode = new TowerModus(
    healerSpawner,
    selectorRect,
    TowerSetup.maxHealers
  );
  const shooterMode = new TowerModus(
    shooterSpawner,
    selectorRect,
    TowerSetup.maxShooters
  );
  const build = new BuildManager(scene, healerMode, shooterMode);

  new MouseMovement(scene, player, selectorRect);

  scene.cameras.main.startFollow(player);
  const movement = new Movement(new WASD(scene), player);

  return {
    spawners: [healerSpawner, shooterSpawner],
    selectorRect,
    build,
    movement,
  };
}
