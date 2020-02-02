import { GroupPool } from "./GroupPool";

export type GroupComposition = { weaponType: string; size: string }[];

export interface CirclePhysics {
	physicsGroup: Phaser.Physics.Arcade.Group;
	weaponGroup: Phaser.Physics.Arcade.Group;
}

export class EnemyPool extends GroupPool {
	protected createUnit(config) {
		return this.factory.createEnemy(config);
	}
}
