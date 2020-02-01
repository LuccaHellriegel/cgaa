import { GroupPool } from "../../base/pool/EnemyPool";

export class BossPool extends GroupPool {
	protected createUnit(config) {
		return this.factory.createBoss(config);
	}
}
