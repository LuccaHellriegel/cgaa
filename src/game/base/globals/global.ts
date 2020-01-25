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

export function getRandomCampColorOrder() {
	let colors = [...campColors];
	for (let i = colors.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i);
		const temp = colors[i];
		colors[i] = colors[j];
		colors[j] = temp;
	}
	return colors;
}
