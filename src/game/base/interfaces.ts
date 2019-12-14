import { HealthBar } from "./classes/HealthBar";
import { WallBase, Exit } from "./types";

export interface damageable {
	syncPolygon();
	polygon;
	damage(amount: number);
	healthbar: HealthBar;
	id: string;
}

export interface unmovable {}

export interface AreaConfig {
	wallBase: WallBase;
	topLeftX: number;
	topLeftY: number;
	exit: Exit;
}
