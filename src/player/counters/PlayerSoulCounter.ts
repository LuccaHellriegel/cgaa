import { PlayerCounter } from "./PlayerCounter";
import { HUD } from "../../scenes/HUD";
import { Gameplay } from "../../scenes/Gameplay";
import { SymmetricCrossPolygon } from "../../graphics/polygons/SymmetricCrossPolygon";

export class PlayerSoulCounter extends PlayerCounter {
  constructor(sceneToUse: HUD, sceneToListen: Gameplay, x, y) {
    let playerSoulCountGraphic = new SymmetricCrossPolygon(x, y, 50, 25);
    //TODO: decouple damageAmount from soulCount, because if I attack 50 and only 10 lives -> only 10 souls

    super(
      sceneToUse,
      sceneToListen,
      x - 17,
      y - 12,
      0,
      "damage-circle",
      "souls-spent",
      "never",
      playerSoulCountGraphic
    );
  }
}
