export class EnvSetup {
	private constructor() {}
	static areaSize = 12;
	static areaExit = 6;
	static exitWidth = 3;

	static halfGridPartSize = 40;
	static gridPartSize = EnvSetup.halfGridPartSize * 2;

	static walkableSymbol = 0;
	static wallSymbol = EnvSetup.walkableSymbol + 1;
	static exitSymbol = EnvSetup.wallSymbol + 1;
	static buildingSymbol = EnvSetup.exitSymbol + 1;
	static enemySymbol = EnvSetup.buildingSymbol + 1;
	static towerSymbol = EnvSetup.enemySymbol + 1;
}
