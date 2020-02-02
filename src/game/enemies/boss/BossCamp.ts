import { CampConfig } from "../camp/Camps";
import { Enemies } from "../unit/Enemies";
import { gridPartHalfSize } from "../../base/globals/globalSizes";
import { CircleFactory } from "../unit/CircleFactory";
import { BossBarrier } from "./BossBarrier";
import { bigCircleWithChain } from "../camp/campConfig";
import { BossCampPopulator } from "./BossCampPopulator";
import { BossPool } from "./BossPool";
import { EnemySpawnObj } from "../../base/spawnObj/EnemySpawnObj";
import { relativePositionToPoint } from "../../base/position";

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
			x: (2 * gridPartHalfSize * config.area.dims.sizeOfXAxis) / 2 + config.area.topLeft.x,
			y: (2 * gridPartHalfSize * config.area.dims.sizeOfXAxis) / 2 + config.area.topLeft.y,
			weaponType: "chain"
		};
		factory.createKing(kingConfig);

		config.area.exit.relPositions
			.map(relPos => relativePositionToPoint(relPos.column, relPos.row))
			.map(point => {
				return {
					x: point.x + config.area.topLeft.x - gridPartHalfSize,
					y: point.y + config.area.topLeft.y - gridPartHalfSize
				};
			})
			.map(point => {
				return {
					scene: config.staticConfig.scene,
					physicsGroup: config.area.staticConfig.physicsGroup,
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
