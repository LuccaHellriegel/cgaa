import { Building } from "../enemies/buildings/Building";
import {
	wallPartHalfSize,
	rectBuildinghalfHeight,
	rectBuildingHalfWidth,
	rectBuildingInWallParts
} from "../../globals/globalSizes";
import { WallPart } from "./WallPart";
import { AreaType, Exit } from "../base/types";
import { exitSymbol, wallSymbol, buildingSymbol } from "../../globals/globalSymbols";

export interface AreaConfig {
	color: string;
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
	color: string;
	physicsGroup: any;
	exitPositions: any[] = [];
	map: number[][] = [];

	constructor(config: AreaConfig) {
		let { sizeOfXAxis, sizeOfYAxis, topLeftX, topLeftY, unitForPart, color, physicsGroup, type, scene, exits } = config;
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

		this.color = color;

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

	makeExits(exits: Exit[]) {
		exits.forEach(exit => this.makeExit(exit));
	}

	buildWalls() {
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

	addBuildingToParts(building: Building) {
		let x = this.topLeftX;
		let y = this.topLeftY;

		for (let i = 0; i < this.sizeOfYAxis; i++) {
			for (let k = 0; k < this.sizeOfXAxis; k++) {
				if (building.x - rectBuildingHalfWidth === x && building.y - rectBuildinghalfHeight === y) {
					for (let index = 0; index < rectBuildingInWallParts; index++) {
						this.map[i][k + index] = buildingSymbol;
					}
					break;
				}
				x += 2 * wallPartHalfSize;
			}
			y += 2 * wallPartHalfSize;

			x = this.topLeftX;
		}
	}
}
