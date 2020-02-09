import { Generator } from "../Generator";
import { Gameplay } from "../../../../scenes/Gameplay";
import { UnitSetup } from "../../../../game/setup/UnitSetup";

//TODO: remove duplication
export class KingGenerator extends Generator {
	title: string;
	radius: number = UnitSetup.bigCircleRadius;

	constructor(scene: Gameplay, title: string) {
		super(0xffffff, scene);
		this.title = title;
		this.generate();
	}

	drawFrames() {
		this.drawCircleIdleFrame();
		this.drawCircleDamageFrame();
	}

	drawCircleIdleFrame() {
		this.graphics.fillCircle(this.radius, this.radius, this.radius);
		this.graphics.fillStyle(0x32144f);
		this.graphics.fillCircle(this.radius, this.radius, this.radius * 0.9);
		this.graphics.fillStyle(0x5c15a2);
		this.graphics.fillCircle(this.radius, this.radius, this.radius * 0.7);
	}

	drawCircleDamageFrame() {
		this.graphics.fillStyle(0xffffff);
		this.graphics.fillCircle(3 * this.radius, this.radius, this.radius);
		this.graphics.fillStyle(0x32144f);
		this.graphics.fillCircle(3 * this.radius, this.radius, this.radius * 0.9);
		this.graphics.fillStyle(0x5c15a2);
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
