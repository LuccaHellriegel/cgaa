import { TowerData } from "../components/TowerMenu";

export type TowerType = "basic" | "splash" | "sniper";

export const TowerTypes: Record<TowerType, TowerData> = {
  basic: {
    name: "Basic Tower",
    damage: 10,
    range: 100,
    cost: 50,
  },
  splash: {
    name: "Splash Tower",
    damage: 15,
    range: 120,
    cost: 100,
  },
  sniper: {
    name: "Sniper Tower",
    damage: 30,
    range: 200,
    cost: 150,
  },
};
