import { HealthBar } from "../ui/healthbar/HealthBar";

export interface damageable {
	syncPolygon();
	polygon;
	damage(amount: number);
	healthbar: HealthBar;
	id: string;
}

export interface poolable {
	poolDestroy();
	poolActivate?(x: number, y: number);
	id: string;
}

export interface listenable {
	once(event: any, callback: Function);
	on(event: any, callback: Function);
}

export interface healable {
	heal(amount: number);
	id: string;
}

export interface enableable {
	disable();
	enable();
}
