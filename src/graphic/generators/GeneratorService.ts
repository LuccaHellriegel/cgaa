import { RandWeaponGenerator } from "./weapons/RandWeaponGenerator";
import { CircleGenerator } from "./units/CircleGenerator";
import { normalCircleRadius, wallPartHalfSize } from "../../globals/globalSizes";
import { ChainWeaponGenerator } from "./weapons/ChainWeaponGenerator";
import { BuildingGenerator } from "./env/BuildingGenerator";
import { RectGenerator } from "./RectGenerator";
import { GhostTowerGenerator } from "./units/GhostTowerGenerator";
import { campColors, campHexColors } from "../../globals/globalColors";

export class GeneratorService {
  private constructor() {}

  static generateTextures(scene) {
    new CircleGenerator(0x6495ed, scene, "blueCircle", normalCircleRadius);
    new RectGenerator(
      scene,
      0x013220,
      "tower",
      1.5 * wallPartHalfSize,
      1.5 * wallPartHalfSize,
      3 * wallPartHalfSize,
      3 * wallPartHalfSize
    );
    new GhostTowerGenerator(scene);
    this.generateUnits(scene);
    this.generateWeapons(scene);
    this.generateEnvironment(scene);
  }

  private static generateWeapons(scene) {
    new RandWeaponGenerator(0x6495ed, scene);
    new ChainWeaponGenerator(0xff0000, scene);
  }

  private static generateUnits(scene) {
    for (let index = 0; index < campColors.length; index++) {
      new CircleGenerator(campHexColors[index], scene, campColors[index] + "Circle", normalCircleRadius);
    }
  }

  private static generateEnvironment(scene) {
    new RectGenerator(
      scene,
      0xa9a9a9,
      "wallPart",
      wallPartHalfSize,
      wallPartHalfSize,
      2 * wallPartHalfSize,
      2 * wallPartHalfSize
    );

    for (let index = 0; index < campColors.length; index++) {
      new BuildingGenerator(scene, campColors[index] + "Building", campHexColors[index]);
    }
  }
}
