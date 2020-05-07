import { MapDimensions, RelativeMap } from "../types";
import { Area } from "./Area";
import { Exit } from "./Exit";
import { WallFactory } from "../wall/WallFactory";
import { Layout } from "./Layout";

export class Areas {
	areaArr: Area[];
	dims: MapDimensions;
	exits: Exit[];

	constructor(factory: WallFactory, gameLayout: Layout) {
		this.dims = gameLayout.getMapDims();
		gameLayout.addExitsAndAreas(this, factory);
	}

	addTo(map: RelativeMap) {
		this.areaArr.forEach((area) => {
			map = area.addTo(map);
		});

		this.exits.forEach((exit) => {
			map = exit.addTo(map);
		});
		return map;
	}
}
