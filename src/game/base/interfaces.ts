import { HealthBar } from "./ui/HealthBar";

export interface damageable {
	syncPolygon();
	polygon;
	damage(amount: number);
	healthbar: HealthBar;
	id: string;
}

export interface poolable {
	id: string;
}

export interface listenable {
	once(event: any, callback: Function);
	on(event: any, callback: Function);
}

export interface BuildingInfo {
	color: string;
	spawnPositions: number[][];
}
