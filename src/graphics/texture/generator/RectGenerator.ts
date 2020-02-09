import { Generator } from "./Generator";
import { Gameplay } from "../../../scenes/Gameplay";
import { RectPolygon } from "../../../game/polygons/RectPolygon";

export class RectGenerator extends Generator {
	rect: RectPolygon;
	textureName: any;
	width: any;
	height: any;

	constructor(scene: Gameplay, hexColor, textureName, centerX, centerY, width, height) {
		super(hexColor, scene);
		this.rect = new RectPolygon(centerX, centerY, width, height);
		this.textureName = textureName;
		this.width = width;
		this.height = height;

		this.generate();
	}

	drawFrames() {
		this.rect.draw(this.graphics, 0);
	}

	generateTexture() {
		this.graphics.generateTexture(this.textureName, this.width, this.height);
	}

	addFrames() {}
}
