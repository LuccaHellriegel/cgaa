import { Gameplay } from "../scenes/Gameplay";
import { RandWeaponGenerator } from "../graphic/generator/weapons/RandWeaponGenerator";
import { CircleGenerator } from "../graphic/generator/units/CircleGenerator";
import { normalCircleRadius } from "../global";
import { ChainWeaponGenerator } from "../graphic/generator/weapons/ChainWeaponGenerator";
import { WallPartGenerator } from "../graphic/generator/env/WallPartGenerator";
import { BuildingGenerator } from "../graphic/generator/env/BuildingGenerator";

export class GeneratorService {

  private constructor() {
  }

  static executeGeneration(scene) {
      this.generateUnits(scene)
      this.generateWeapons(scene)
      this.generateEnvironment(scene)
  }


  private static generateWeapons(scene) {
    new RandWeaponGenerator(0x6495ed, scene).generate();
    new ChainWeaponGenerator(0xff0000, scene).generate();
  }

  private static generateUnits(scene) {
    new CircleGenerator(
      0x6495ed,
      scene,
      "blueCircle",
      normalCircleRadius
    ).generate();
    new CircleGenerator(
      0xff0000,
      scene,
      "redCircle",
      normalCircleRadius
    ).generate();
  }

  private static generateEnvironment(scene){
      new WallPartGenerator(scene).generate()
      new BuildingGenerator(scene).generate()
  }
}
