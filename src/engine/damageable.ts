import { HealthBar } from "../healthbar/HealthBar";

export interface damageable {
  damage(amount: number);
  healthbar: HealthBar;
  id: string;
}
