import { Enemies } from "../unit/Enemies";
import { Paths } from "../path/Paths";
import { EnemySpawnObj } from "../../base/spawn/EnemySpawnObj";
import { CampConfig } from "../camp/Camps";
import { EnemyConfig } from "../unit/EnemyFactory";
import { EnemyPool } from "../../base/pool/EnemyPool";
import { bigCircleWithChain } from "../camp/campConfig";
import { BossCampPopulator } from "./BossCampPopulator";
import { BossBarrier } from "./BossBarrier";
import { relativeCoordinateToReal } from "../../base/position";
import { Exits } from "../path/Exits";
import { gridPartHalfSize } from "../../base/globals/globalSizes";

export class BossCamp {
	constructor(
		private config: CampConfig,
		private enemies: Enemies,
		//TODO: use paths
		public paths: Paths
	) {
		this.populateCamp();
	}

	//TODO: make a conditional to be able to to get into this camp -> use building that listens to event

	private populateCamp() {
		let enemyConfig: EnemyConfig = {
			scene: this.config.staticConfig.scene,
			color: this.config.color,
			size: "Big",
			x: 100,
			y: 100,
			weaponType: "chain",
			physicsGroup: this.config.enemyPhysicGroup,
			weaponGroup: this.config.weaponPhysicGroup
		};

		let bossCampGroupComposition = [bigCircleWithChain, bigCircleWithChain, bigCircleWithChain, bigCircleWithChain];

		let enemyPool = new EnemyPool(
			this.config.staticConfig.scene,
			4,
			bossCampGroupComposition,
			enemyConfig,
			this.enemies
		);

		new BossCampPopulator(
			this.config.staticConfig.scene,
			enemyPool,
			EnemySpawnObj.createAreaEnemySpawnObj(this.config.map, this.config.areaConfig, this.enemies)
		);

		//TODO: exits are in relation to area not map, this is not obvious enough

		let { x, y } = Exits.exitToGlobalPoint(this.config.areaConfig);

		//TODO: maybe just use Tower texture? Might be confusing
		//TODO: big popup that you now can access this area, maybe counter until they start to attack too?

		new BossBarrier(
			this.config.staticConfig.scene,
			x - 2 * gridPartHalfSize,
			y + 2 * gridPartHalfSize,
			this.config.areaConfig.wallBase.staticConfig.physicsGroup,
			"Big",
			"orange"
		);
		new BossBarrier(
			this.config.staticConfig.scene,
			x - 2 * gridPartHalfSize,
			y + 4 * gridPartHalfSize,
			this.config.areaConfig.wallBase.staticConfig.physicsGroup,
			"Big",
			"orange"
		);
		new BossBarrier(
			this.config.staticConfig.scene,
			x - 2 * gridPartHalfSize,
			y,
			this.config.areaConfig.wallBase.staticConfig.physicsGroup,
			"Big",
			"orange"
		);
	}

	//TODO:
	createKingUnit() {}
}
