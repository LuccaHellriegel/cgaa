import { Generator } from "./Generator";
import { Gameplay } from "../../../scenes/Gameplay";
import { RectPolygon } from "../../0_GameBase/engine/polygons/RectPolygon";

export class RectGenerator extends Generator {
	rect: RectPolygon;
	textureName: any;
	width: any;
	height: any;

	constructor(scene: Gameplay, hexColor, textureName, centerX, centerY, width, height) {
		super(hexColor, scene);
		//scene.add.rectangle(centerX, centerY, width, height);
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
