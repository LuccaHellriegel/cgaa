import { Generator } from "../engine/Generator";
import { Gameplay } from "../scenes/Gameplay";
import { RectPolygon } from "../engine/polygons/RectPolygon";
import { BuildingSetup } from "../config/BuildingSetup";

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
			BuildingSetup.halfBuildingWidth,
			BuildingSetup.halfBuildingHeight,
			BuildingSetup.halfBuildingWidth * 2,
			BuildingSetup.halfBuildingHeight * 2
		);

		let innerReduction = sizeName === "Big" ? 20 : sizeName === "Normal" ? 25 : 30;

		this.rectBuildingInnerRect = new RectPolygon(
			BuildingSetup.halfBuildingWidth,
			BuildingSetup.halfBuildingHeight,
			(BuildingSetup.halfBuildingWidth - innerReduction) * 2,
			(BuildingSetup.halfBuildingHeight - innerReduction) * 2
		);
		this.generate();
	}

	drawFrames() {
		this.rectBuilding.draw(this.graphics, 0);
		this.graphics.fillStyle(this.innerRectHexColor);
		this.rectBuildingInnerRect.draw(this.graphics, 0);
	}
	generateTexture() {
		this.graphics.generateTexture(
			this.title,
			BuildingSetup.halfBuildingWidth * 2,
			BuildingSetup.halfBuildingHeight * 2
		);
	}
	addFrames() {}
}
