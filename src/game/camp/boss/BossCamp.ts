import { Enemies } from "../../unit/Enemies";
import { CampSetup } from "../../setup/CampSetup";
import { CampLike } from "../Camp";
import { EnvSetup } from "../../setup/EnvSetup";
import { Gameplay } from "../../../scenes/Gameplay";
import { CampPopulator } from "../../populator/CampPopulator";
import { EnemySpawnObj } from "../../spawn/EnemySpawnObj";
import { BarrierFactory } from "./BarrierFactory";
import { GameMap } from "../../env/GameMap";
import { RealAreaSpawnableDict } from "../../env/SpawnableDict";
import { CampsState } from "../CampsState";
import { BossSetup } from "../../setup/BossSetup";
import { BossPool } from "../../pool/CirclePool";
import { CircleFactory } from "../../unit/CircleFactory";
import { GuardComponent } from "../../ai/GuardComponent";
import { Point } from "../../base/types";
import { Area } from "../../env/environment";

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

	positionKing(bossFactory: CircleFactory, kingPoint: Point) {
		let king = bossFactory.createKing();
		king.stateHandler.setComponents([new GuardComponent(king, king.stateHandler)]);
		king.setPosition(kingPoint.x, kingPoint.y);
	}

	placeBarriers(factory: BarrierFactory) {
		const bossExitPositions = this.area.exit.relativePositions.map((relPos) => relPos.toPoint());
		factory.produce(bossExitPositions);
	}
}
