import { EnvSetup } from "./EnvSetup";

export class TowerSetup {
	private constructor() {}

	static shooterCost = 100;
	static healerCost = 200;

	static towerGroupSize = 15;

	static towerDistance = 2 * EnvSetup.gridPartSize;

	static singleHealAmount = 5;
}
