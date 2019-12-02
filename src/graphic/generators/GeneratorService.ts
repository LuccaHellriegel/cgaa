import { Gameplay } from "../../scenes/Gameplay";
import { RandWeaponGenerator } from "./weapons/RandWeaponGenerator";
import { CircleGenerator } from "./units/CircleGenerator";
import { normalCircleRadius } from "../../globals/globalSizes";
import { ChainWeaponGenerator } from "./weapons/ChainWeaponGenerator";
import { WallPartGenerator } from "./env/WallPartGenerator";
import { BuildingGenerator } from "./env/BuildingGenerator";
import { RectGenerator } from "./RectGenerator";

export class GeneratorService {
  private constructor() {}

  static generateTextures(scene) {
    this.generateUnits(scene);
    this.generateWeapons(scene);
    this.generateEnvironment(scene);
  }

  private static generateWeapons(scene) {
    new RandWeaponGenerator(0x6495ed, scene);
    new ChainWeaponGenerator(0xff0000, scene);
  }

  private static generateUnits(scene) {
    new CircleGenerator(0x6495ed, scene, "blueCircle", normalCircleRadius);
    new CircleGenerator(0xff0000, scene, "redCircle", normalCircleRadius);
  }

  private static generateEnvironment(scene) {
    new RectGenerator(scene, "wallPart", 40, 40, 80, 80);
    new BuildingGenerator(scene);
  }
}
