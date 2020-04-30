import { Enemies } from "../unit/Enemies";
import { CampSetup } from "../setup/CampSetup";
import { CampLike } from "./Camp";
import { Area } from "../env/area/Area";
import { EnvSetup } from "../setup/EnvSetup";
import { Gameplay } from "../../scenes/Gameplay";
import { CampPopulator } from "../populator/CampPopulator";
import { EnemySpawnObj } from "../spawn/EnemySpawnObj";
import { BarrierFactory } from "./BarrierFactory";
import { GameMap } from "../env/GameMap";
import { RealAreaSpawnableDict } from "../env/SpawnableDict";
import { CampsState } from "./CampsState";
import { BossSetup } from "../setup/BossSetup";
import { BossPool } from "../pool/CirclePool";

export class BossCamp implements CampLike {
	id = CampSetup.bossCampID;
	constructor(public area: Area, private gameMap: GameMap) {}

	createBarriers(factory: BarrierFactory) {
		let relPositions = this.area.exit.relativePositions
			.map((relPos) => relPos.toPoint())
			.map((point) => {
				let realTopLeft = this.area.topLeft.toPoint();

				return {
					x: point.x + realTopLeft.x - EnvSetup.halfGridPartSize,
					y: point.y + realTopLeft.y - EnvSetup.halfGridPartSize,
				};
			});
		factory.produce(relPositions);
	}

	populate(scene: Gameplay, pool: BossPool, enemies: Enemies, campsState: CampsState) {
		new CampPopulator(
			CampSetup.bossCampID,
			scene,
			pool,
			new EnemySpawnObj(new RealAreaSpawnableDict(this.area, this.gameMap), enemies),
			BossSetup.maxBossCampPopulation,
			campsState
		);
	}
}
