import { HealthBar } from "../ui/graphics/healthbars/HealthBar";

export interface Damageable {
  syncPolygon();
  polygon;
  damage(amount: number);
  healthbar: HealthBar;
  id: string;
}
