import { HealthBar } from "./classes/HealthBar";

export interface damageable {
  syncPolygon();
  polygon;
  damage(amount: number);
  healthbar: HealthBar;
  id: string;
}
