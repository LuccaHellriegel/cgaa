export interface AreaDimensions {
	sizeOfXAxis: number;
	sizeOfYAxis: number;
}

export interface MapDimensions {
	sizeOfXAxis: number;
	sizeOfYAxis: number;
}

export type RelativeMap = number[][];

export type ExitSide = "left" | "right" | "up" | "down" | "none";

export type EmptyArea = "empty";
