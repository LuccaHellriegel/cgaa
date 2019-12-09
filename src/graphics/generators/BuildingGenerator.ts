import { Generator } from "./Generator";
import { Gameplay } from "../../scenes/Gameplay";
import { RectPolygon } from "../../game/base/polygons/RectPolygon";
import { rectBuildingHalfWidth, rectBuildinghalfHeight } from "../../globals/globalSizes";

export class BuildingGenerator extends Generator {
	rectBuilding: RectPolygon;
	rectBuildingInnerRect: RectPolygon;
	title: string;
	innerRectHexColor: number;

	constructor(scene: Gameplay, title: string, innerRectHexColor: number, sizeName) {
		super(0xa9a9a9, scene);
		this.title = title;
		this.innerRectHexColor = innerRectHexColor;
		this.rectBuilding = new RectPolygon(
			rectBuildingHalfWidth,
			rectBuildinghalfHeight,
			rectBuildingHalfWidth * 2,
			rectBuildinghalfHeight * 2
		);

		let innerReduction = sizeName === "Big" ? 20 : sizeName === "Normal" ? 25 : 30;

		this.rectBuildingInnerRect = new RectPolygon(
			rectBuildingHalfWidth,
			rectBuildinghalfHeight,
			(rectBuildingHalfWidth - innerReduction) * 2,
			(rectBuildinghalfHeight - innerReduction) * 2
		);
		this.generate();
	}

	drawFrames() {
		this.rectBuilding.draw(this.graphics, 0);
		this.graphics.fillStyle(this.innerRectHexColor);
		this.rectBuildingInnerRect.draw(this.graphics, 0);
	}
	generateTexture() {
		this.graphics.generateTexture(this.title, rectBuildingHalfWidth * 2, rectBuildinghalfHeight * 2);
	}
	addFrames() {}
}
