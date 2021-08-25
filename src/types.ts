import { ExitSide } from "./data/data-layout";
import { RelPos } from "./engine/RelPos";

export type GameMap = number[][];

export type CGAAData = {
	campIDs: string[];
	buildingsPerCamp: number;

	mapDefaultSymbol: number;
	mapWallSymbol: number;
	mapBuildingSymbol: number;

	areaLayout: (0 | 1)[][];
	areaSymbol: number;
	areaSize: number;
	exitLayout: ExitSide[][][];
};

export type Camp = {
	id: string;
	mask: number;
	areaInLayout: RelPos;
	areaSize: number;
	areaMapMiddle: RelPos;
	exitPositionsInMap: { positionsInMap: RelPos[] }[];
	buildingPositionsInMap: { positionInMap: RelPos; spawnPos: RelPos[] }[];
};

export type Exit = {
	areaInLayout: RelPos;
	positionsInMap: RelPos[];
};

export type WallSide = {
	positionsInMap: RelPos[];
};

export type BuildingPosition = {
	areaInLayout: RelPos;
	positionInMap: RelPos;
	spawnPos: RelPos[];
};
