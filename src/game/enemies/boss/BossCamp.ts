import { Enemies } from "../unit/Enemies";
import { Paths } from "../path/Paths";
import { EnemySpawnObj } from "../../base/spawn/EnemySpawnObj";
import { CampConfig } from "../camp/Camps";
import { EnemyConfig, EnemyFactory } from "../unit/EnemyFactory";
import { bigCircleWithChain } from "../camp/campConfig";
import { BossCampPopulator } from "./BossCampPopulator";
import { BossBarrier } from "./BossBarrier";
import { Exits } from "../path/Exits";
import { gridPartHalfSize } from "../../base/globals/globalSizes";
import { BoosPool } from "./BossPool";

export class BossCamp {
	private enemyConfig: EnemyConfig;
	constructor(
		private config: CampConfig,
		private enemies: Enemies,
		//TODO: use paths
		public paths: Paths
	) {
		this.createBarriers();

		this.enemyConfig = {
			scene: this.config.staticConfig.scene,
			color: this.config.color,
			//TODO: fix color then I can fix this
			size: "",
			x: 100,
			y: 100,
			weaponType: "chain",
			physicsGroup: this.config.enemyPhysicGroup,
			weaponGroup: this.config.weaponPhysicGroup
		};

		this.populateCamp();
	}

	private populateCamp() {
		let bossCampGroupComposition = [bigCircleWithChain, bigCircleWithChain, bigCircleWithChain, bigCircleWithChain];

		new BossCampPopulator(
			this.config.staticConfig.scene,
			new BoosPool(this.config.staticConfig.scene, 4, bossCampGroupComposition, this.enemyConfig, this.enemies),
			EnemySpawnObj.createAreaEnemySpawnObj(this.config.map, this.config.areaConfig, this.enemies)
		);

		this.createKing();
	}

	private createKing() {
		this.enemyConfig.x =
			(2 * gridPartHalfSize * this.config.areaConfig.wallBase.sizeOfXAxis) / 2 + this.config.areaConfig.topLeftX;

		this.enemyConfig.y =
			(2 * gridPartHalfSize * this.config.areaConfig.wallBase.sizeOfXAxis) / 2 + this.config.areaConfig.topLeftY;
		EnemyFactory.createKing(this.enemyConfig, this.enemies);
	}

	private createBarriers() {
		//TODO: exits are in relation to area not map, this is not obvious enough

		let { x, y } = Exits.exitToGlobalPoint(this.config.areaConfig);

		//TODO: big popup that you now can access this area, maybe counter until they start to attack too?

		new BossBarrier(
			this.config.staticConfig.scene,
			x,
			y + 2 * gridPartHalfSize,
			this.config.areaConfig.wallBase.staticConfig.physicsGroup
		);
		new BossBarrier(
			this.config.staticConfig.scene,
			x,
			y + 4 * gridPartHalfSize,
			this.config.areaConfig.wallBase.staticConfig.physicsGroup
		);
		new BossBarrier(this.config.staticConfig.scene, x, y, this.config.areaConfig.wallBase.staticConfig.physicsGroup);
	}
}
