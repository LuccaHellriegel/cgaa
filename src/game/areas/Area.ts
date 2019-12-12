import { wallPartHalfSize } from "../../globals/globalSizes";
import { WallPart } from "./WallPart";
import { AreaType, Exit } from "../base/types";
import { exitSymbol, wallSymbol } from "../../globals/globalSymbols";

export interface AreaConfig {
	sizeOfXAxis: number;
	sizeOfYAxis: number;
	topLeftX: number;
	topLeftY: number;
	unitForPart: number;
	type: AreaType;
	exits: Exit[];
	scene: Phaser.Scene;
	physicsGroup: Phaser.Physics.Arcade.StaticGroup;
}

export class Area {
	sizeOfXAxis: number;
	sizeOfYAxis: number;
	topLeftX: any;
	topLeftY: any;
	width: number;
	height: number;
	scene: any;
	relativeWidth: number;
	relativeHeight: number;
	relativeTopLeftX: number;
	relativeTopLeftY: number;
	physicsGroup: any;
	map: number[][] = [];

	constructor(config: AreaConfig) {
		let { sizeOfXAxis, sizeOfYAxis, topLeftX, topLeftY, unitForPart, physicsGroup, type, scene, exits } = config;
		for (let row = 0; row < sizeOfYAxis; row++) {
			this.map[row] = [];
			for (let column = 0; column < sizeOfXAxis; column++) {
				this.map[row].push(0);
			}
		}

		this.physicsGroup = physicsGroup;

		this.sizeOfXAxis = sizeOfXAxis;
		this.sizeOfYAxis = sizeOfYAxis;

		this.topLeftX = topLeftX;
		this.topLeftY = topLeftY;

		this.width = sizeOfXAxis * unitForPart;
		this.height = sizeOfYAxis * unitForPart;

		this.relativeWidth = this.width / (2 * wallPartHalfSize);
		this.relativeHeight = this.height / (2 * wallPartHalfSize);

		this.relativeTopLeftX = topLeftX / (2 * wallPartHalfSize);
		this.relativeTopLeftY = topLeftY / (2 * wallPartHalfSize);

		if (type === "camp") {
			this.scene = scene;
			this.makeExits(exits);
			this.buildWalls();
		}
	}

	private makeExit(exit: Exit) {
		switch (exit.wallSide) {
			case "top":
				for (let index = 0; index < exit.width; index++) {
					this.map[0][exit.position + index] = exitSymbol;
				}
				break;
			case "bottom":
				for (let index = 0; index < exit.width; index++) {
					this.map[this.sizeOfYAxis - 1][exit.position + index] = exitSymbol;
				}
				break;
			case "left":
				for (let index = 0; index < exit.width; index++) {
					this.map[exit.position + index][0] = exitSymbol;
				}
				break;
			case "right":
				for (let index = 0; index < exit.width; index++) {
					this.map[exit.position + index][this.sizeOfXAxis - 1] = exitSymbol;
				}
				break;
		}
	}

	private makeExits(exits: Exit[]) {
		exits.forEach(exit => this.makeExit(exit));
	}

	private buildWalls() {
		let x = this.topLeftX + wallPartHalfSize;
		let y = this.topLeftY + wallPartHalfSize;
		for (let row = 0; row < this.sizeOfYAxis; row++) {
			for (let column = 0; column < this.sizeOfXAxis; column++) {
				let isExit = this.map[row][column] === exitSymbol;
				let isLeftWall = column === 0;
				let isRightWall = column === this.sizeOfYAxis - 1;
				let isTopWall = row === 0;
				let isBottomWall = row === this.sizeOfXAxis - 1;
				let isWall = isLeftWall || isRightWall || isTopWall || isBottomWall;
				if (!isExit && isWall) {
					this.map[row][column] = wallSymbol;
					new WallPart(this.scene, x, y, this.physicsGroup);
				}
				x += 2 * wallPartHalfSize;
			}
			y += 2 * wallPartHalfSize;
			x = this.topLeftX + wallPartHalfSize;
		}
	}

	findFirstExit() {
		let pos;
		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[0].length; column++) {
				if (this.map[row][column] === exitSymbol) {
					pos = { column: column + this.relativeTopLeftX, row: row + this.relativeTopLeftY };
					break;
				}
			}
		}
		return pos;
	}
}
