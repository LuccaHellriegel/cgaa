import { Exit } from "./Exit";
import { AreaDimensions, RelativeMap } from "../types";
import { WallFactory } from "../wall/WallFactory";
import { EnvSetup } from "../../setup/EnvSetup";
import { RelPos } from "../../base/RelPos";

export class Area {
	private wallPosArr: RelPos[][];

	constructor(public exit: Exit, public dims: AreaDimensions, public topLeft: RelPos, factory: WallFactory) {
		this.createWalls(factory);
	}

	private splitUp(positions: RelPos[]) {
		//Assumes there is only one exit with consecutive points
		let newPositionsArr = [[], []];
		let index = 0;

		let lastPos = positions[0];
		for (const pos of positions) {
			const distanceIsOne =
				(Math.abs(lastPos.column - pos.column) == 1 && Math.abs(lastPos.row - pos.row) == 0) ||
				(Math.abs(lastPos.row - pos.row) == 1 && Math.abs(lastPos.column - pos.column) == 0);
			const distanceIsZero = Math.abs(lastPos.column - pos.column) == 0 && Math.abs(lastPos.row - pos.row) == 0;
			const distanceIsOneOrZero = distanceIsOne || distanceIsZero;

			if (!distanceIsOneOrZero) index = 1;
			newPositionsArr[index].push(pos);
			lastPos = pos;
		}
		return newPositionsArr;
	}

	private splitupAtExit(positionsArr) {
		let newPositionsArr = [];
		positionsArr.forEach(positions => newPositionsArr.push(...this.splitUp(positions).filter(arr => arr.length > 0)));
		return newPositionsArr;
	}

	private createWalls(factory: WallFactory) {
		//Assumes Walls are always around the area
		let leftPartPositions: RelPos[] = [];
		let rightPartPositions: RelPos[] = [];
		let topPartPositions: RelPos[] = [];
		let bottomPartPositions: RelPos[] = [];

		let rowIndex = this.topLeft.row;
		let columnIndex = this.topLeft.column;

		for (let row = 0; row < this.dims.sizeOfYAxis; row++) {
			for (let column = 0; column < this.dims.sizeOfXAxis; column++) {
				//Comparisons are relative to area
				let isLeftWall = column === 0;
				let isRightWall = column === this.dims.sizeOfXAxis - 1;
				let isTopWall = row === 0;
				let isBottomWall = row === this.dims.sizeOfYAxis - 1;
				//Comparisons are relative to global
				let isExit = this.exit.isOverlapping(new RelPos(rowIndex, columnIndex));
				if (isLeftWall && !isExit) leftPartPositions.push(new RelPos(rowIndex, columnIndex));
				if (isRightWall && !isExit) rightPartPositions.push(new RelPos(rowIndex, columnIndex));
				if (isTopWall && !isExit) topPartPositions.push(new RelPos(rowIndex, columnIndex));
				if (isBottomWall && !isExit) bottomPartPositions.push(new RelPos(rowIndex, columnIndex));

				columnIndex++;
			}
			rowIndex++;
			columnIndex = this.topLeft.column;
		}

		let positions = [leftPartPositions, rightPartPositions, bottomPartPositions, topPartPositions];
		this.wallPosArr = this.splitupAtExit(positions);
		factory.produce(this.wallPosArr);
	}

	addTo(map: RelativeMap) {
		this.wallPosArr.forEach(arr => arr.forEach(pos => (map[pos.row][pos.column] = EnvSetup.wallSymbol)));
		return map;
	}

	isInside(relPos: RelPos) {
		return (
			relPos.column < this.topLeft.column + this.dims.sizeOfXAxis &&
			relPos.column >= this.topLeft.column &&
			relPos.row < this.topLeft.row + this.dims.sizeOfYAxis &&
			relPos.row >= this.topLeft.row
		);
	}

	getMiddle(): RelPos {
		return new RelPos(
			this.topLeft.row + Math.floor(this.dims.sizeOfYAxis / 2),
			this.topLeft.column + Math.floor(this.dims.sizeOfXAxis / 2)
		);
	}
}
