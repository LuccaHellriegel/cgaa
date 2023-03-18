import { HealthBar, HealthComponent } from "../healthbar/HealthBar";

export interface damageable {
  damage(amount: number);
  health: HealthComponent;
  healthbar: HealthBar;
  id: string;
}
