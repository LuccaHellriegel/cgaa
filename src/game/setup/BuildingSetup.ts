import { EnvSetup } from "./EnvSetup";

export class BuildingSetup {
	private constructor() {}

	static halfBuildingWidth = (3 * EnvSetup.gridPartSize) / 2;
	static halfBuildingHeight = EnvSetup.gridPartSize / 2;
}
