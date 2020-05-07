import { RealDict } from "../base/Dict";
import { GameMap } from "./GameMap";
import { RelPos } from "../base/RelPos";
import { EnvSetup } from "../setup/EnvSetup";
import { Area } from "./environment";

export class RealAreaSpawnableDict extends RealDict {
	constructor(area: Area, gameMap: GameMap) {
		let map = gameMap.map;
		let arr = [];
		for (let row = 0; row < map.length; row++) {
			for (let column = 0; column < map[0].length; column++) {
				let pos = new RelPos(row, column);
				let isWalkable = map[row][column] === EnvSetup.walkableSymbol;
				let isInArea = area.isInside(pos);
				let suitable = isWalkable && isInArea;
				if (suitable) arr.push([pos.toPoint(), EnvSetup.walkableSymbol]);
			}
		}
		super(arr);
	}
}
