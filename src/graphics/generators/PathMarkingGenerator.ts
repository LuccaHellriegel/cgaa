import { Generator } from "./Generator";
import { RectPolygon } from "../../game/base/polygons/RectPolygon";
import { Gameplay } from "../../scenes/Gameplay";
import { gridPartHalfSize } from "../../game/base/globals/globalSizes";
import { CompositePolygon } from "../../game/base/polygons/CompositePolygon";

export class PathMarkingGenerator extends Generator {
	rects = {};

	constructor(scene: Gameplay) {
		super(0xffe4b2, scene);
		this.generate();
	}

	drawFrames() {
		this.rects["left-right"] = new RectPolygon(
			gridPartHalfSize,
			gridPartHalfSize,
			2 * gridPartHalfSize,
			gridPartHalfSize / 4
		);
		this.rects["right-left"] = new RectPolygon(
			gridPartHalfSize,
			gridPartHalfSize,
			2 * gridPartHalfSize,
			gridPartHalfSize / 4
		);

		this.rects["top-bottom"] = new RectPolygon(
			gridPartHalfSize,
			gridPartHalfSize,

			gridPartHalfSize / 4,
			2 * gridPartHalfSize
		);
		this.rects["bottom-top"] = new RectPolygon(
			gridPartHalfSize,
			gridPartHalfSize,

			gridPartHalfSize / 4,
			2 * gridPartHalfSize
		);

		this.rects["left-top"] = new CompositePolygon([
			[gridPartHalfSize / 2, gridPartHalfSize, gridPartHalfSize, gridPartHalfSize / 4, "rect"],
			[gridPartHalfSize, gridPartHalfSize / 2, gridPartHalfSize / 4, gridPartHalfSize, "rect"]
		]);
		this.rects["top-left"] = new CompositePolygon([
			[gridPartHalfSize / 2, gridPartHalfSize, gridPartHalfSize, gridPartHalfSize / 4, "rect"],
			[gridPartHalfSize, gridPartHalfSize / 2, gridPartHalfSize / 4, gridPartHalfSize, "rect"]
		]);

		this.rects["left-bottom"] = new CompositePolygon([
			[gridPartHalfSize / 2, gridPartHalfSize, gridPartHalfSize, gridPartHalfSize / 4, "rect"],
			[gridPartHalfSize, gridPartHalfSize + gridPartHalfSize / 2, gridPartHalfSize / 4, gridPartHalfSize, "rect"]
		]);
		this.rects["bottom-left"] = new CompositePolygon([
			[gridPartHalfSize / 2, gridPartHalfSize, gridPartHalfSize, gridPartHalfSize / 4, "rect"],
			[gridPartHalfSize, gridPartHalfSize + gridPartHalfSize / 2, gridPartHalfSize / 4, gridPartHalfSize, "rect"]
		]);

		this.rects["right-top"] = new CompositePolygon([
			[gridPartHalfSize + gridPartHalfSize / 2, gridPartHalfSize, gridPartHalfSize, gridPartHalfSize / 4, "rect"],
			[gridPartHalfSize, gridPartHalfSize / 2, gridPartHalfSize / 4, gridPartHalfSize, "rect"]
		]);
		this.rects["top-right"] = new CompositePolygon([
			[gridPartHalfSize + gridPartHalfSize / 2, gridPartHalfSize, gridPartHalfSize, gridPartHalfSize / 4, "rect"],
			[gridPartHalfSize, gridPartHalfSize / 2, gridPartHalfSize / 4, gridPartHalfSize, "rect"]
		]);

		this.rects["right-bottom"] = new CompositePolygon([
			[gridPartHalfSize + gridPartHalfSize / 2, gridPartHalfSize, gridPartHalfSize, gridPartHalfSize / 4, "rect"],
			[gridPartHalfSize, gridPartHalfSize + gridPartHalfSize / 2, gridPartHalfSize / 4, gridPartHalfSize, "rect"]
		]);
		this.rects["bottom-right"] = new CompositePolygon([
			[gridPartHalfSize + gridPartHalfSize / 2, gridPartHalfSize, gridPartHalfSize, gridPartHalfSize / 4, "rect"],
			[gridPartHalfSize, gridPartHalfSize + gridPartHalfSize / 2, gridPartHalfSize / 4, gridPartHalfSize, "rect"]
		]);
	}

	addFrames() {}

	generateTexture() {
		const keys = Object.keys(this.rects);
		for (const key of keys) {
			this.rects[key].draw(this.graphics, 0);
			let texture = "pathMarking-" + key;
			this.graphics.generateTexture(texture, 2 * gridPartHalfSize, 2 * gridPartHalfSize);
			this.graphics.clear();
			this.graphics.fillStyle(0xffe4b2);
		}
	}
}
