import { GroupPool } from "./GroupPool";

//TODO: use boss group composition
export class BossPool extends GroupPool {
	protected createUnit(config) {
		return this.factory.createBoss(config);
	}
}
