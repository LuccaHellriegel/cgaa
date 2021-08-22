import { Pools } from "../../pool/pools";
import { BarrierFactory } from "./BarrierFactory";
import { areaRealSpawnDict } from "../camps";
import { Camp } from "../../../0_GameBase/types";
import { RelPos } from "../../../0_GameBase/engine/RelPos";
import { Gameplay } from "../../../../scenes/Gameplay";
import { CircleFactory } from "../../../../units/CircleFactory";
import { Enemies } from "../../../../units/Enemies";
import { Point } from "../../../0_GameBase/engine/types-geom";
import { BossSetup } from "../../../0_GameBase/setup/BossSetup";
import { CampSetup } from "../../../0_GameBase/setup/CampSetup";
import { GuardComponent } from "../../../4_GameUnit/ai/GuardComponent";
import { FinalState } from "../../../8_GameStart";
import { BossPool } from "../../pool/CirclePool";
import { EnemySpawnObj } from "../../spawn/EnemySpawnObj";
import { CampPopulator } from "../CampPopulator";
import { CampsState } from "../CampsState";

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

function placeBarriers(factory: BarrierFactory, bossExitPositions) {
	factory.produce(bossExitPositions);
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
		placeBarriers(
			new BarrierFactory(scene, state.physics.addEnv),
			exitPositions.positionsInMap.map((pos) => pos.toPoint())
		);
	}

	const bossFactory = new CircleFactory(scene, CampSetup.bossCampID, state.physics.addUnit, enemies, {
		Big: pools.bossWeapons,
		Small: null,
		Normal: null,
	});
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
