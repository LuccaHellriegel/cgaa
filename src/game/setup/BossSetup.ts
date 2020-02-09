import { UnitSetup } from "./UnitSetup";

export class BossSetup {
	private constructor() {}

	static maxBossCampPopulation = 10;

	static bossGroupSize = 4;

	static bossCampGroupComposition = [
		UnitSetup.bigCircleWithChain,
		UnitSetup.bigCircleWithChain,
		UnitSetup.bigCircleWithChain,
		UnitSetup.bigCircleWithChain
	];
}
