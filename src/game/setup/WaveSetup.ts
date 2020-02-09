import { UnitSetup } from "./UnitSetup";

export class WaveSetup {
	private constructor() {}

	static waveSize = 3;

	static groupCompDict = {
		Normal: [UnitSetup.smallCircleWithRand, UnitSetup.smallCircleWithChain],
		Small: [UnitSetup.normalCircleWithRand, UnitSetup.normalCircleWithChain],
		Big: [UnitSetup.bigCircleWithRand, UnitSetup.bigCircleWithChain]
	};

	static timeBetweenWaves = 15000;
	//static timeBetweenWaves = 150;
}
