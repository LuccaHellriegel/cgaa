import { StaticConfig, Point, RelativePosition } from "../../base/types";
import { exitSymbol, wallSymbol } from "../../base/globals/globalSymbols";
import { gridPartHalfSize } from "../../base/globals/globalSizes";
import { WallSide } from "../wall/WallSide";
import { Exit } from "./Exit";
import { realCoordinateToRelative } from "../../base/position";
import { EmptyArea } from "./EmptyArea";

export interface AreaDimensions {
	sizeOfXAxis: number;
	sizeOfYAxis: number;
}

export class Area extends EmptyArea {
	relativeAreaTopLeftX: number;
	relativeAreaWidth: number;
	relativeAreaTopLeftY: number;
	relativeAreaHeight: number;

	constructor(
		public staticConfig: StaticConfig,
		public topLeft: Point,
		public dims: AreaDimensions,
		public exit: Exit
	) {
		super(dims);
		this.addAreaExitsToMap();
		this.createWalls();

		this.relativeAreaTopLeftX = realCoordinateToRelative(topLeft.x);
		this.relativeAreaWidth = dims.sizeOfXAxis;
		this.relativeAreaTopLeftY = realCoordinateToRelative(topLeft.y);
		this.relativeAreaHeight = dims.sizeOfYAxis;
	}

	private addAreaExitsToMap() {
		this.exit.relPositions.forEach(pos => {
			this.areaMap[pos.row][pos.column] = exitSymbol;
		});
	}

	private splitUp(positions: Point[]) {
		//TODO: use positions from Exit class?
		//Assumes there is only one exit with consecutive points
		let newPositionsArr = [[], []];
		let index = 0;

		let lastPos = positions[0];
		for (const pos of positions) {
			const distanceIsOneGridPart =
				(Math.abs(lastPos.x - pos.x) == 2 * gridPartHalfSize && Math.abs(lastPos.y - pos.y) == 0) ||
				(Math.abs(lastPos.y - pos.y) == 2 * gridPartHalfSize && Math.abs(lastPos.x - pos.x) == 0);
			const distanceIsZero = Math.abs(lastPos.x - pos.x) == 0 && Math.abs(lastPos.y - pos.y) == 0;
			const distanceOneGridOrZero = distanceIsOneGridPart || distanceIsZero;

			if (!distanceOneGridOrZero) index = 1;
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

	private createWalls() {
		//Assumes Walls are always around the area
		//TODO: sneakly updates the map
		let x = this.topLeft.x;
		let y = this.topLeft.y;
		let leftPartPositions: Point[] = [];
		let rightPartPositions: Point[] = [];
		let topPartPositions: Point[] = [];
		let bottomPartPositions: Point[] = [];
		let positions = [leftPartPositions, rightPartPositions, bottomPartPositions, topPartPositions];
		for (let row = 0; row < this.dims.sizeOfYAxis; row++) {
			for (let column = 0; column < this.dims.sizeOfXAxis; column++) {
				let isExit = this.areaMap[row][column] === exitSymbol;
				//TODO: is hardcoded, but should not be a problem
				let isLeftWall = column === 0;
				let isRightWall = column === this.dims.sizeOfXAxis - 1;
				let isTopWall = row === 0;
				let isBottomWall = row === this.dims.sizeOfYAxis - 1;
				let isWall = (isLeftWall || isRightWall || isTopWall || isBottomWall) && !isExit;
				if (isLeftWall && isWall) leftPartPositions.push({ x, y });
				if (isRightWall && isWall) rightPartPositions.push({ x, y });
				if (isTopWall && isWall) topPartPositions.push({ x, y });
				if (isBottomWall && isWall) bottomPartPositions.push({ x, y });

				//TODO: updates map here
				if (!isExit && isWall) {
					this.areaMap[row][column] = wallSymbol;
				}
				x += 2 * gridPartHalfSize;
			}
			y += 2 * gridPartHalfSize;
			x = this.topLeft.x;
		}

		this.splitupAtExit(positions).forEach(positions => {
			new WallSide(this.staticConfig.scene, this.staticConfig.physicsGroup, positions);
		});
	}

	getMiddlePoint() {
		return {
			x: (2 * gridPartHalfSize * this.dims.sizeOfXAxis) / 2 + this.topLeft.x,
			y: (2 * gridPartHalfSize * this.dims.sizeOfXAxis) / 2 + this.topLeft.y
		};
	}

	isInside(relPos: RelativePosition) {
		return (
			relPos.column < this.relativeAreaTopLeftX + this.relativeAreaWidth &&
			relPos.column >= this.relativeAreaTopLeftX &&
			relPos.row < this.relativeAreaTopLeftY + this.relativeAreaHeight &&
			relPos.row >= this.relativeAreaTopLeftY
		);
	}
}
