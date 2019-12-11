import { RectPolygon } from "../../game/base/polygons/RectPolygon";
import { Generator } from "./Generator";
import { Gameplay } from "../../scenes/Gameplay";
import { wallPartHalfSize } from "../../globals/globalSizes";

export class SquareGenerator extends Generator {
	rect: RectPolygon;
	innerRect: RectPolygon;
	textureName: any;
	width: any;
	height: any;

	constructor(scene: Gameplay) {
		let hexColor = 0xa9a9a9;
		let textureName = "square";
		let centerX = wallPartHalfSize;
		let centerY = wallPartHalfSize;
		let width = 2 * wallPartHalfSize;
		let height = 2 * wallPartHalfSize;

		super(hexColor, scene);
		this.rect = new RectPolygon(centerX, centerY, width, height);
		this.innerRect = new RectPolygon(centerX, centerY, width - 10, height - 10);
		this.textureName = textureName;
		this.width = width;
		this.height = height;

		this.generate();
	}

	drawFrames() {
		this.rect.draw(this.graphics, 0);
		this.graphics.fillStyle(0x253f3f);
		this.innerRect.draw(this.graphics, 0);
	}

	generateTexture() {
		this.graphics.generateTexture(this.textureName, this.width, this.height);
	}

	addFrames() {}
}