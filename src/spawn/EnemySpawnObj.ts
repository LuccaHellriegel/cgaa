import { EnvSetup } from "../config/EnvSetup";
import { RealDict } from "../engine/Dict";
import { Point } from "../engine/types-geom";
import { Enemies } from "../units/Enemies";

export class EnemySpawnObj {
	//Relative to position of enemies
	public relativeDict: RealDict = new RealDict([]);

	//dict : RealDict is spawnable dict
	constructor(private dict: RealDict, private enemies: Enemies) {}

	private updateRelativeDictWithMovingUnits() {
		this.enemies.getAllEnemyPositions().forEach((pos) => {
			if (this.relativeDict.get(pos) !== undefined) this.relativeDict.set(pos, EnvSetup.enemySymbol);
		});
	}

	private updateRelativeDict() {
		this.relativeDict = RealDict.fromDict(this.dict.dict);
		this.updateRelativeDictWithMovingUnits();
	}

	evaluatePoint(point: Point) {
		this.updateRelativeDict();
		return this.relativeDict.get(point) === EnvSetup.walkableSymbol;
	}

	getRandomSpawnPosition(): number[] | boolean {
		this.updateRelativeDict();

		let keys = Object.keys(this.dict.dict);
		let key = keys[Phaser.Math.Between(0, keys.length - 1)];
		let isWalkable = this.dict.dict[key] === EnvSetup.walkableSymbol;

		let tries = 0;
		while (!isWalkable && tries < 100) {
			key = keys[Phaser.Math.Between(0, keys.length - 1)];
			isWalkable = this.dict.dict[key] === EnvSetup.walkableSymbol;
			tries++;
		}
		if (tries === 100) return false;
		let arr = key.split(" ");
		return [parseInt(arr[0]), parseInt(arr[1])];
	}
}
