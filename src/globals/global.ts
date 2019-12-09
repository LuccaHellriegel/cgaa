import { campColors } from "./globalColors";

import { circleSizeNames } from "./globalSizes";

export function executeOverAllCamps(func) {
	for (let index = 0; index < campColors.length; index++) {
		func(campColors[index], index);
	}
}

export function executeOverAllCampsAndSizes(func) {
	executeOverAllCamps((color, colorIndex) => {
		for (let sizeNameIndex = 0; sizeNameIndex < circleSizeNames.length; sizeNameIndex++) {
			func(color, colorIndex, circleSizeNames[sizeNameIndex], sizeNameIndex);
		}
	});
}
