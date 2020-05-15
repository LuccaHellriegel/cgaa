import { TowerSpawnObj } from "../spawn/TowerSpawnObj";
import { RealDict } from "../../0_GameBase/engine/Dict";
import { EnvSetup } from "../../0_GameBase/setup/EnvSetup";
import { Spawner } from "./Spawner";
import { SelectorRect } from "../../7_GameUI/SelectorRect";
import { TowerModus } from "./TowerModus";
import { TowerSetup } from "../../0_GameBase/setup/TowerSetup";
import { BuildManager } from "../../7_GameUI/build/BuildManager";
import { MouseMovement } from "./MouseMovement";
import { RelPos } from "../../0_GameBase/engine/RelPos";
import { Enemies } from "../../4_GameUnit/unit/Enemies";
import { Player } from "../../4_GameUnit/unit/Player";
import { Pools } from "../pool/pools";
import { Movement } from "./Movement";
import { WASD } from "./WASD";

export function playerInput(scene, player: Player, mapSpawnPos: RelPos[], enemies: Enemies, pools: Pools) {
	const towerSpawnObj = new TowerSpawnObj(
		new RealDict(mapSpawnPos.map((pos) => [pos.toPoint(), EnvSetup.walkableSymbol])),
		enemies
	);

	//Depending on start-money can spawn or not
	const healerSpawner = Spawner.createHealerSpawner(scene, pools.healers, towerSpawnObj);
	const shooterSpawner = Spawner.createShooterSpawner(scene, pools.shooters, towerSpawnObj);
	shooterSpawner.canSpawn = true;

	const selectorRect = new SelectorRect(scene, 0, 0);
	const healerMode = new TowerModus(healerSpawner, selectorRect, TowerSetup.maxHealers);
	const shooterMode = new TowerModus(shooterSpawner, selectorRect, TowerSetup.maxShooters);
	const build = new BuildManager(scene, healerMode, shooterMode);

	new MouseMovement(scene, player, selectorRect);

	scene.cameras.main.startFollow(player);
	const movement = new Movement(new WASD(scene), player);

	return { spawners: [healerSpawner, shooterSpawner], selectorRect, build, movement };
}
