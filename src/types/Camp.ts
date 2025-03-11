export interface Camp {
  id: number;
  state: "neutral" | "destroyed" | "captured";
  position: {
    x: number;
    y: number;
  };
}
