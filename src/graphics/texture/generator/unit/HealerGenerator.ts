import { Generator } from "../Generator";
import { Gameplay } from "../../../../scenes/Gameplay";
import { RectPolygon } from "../../../../game/polygons/RectPolygon";
import { EnvSetup } from "../../../../game/setup/EnvSetup";

export class HealerGenerator extends Generator {
	rect: RectPolygon;
	innerRect: RectPolygon;
	textureName: any;
	width: any;
	height: any;

	constructor(scene: Gameplay) {
		let hexColor = 0xa9a9a9;
		let textureName = "healer";
		let centerX = EnvSetup.halfGridPartSize;
		let centerY = EnvSetup.halfGridPartSize;
		let width = EnvSetup.gridPartSize;
		let height = EnvSetup.gridPartSize;

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
		//TODO: sell/upgrade textures
		this.graphics.generateTexture("sell" + this.textureName, this.width, this.height);
		this.graphics.generateTexture("upgrade" + this.textureName, this.width, this.height);
	}

	addFrames() {}
}
