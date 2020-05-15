import { Generator } from "../Generator";
import { Gameplay } from "../../../../scenes/Gameplay";
import { UnitSetup } from "../../../0_GameBase/setup/UnitSetup";
import { CampSetup } from "../../../0_GameBase/setup/CampSetup";

export class BossGenerator extends Generator {
	title: string;
	radius: number = UnitSetup.bigCircleRadius;
	color0 = CampSetup.colorDict[CampSetup.campIDs[2]];
	color1 = CampSetup.colorDict[CampSetup.campIDs[3]];
	color2 = CampSetup.colorDict[CampSetup.campIDs[4]];
	color3 = CampSetup.colorDict[CampSetup.campIDs[5]];

	constructor(scene: Gameplay, title: string) {
		super(CampSetup.colorDict[CampSetup.campIDs[2]], scene);
		this.title = title;
		this.generate();
	}

	drawFrames() {
		this.drawCircleIdleFrame();
		this.drawCircleDamageFrame();
	}

	drawCircleIdleFrame() {
		this.graphics.fillCircle(this.radius, this.radius, this.radius);
		this.graphics.fillStyle(this.color1);
		this.graphics.fillCircle(this.radius, this.radius, this.radius * 0.9);
		this.graphics.fillStyle(this.color2);
		this.graphics.fillCircle(this.radius, this.radius, this.radius * 0.8);
		this.graphics.fillStyle(this.color3);
		this.graphics.fillCircle(this.radius, this.radius, this.radius * 0.7);
	}

	drawCircleDamageFrame() {
		this.graphics.fillStyle(this.color0);
		this.graphics.fillCircle(3 * this.radius, this.radius, this.radius);
		this.graphics.fillStyle(this.color1);
		this.graphics.fillCircle(3 * this.radius, this.radius, this.radius * 0.9);
		this.graphics.fillStyle(this.color2);
		this.graphics.fillCircle(3 * this.radius, this.radius, this.radius * 0.8);
		this.graphics.fillStyle(this.color3);
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
