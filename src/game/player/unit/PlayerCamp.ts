export class PlayerCamp {
	constructor(private config: CampConfig) {
		this.populateCamp();
	}

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

		let enemyPool = new EnemyPool(
			this.config.staticConfig.scene,
			4,
			bossCampGroupComposition,
			enemyConfig,
			this.enemies
		);
	}
}
