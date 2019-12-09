import { Area } from "./Area";

export type AreaType = "empty" | "camp";

export type Exit = { position: number; width: number; wallSide: "top" | "bottom" | "left" | "right" };

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

export class AreaFactory {
	private constructor() {}

	static createArea(areaConfig: AreaConfig) {
		let {
			color,
			sizeOfXAxis,
			sizeOfYAxis,
			topLeftX,
			topLeftY,
			unitForPart,
			type,
			exits,
			scene,
			physicsGroup
		} = areaConfig;
		let newArea = new Area({ sizeOfXAxis, sizeOfYAxis, topLeftX, topLeftY, unitForPart, color, physicsGroup });

		if (type === "camp") {
			newArea.scene = scene;

			newArea.buildWalls();
			newArea.makeExits(exits);
		}

		return newArea;
	}
}
