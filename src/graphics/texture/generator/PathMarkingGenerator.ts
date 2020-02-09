import { Generator } from "./Generator";
import { Gameplay } from "../../../scenes/Gameplay";
import { RectPolygon } from "../../../game/polygons/RectPolygon";
import { EnvSetup } from "../../../game/setup/EnvSetup";
import { CompositePolygon } from "../../../game/polygons/CompositePolygon";

export class PathMarkingGenerator extends Generator {
	rects = {};

	constructor(scene: Gameplay) {
		super(0xffe4b2, scene);
		this.generate();
	}

	drawFrames() {
		this.rects["left-right"] = new RectPolygon(
			EnvSetup.halfGridPartSize,
			EnvSetup.halfGridPartSize,
			EnvSetup.gridPartSize,
			EnvSetup.halfGridPartSize / 4
		);
		this.rects["right-left"] = new RectPolygon(
			EnvSetup.halfGridPartSize,
			EnvSetup.halfGridPartSize,
			EnvSetup.gridPartSize,
			EnvSetup.halfGridPartSize / 4
		);

		this.rects["top-bottom"] = new RectPolygon(
			EnvSetup.halfGridPartSize,
			EnvSetup.halfGridPartSize,

			EnvSetup.halfGridPartSize / 4,
			EnvSetup.gridPartSize
		);
		this.rects["bottom-top"] = new RectPolygon(
			EnvSetup.halfGridPartSize,
			EnvSetup.halfGridPartSize,

			EnvSetup.halfGridPartSize / 4,
			EnvSetup.gridPartSize
		);

		this.rects["left-top"] = new CompositePolygon([
			[
				EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize / 4,
				"rect"
			],
			[
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize / 4,
				EnvSetup.halfGridPartSize,
				"rect"
			]
		]);
		this.rects["top-left"] = new CompositePolygon([
			[
				EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize / 4,
				"rect"
			],
			[
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize / 4,
				EnvSetup.halfGridPartSize,
				"rect"
			]
		]);

		this.rects["left-bottom"] = new CompositePolygon([
			[
				EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize / 4,
				"rect"
			],
			[
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize + EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize / 4,
				EnvSetup.halfGridPartSize,
				"rect"
			]
		]);
		this.rects["bottom-left"] = new CompositePolygon([
			[
				EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize / 4,
				"rect"
			],
			[
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize + EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize / 4,
				EnvSetup.halfGridPartSize,
				"rect"
			]
		]);

		this.rects["right-top"] = new CompositePolygon([
			[
				EnvSetup.halfGridPartSize + EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize / 4,
				"rect"
			],
			[
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize / 4,
				EnvSetup.halfGridPartSize,
				"rect"
			]
		]);
		this.rects["top-right"] = new CompositePolygon([
			[
				EnvSetup.halfGridPartSize + EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize / 4,
				"rect"
			],
			[
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize / 4,
				EnvSetup.halfGridPartSize,
				"rect"
			]
		]);

		this.rects["right-bottom"] = new CompositePolygon([
			[
				EnvSetup.halfGridPartSize + EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize / 4,
				"rect"
			],
			[
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize + EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize / 4,
				EnvSetup.halfGridPartSize,
				"rect"
			]
		]);
		this.rects["bottom-right"] = new CompositePolygon([
			[
				EnvSetup.halfGridPartSize + EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize / 4,
				"rect"
			],
			[
				EnvSetup.halfGridPartSize,
				EnvSetup.halfGridPartSize + EnvSetup.halfGridPartSize / 2,
				EnvSetup.halfGridPartSize / 4,
				EnvSetup.halfGridPartSize,
				"rect"
			]
		]);
	}

	addFrames() {}

	generateTexture() {
		const keys = Object.keys(this.rects);
		for (const key of keys) {
			this.rects[key].draw(this.graphics, 0);
			let texture = "pathMarking-" + key;
			this.graphics.generateTexture(texture, EnvSetup.gridPartSize, EnvSetup.gridPartSize);
			this.graphics.clear();
			this.graphics.fillStyle(0xffe4b2);
		}
	}
}
