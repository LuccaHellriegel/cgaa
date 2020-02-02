import { GroupPool } from "../../base/pool/GroupPool";

export class BossPool extends GroupPool {
	protected createUnit(config) {
		return this.factory.createBoss(config);
	}
}
