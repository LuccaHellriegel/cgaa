import { HealthBar } from "./ui/HealthBar";
import { WallBase, Exit } from "./types";

export interface damageable {
	syncPolygon();
	polygon;
	damage(amount: number);
	healthbar: HealthBar;
	id: string;
}

export interface listenable {
	once(event: any, callback: Function);
	on(event: any, callback: Function);
}

export interface AreaConfig {
	wallBase: WallBase;
	topLeftX: number;
	topLeftY: number;
	exit: Exit;
}

export interface BuildingInfo {
	color: string;
	spawnPositions: number[][];
}
