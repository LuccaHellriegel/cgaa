import { CampConfig } from "../camp/Camps";
import { Enemies } from "../unit/Enemies";
import { gridPartHalfSize } from "../../base/globals/globalSizes";
import { CircleFactory } from "../unit/CircleFactory";
import { BossBarrier } from "./BossBarrier";
import { bigCircleWithChain } from "../camp/campConfig";
import { BossCampPopulator } from "./BossCampPopulator";
import { BossPool } from "./BossPool";
import { EnemySpawnObj } from "../../base/spawnObj/EnemySpawnObj";
import { Exits } from "../path/Exits";

export class BossCamp {
	protected infra: any[];
	protected specialUnits: any[];

	constructor(config: CampConfig, enemies: Enemies, factory: CircleFactory, enemySpawnObj: EnemySpawnObj) {
		let bossCampGroupComposition = [bigCircleWithChain, bigCircleWithChain, bigCircleWithChain, bigCircleWithChain];
		new BossCampPopulator(
			config.staticConfig.scene,
			new BossPool(config.staticConfig.scene, 4, bossCampGroupComposition, enemies, factory),
			enemySpawnObj
		).start();

		let kingConfig = {
			size: "",
			x: (2 * gridPartHalfSize * config.areaConfig.wallBase.sizeOfXAxis) / 2 + config.areaConfig.topLeftX,
			y: (2 * gridPartHalfSize * config.areaConfig.wallBase.sizeOfXAxis) / 2 + config.areaConfig.topLeftY,
			weaponType: "chain"
		};
		factory.createKing(kingConfig);

		let { x, y } = Exits.exitToGlobalPoint(config.areaConfig);
		[
			{ x, y },
			{ x, y: y + 2 * gridPartHalfSize },
			{ x, y: y + 4 * gridPartHalfSize }
		]
			.map(point => {
				return {
					scene: config.staticConfig.scene,
					physicsGroup: config.areaConfig.wallBase.staticConfig.physicsGroup,
					x: point.x,
					y: point.y
				};
			})
			.forEach(
				barrierConfig =>
					new BossBarrier(barrierConfig.scene, barrierConfig.x, barrierConfig.y, barrierConfig.physicsGroup)
			);
	}
}
