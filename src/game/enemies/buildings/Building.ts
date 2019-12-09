import { Image } from "../../base/classes/BasePhaser";

export class Building extends Image {
	id: string;
	color: string;
	spawnUnit: any;

	constructor(scene, x, y, physicsGroup, spawnUnit, color: string) {
		super({ scene, x, y, texture: color + spawnUnit + "Building", physicsGroup });
		this.color = color;
		this.spawnUnit = spawnUnit;
		this.setImmovable(true);
	}
}
