import { AreaPosition } from "./AreaPosition";
import { Building } from "../enemies/buildings/Building";
import {
	wallPartHalfSize,
	rectBuildinghalfHeight,
	rectBuildingHalfWidth,
	rectBuildingInWallParts
} from "../../globals/globalSizes";
import { Exit } from "./AreaFactory";
import { WallPart } from "./WallPart";
import { relativePosToRealPos } from "../base/position";
import { updateBuildingSpawnableArr, extractSpawnPosFromSpawnableArr } from "../enemies/spawn/spawn";
import { createBuildingSpawnableArr } from "../base/map";

export class Area {
	parts: AreaPosition[][] = [];
	sizeOfXAxis: number;
	sizeOfYAxis: number;
	topLeftX: any;
	topLeftY: any;
	width: number;
	height: number;
	scene: any;
	buildings: Building[] = [];
	spawnableArrForBuildings: number[][];
	relativeWidth: number;
	relativeHeight: number;
	relativeTopLeftX: number;
	relativeTopLeftY: number;
	color: string;
	physicsGroup: any;

	constructor(config) {
		let { sizeOfXAxis, sizeOfYAxis, topLeftX, topLeftY, unitForPart, color, physicsGroup } = config;
		for (let row = 0; row < sizeOfYAxis; row++) {
			this.parts[row] = [];
			for (let column = 0; column < sizeOfXAxis; column++) {
				this.parts[row].push(new AreaPosition(null));
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
	}

	private makeExit(exit: Exit) {
		switch (exit.wallSide) {
			case "top":
				for (let index = 0; index < exit.width; index++) {
					this.parts[0][exit.position + index].setAsExit();
				}
				break;
			case "bottom":
				for (let index = 0; index < exit.width; index++) {
					this.parts[this.sizeOfYAxis - 1][exit.position + index].setAsExit();
				}
				break;
			case "left":
				for (let index = 0; index < exit.width; index++) {
					this.parts[exit.position + index][0].setAsExit();
				}
				break;
			case "right":
				for (let index = 0; index < exit.width; index++) {
					this.parts[exit.position + index][this.sizeOfXAxis - 1].setAsExit();
				}
				break;
		}
	}

	makeExits(exits: Exit[]) {
		exits.forEach(exit => this.makeExit(exit));
	}

	private createWallSide(topLeftCenterX, topLeftCenterY, numberOfRects, wallSide) {
		let x = topLeftCenterX;
		let y = topLeftCenterY;
		for (let index = 0; index < numberOfRects; index++) {
			if (wallSide === "left" || wallSide === "right") y += 2 * wallPartHalfSize;

			let curRect = new WallPart(this.scene, x, y, this.physicsGroup);
			if (wallSide === "top") {
				this.parts[0][index].updateContent(curRect, "wall");
				x += 2 * wallPartHalfSize;
			} else if (wallSide === "bottom") {
				this.parts[this.sizeOfYAxis - 1][index].updateContent(curRect, "wall");
				x += 2 * wallPartHalfSize;
			} else if (wallSide === "left") {
				this.parts[index + 1][0].updateContent(curRect, "wall");
			} else {
				this.parts[index + 1][this.sizeOfXAxis - 1].updateContent(curRect, "wall");
			}
		}
	}

	buildWalls() {
		let x = this.topLeftX + wallPartHalfSize;
		let y = this.topLeftY + wallPartHalfSize;

		this.createWallSide(x, y, this.sizeOfXAxis, "top");

		let lastRect = this.parts[0][this.sizeOfXAxis - 1];
		let lastXRectX = lastRect.x;

		x = this.topLeftX + wallPartHalfSize;
		this.createWallSide(x, y, this.sizeOfYAxis - 2, "left");

		lastRect = this.parts[this.sizeOfYAxis - 2][0];
		let lastYRectY = lastRect.y;

		y = lastYRectY + 2 * wallPartHalfSize;
		this.createWallSide(x, y, this.sizeOfXAxis, "bottom");

		y = this.topLeftY + wallPartHalfSize;
		x = lastXRectX;
		this.createWallSide(x, y, this.sizeOfYAxis - 2, "right");
	}

	private calculateBuildingSpawnableArrForArea(parts) {
		let spawnableArr = createBuildingSpawnableArr(parts);
		updateBuildingSpawnableArr(spawnableArr);
		return spawnableArr;
	}

	private calculateRandBuildingSpawnPos() {
		if (!this.spawnableArrForBuildings) {
			this.spawnableArrForBuildings = this.calculateBuildingSpawnableArrForArea(this.parts);
		} else {
			updateBuildingSpawnableArr(this.spawnableArrForBuildings);
		}
		let spawnablePos = extractSpawnPosFromSpawnableArr(this.spawnableArrForBuildings);
		let pos = spawnablePos[Phaser.Math.Between(0, spawnablePos.length - 1)];
		return relativePosToRealPos(pos.column + this.relativeTopLeftX, pos.row + this.relativeTopLeftY);
	}

	private checkIfBuildingCollidesWithBuildings(buildings, randX, randY) {
		let checkDiffCallback = (diffX, diffY) => {
			let inRowsOverOrUnderBuilding = diffY >= 2 * rectBuildinghalfHeight + 2 * wallPartHalfSize;
			let leftOrRightFromBuilding = diffX >= 2 * rectBuildingHalfWidth + 2 * wallPartHalfSize;
			if (!inRowsOverOrUnderBuilding && !leftOrRightFromBuilding) return true;
			return false;
		};
		for (let index = 0; index < buildings.length; index++) {
			const otherObject = buildings[index];
			let diffX = Math.abs(otherObject.x - randX);
			let diffY = Math.abs(otherObject.y - randY);
			if (checkDiffCallback(diffX, diffY)) return true;
		}
		return false;
	}

	private buildBuilding(spawnUnit) {
		let { x, y } = this.calculateRandBuildingSpawnPos();
		while (this.checkIfBuildingCollidesWithBuildings(this.buildings, x, y)) {
			let result = this.calculateRandBuildingSpawnPos();
			x = result.x;
			y = result.y;
		}

		let building = new Building(this.scene, x, y, this.physicsGroup, spawnUnit, this.color);
		this.addBuildingToParts(building);
		this.buildings.push(building);
	}

	private addBuildingToParts(building: Building) {
		let x = this.topLeftX;
		let y = this.topLeftY;

		for (let i = 0; i < this.sizeOfYAxis; i++) {
			for (let k = 0; k < this.sizeOfXAxis; k++) {
				if (building.x - rectBuildingHalfWidth === x && building.y - rectBuildinghalfHeight === y) {
					for (let index = 0; index < rectBuildingInWallParts; index++) {
						this.parts[i][k + index].updateContent(building, "building");
					}
					break;
				}
				x += 2 * wallPartHalfSize;
			}
			y += 2 * wallPartHalfSize;

			x = this.topLeftX;
		}
	}

	buildBuildings(numbOfBuildings, spawnUnits) {
		for (let index = 0; index < numbOfBuildings; index++) {
			this.buildBuilding(spawnUnits[index]);
		}
	}
}
