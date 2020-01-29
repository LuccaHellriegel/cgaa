import { Generator } from "../Generator";
import { Gameplay } from "../../../../scenes/Gameplay";
import { bigCircleRadius } from "../../../../game/base/globals/globalSizes";
import { campHexColors } from "../../../../game/base/globals/globalColors";

export class BossGenerator extends Generator {
	title: string;
	radius: number = bigCircleRadius;

	constructor(scene: Gameplay, title: string) {
		super(campHexColors[0], scene);
		this.title = title;
		this.generate();
	}

	drawFrames() {
		this.drawCircleIdleFrame();
		this.drawCircleDamageFrame();
	}

	drawCircleIdleFrame() {
		this.graphics.fillCircle(this.radius, this.radius, this.radius);
		this.graphics.fillStyle(campHexColors[1]);
		this.graphics.fillCircle(this.radius, this.radius, this.radius * 0.9);
		this.graphics.fillStyle(campHexColors[2]);
		this.graphics.fillCircle(this.radius, this.radius, this.radius * 0.8);
		this.graphics.fillStyle(campHexColors[3]);
		this.graphics.fillCircle(this.radius, this.radius, this.radius * 0.7);
	}

	drawCircleDamageFrame() {
		this.graphics.fillStyle(campHexColors[0]);
		this.graphics.fillCircle(3 * this.radius, this.radius, this.radius);
		this.graphics.fillStyle(campHexColors[1]);
		this.graphics.fillCircle(3 * this.radius, this.radius, this.radius * 0.9);
		this.graphics.fillStyle(campHexColors[2]);
		this.graphics.fillCircle(3 * this.radius, this.radius, this.radius * 0.8);
		this.graphics.fillStyle(campHexColors[3]);
		this.graphics.fillCircle(3 * this.radius, this.radius, this.radius * 0.7);

		this.graphics.fillStyle(0xf08080);
		this.graphics.fillCircle(3 * this.radius, this.radius, 2 * (this.radius / 3));
	}

	generateTexture() {
		this.graphics.generateTexture(this.title, 4 * this.radius, 2 * this.radius);
	}

	addFrames() {
		this.scene.textures.list[this.title].add(1, 0, 0, 0, 2 * this.radius, 2 * this.radius);
		this.scene.textures.list[this.title].add(2, 0, 2 * this.radius, 0, 2 * this.radius, 2 * this.radius);
	}
}
