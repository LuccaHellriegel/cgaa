import { HealthBar } from "../ui/healthbar/HealthBar";

export interface damageable {
	damage(amount: number);
	healthbar: HealthBar;
	id: string;
}

export interface poolable {
	poolDestroy();
	poolActivate?(x: number, y: number);
	id: string;
}

export interface healable {
	heal(amount: number);
	id: string;
}

export interface enableable {
	disable();
	enable();
}
