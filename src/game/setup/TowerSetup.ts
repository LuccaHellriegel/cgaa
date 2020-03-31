import { EnvSetup } from "./EnvSetup";

export class TowerSetup {
	private constructor() {}

	static shooterCost = 100;
	static healerCost = 200;

	static towerDistance = 2 * EnvSetup.gridPartSize;

	static singleHealAmount = 5;

	static maxShooters = 9;

	static maxBullets = 10;
	static bulletDamage = 20;

	static maxHealers = 2;
}
