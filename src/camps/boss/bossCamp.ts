import { GuardComponent } from "../../ai/GuardComponent";
import { BossSetup } from "../../config/BossSetup";
import { CampSetup } from "../../config/CampSetup";
import { RelPos } from "../../engine/RelPos";
import { Point } from "../../engine/types-geom";
import { BossPool } from "../../pool/CirclePool";
import { Pools } from "../../pool/pools";
import { Gameplay } from "../../scenes/Gameplay";
import { EnemySpawnObj } from "../../spawn/EnemySpawnObj";
import { FinalState } from "../../start";
import { Camp } from "../../types";
import { CircleFactory } from "../../units/CircleFactory";
import { Enemies } from "../../units/Enemies";
import { CampPopulator } from "../CampPopulator";
import { areaRealSpawnDict } from "../camps";
import { CampsState } from "../CampsState";
import { BossBarrier } from "./BossBarrier";

function populate(
	scene: Gameplay,
	camp: Camp,
	pool: BossPool,
	enemies: Enemies,
	campsState: CampsState,
	mapSpawnPos: RelPos[]
) {
	const spawnDict = areaRealSpawnDict(camp.areaInLayout, camp.areaSize, mapSpawnPos);
	new CampPopulator(
		CampSetup.bossCampID,
		scene,
		pool,
		new EnemySpawnObj(spawnDict, enemies),
		BossSetup.maxBossCampPopulation,
		campsState
	);
}

function positionKing(bossFactory: CircleFactory, kingPoint: Point) {
	let king = bossFactory.createKing();
	king.stateHandler.setComponents([new GuardComponent(king, king.stateHandler)]);
	king.setPosition(kingPoint.x, kingPoint.y);
}

export function bossCamp(
	scene,
	state: FinalState,
	enemies: Enemies,
	pools: Pools,
	campsState: CampsState,
	mapSpawnPos: RelPos[]
) {
	const camp = state.camps.get(CampSetup.bossCampID);
	for (const exitPositions of camp.exitPositionsInMap) {
		exitPositions.positionsInMap
			.map((pos) => pos.toPoint())
			.forEach((pos) => {
				let barrier = new BossBarrier(scene, pos.x, pos.y);
				state.physics.addEnv(barrier);
			});
	}

	const bossFactory = new CircleFactory(
		scene,
		CampSetup.bossCampID,
		CampSetup.bossCampMask,
		state.physics.addUnit,
		enemies,
		{
			Big: pools.bossWeapons,
			Small: null,
			Normal: null,
		}
	);
	positionKing(bossFactory, camp.areaMapMiddle.toPoint());
	populate(
		scene,
		camp,
		new BossPool(scene, BossSetup.bossGroupSize, bossFactory, enemies),
		enemies,
		campsState,
		mapSpawnPos
	);
}
