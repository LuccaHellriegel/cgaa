import { ZeroOneMap } from "./types";
import { AreaConfig } from "./interfaces";
import { realCoordinateToRelative } from "./position";
import { walkableSymbol } from "./globals/globalSymbols";
import { constructXYIDfromColumnRow } from "./id";

export class GameMap {
	constructor(private map: ZeroOneMap) {}

	toAreaSpawnableDict(areaConfig: AreaConfig) {
		let dict = {};
		let relativeAreaTopLeftX = realCoordinateToRelative(areaConfig.topLeftX);
		let relativeAreaWidth = areaConfig.wallBase.sizeOfXAxis;
		let relativeAreaTopLeftY = realCoordinateToRelative(areaConfig.topLeftY);
		let relativeAreaHeight = areaConfig.wallBase.sizeOfYAxis;

		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[0].length; column++) {
				let isWalkable = this.map[row][column] === walkableSymbol;
				let isInArea =
					column < relativeAreaTopLeftX + relativeAreaWidth &&
					column >= relativeAreaTopLeftX &&
					row < relativeAreaTopLeftY + relativeAreaHeight &&
					row >= relativeAreaTopLeftY;
				if (isInArea && isWalkable) dict[constructXYIDfromColumnRow(column, row)] = walkableSymbol;
			}
		}
		return dict;
	}

	toSpawnableDict() {
		let dict = {};

		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[0].length; column++) {
				let isWalkable = this.map[row][column] === walkableSymbol;
				if (isWalkable) dict[constructXYIDfromColumnRow(column, row)] = walkableSymbol;
			}
		}
		return dict;
	}
}
