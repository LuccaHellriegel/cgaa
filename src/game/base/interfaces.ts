import { HealthBar } from "./classes/HealthBar";
import { WallBase, Exit } from "./types";
import { Building } from "../enemies/camp/unit/Building";

export interface damageable {
	syncPolygon();
	polygon;
	damage(amount: number);
	healthbar: HealthBar;
	id: string;
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
