import { RectPolygon } from "../../../game/base/polygons/RectPolygon";
import { Generator } from "../Generator";
import { Gameplay } from "../../../scenes/Gameplay";
import { gridPartHalfSize } from "../../../game/base/globals/globalSizes";

export class SquareGenerator extends Generator {
	rect: RectPolygon;
	innerRect: RectPolygon;
	textureName: any;
	width: any;
	height: any;

	constructor(scene: Gameplay) {
		let hexColor = 0xa9a9a9;
		let textureName = "square";
		let centerX = gridPartHalfSize;
		let centerY = gridPartHalfSize;
		let width = 2 * gridPartHalfSize;
		let height = 2 * gridPartHalfSize;

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
