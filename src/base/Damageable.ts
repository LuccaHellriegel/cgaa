import { HealthBar } from "./HealthBar";

export interface Damageable {
  syncPolygon();
  polygon;
  damage(amount: number);
  healthbar: HealthBar;
  id: string;
}
