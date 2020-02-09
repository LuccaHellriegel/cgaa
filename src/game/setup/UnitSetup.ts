import { EnvSetup } from "./EnvSetup";

export class UnitSetup {
	private constructor() {}
	static normalCircleRadius = EnvSetup.halfGridPartSize - 10;
	static smallCircleRadius = UnitSetup.normalCircleRadius / 2;
	static bigCircleRadius = EnvSetup.halfGridPartSize - 4;

	static circleSizeNames = ["Normal", "Small", "Big"];
	static sizeDict = {
		Normal: UnitSetup.normalCircleRadius,
		Small: UnitSetup.smallCircleRadius,
		Big: UnitSetup.bigCircleRadius
	};

	static maxCampPopulation = 5;

	static groupSize = 4;

	static bigCircleWithRand = { weaponType: "rand", size: "Big" };
	static bigCircleWithChain = { weaponType: "chain", size: "Big" };
	static normalCircleWithRand = { weaponType: "rand", size: "Normal" };
	static normalCircleWithChain = { weaponType: "chain", size: "Normal" };
	static smallCircleWithRand = { weaponType: "rand", size: "Small" };
	static smallCircleWithChain = { weaponType: "chain", size: "Small" };

	static campGroupComposition = [
		UnitSetup.bigCircleWithRand,
		UnitSetup.bigCircleWithChain,
		UnitSetup.bigCircleWithChain,
		UnitSetup.normalCircleWithRand,
		UnitSetup.normalCircleWithChain
	];
}
