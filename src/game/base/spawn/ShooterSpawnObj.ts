import { EnemySpawnObj } from "./EnemySpawnObj";
import { Shooter } from "../../player/unit/shooter/Shooter";
import { constructXYID } from "../id";
import { walkableSymbol, shooterSymbol } from "../globals/globalSymbols";
import { Enemies } from "../../enemies/unit/Enemies";
import { ZeroOneMap } from "../types";
import { AreaConfig } from "../interfaces";
import { mapToSpawnableDict } from "./spawn";

//TODO: randomize starting camp
//TODO: fix CampState UI so that it also shows the first Camps attack

//TODO: this is actually just a NotAreaSpawnObj
export class ShooterSpawnObj extends EnemySpawnObj {
	private constructor(baseObj, enemies: Enemies) {
		super(baseObj, enemies);
	}

	updateBaseObj(shooter: Shooter, remove) {
		let id = constructXYID(shooter.x, shooter.y);
		let symbol = remove ? walkableSymbol : shooterSymbol;
		this.relativeObj[id] = symbol;
	}

	static createShooterSpawnObj(map: ZeroOneMap, areaConfigs: AreaConfig[], enemies: Enemies): ShooterSpawnObj {
		return new ShooterSpawnObj(mapToSpawnableDict(map), enemies);
	}
}
