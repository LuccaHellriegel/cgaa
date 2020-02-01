import { CampConfig } from "../camp/Camps";
import { Enemies } from "../unit/Enemies";
import { gridPartHalfSize } from "../../base/globals/globalSizes";
import { EnemyFactory } from "../unit/EnemyFactory";
import { BossBarrier } from "./BossBarrier";
import { bigCircleWithChain } from "../camp/campConfig";
import { BossCampPopulator } from "./BossCampPopulator";
import { BossPool } from "./BossPool";
import { EnemySpawnObj } from "../../base/spawn/EnemySpawnObj";
import { Exits } from "../path/Exits";

export class BossCamp {
	protected infra: any[];
	protected specialUnits: any[];

	constructor(config: CampConfig, enemies: Enemies) {
		let bossCampGroupComposition = [bigCircleWithChain, bigCircleWithChain, bigCircleWithChain, bigCircleWithChain];

		let { x, y } = Exits.exitToGlobalPoint(config.areaConfig);

		let factory = new EnemyFactory(
			config.staticConfig.scene,
			config.color,
			{ physicsGroup: config.enemyPhysicGroup, weaponGroup: config.weaponPhysicGroup },
			enemies
		);

		new BossCampPopulator(
			config.staticConfig.scene,
			new BossPool(config.staticConfig.scene, 4, bossCampGroupComposition, enemies, factory),
			EnemySpawnObj.createAreaEnemySpawnObj(config.map, config.areaConfig, enemies)
		).start();

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
			.forEach(config => new BossBarrier(config.scene, config.x, config.y, config.physicsGroup));

		let kingConfig = {
			size: "",
			x: (2 * gridPartHalfSize * config.areaConfig.wallBase.sizeOfXAxis) / 2 + config.areaConfig.topLeftX,
			y: (2 * gridPartHalfSize * config.areaConfig.wallBase.sizeOfXAxis) / 2 + config.areaConfig.topLeftY,
			weaponType: "chain"
		};
		factory.createKing(kingConfig);
	}
}
