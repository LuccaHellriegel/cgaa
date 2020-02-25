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

	static maxCampPopulation = 6;

	static campSize = 4;

	static bigCircleWithChain = { weaponType: "chain", size: "Big" };
	static normalCircleWithChain = { weaponType: "chain", size: "Normal" };
	static smallCircleWithChain = { weaponType: "chain", size: "Small" };
}
