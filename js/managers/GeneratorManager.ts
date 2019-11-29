import { Gameplay } from "../scenes/Gameplay";
import { RandWeaponGenerator } from "../graphic/generator/weapons/RandWeaponGenerator";
import { CircleGenerator } from "../graphic/generator/units/CircleGenerator";
import { normalCircleRadius } from "../global";
import { ChainWeaponGenerator } from "../graphic/generator/weapons/ChainWeaponGenerator";
import { WallPartGenerator } from "../graphic/generator/env/WallPartGenerator";
import { BuildingGenerator } from "../graphic/generator/env/BuildingGenerator";

export class GeneratorManager {
  scene: Gameplay;

  constructor(scene: Gameplay) {
    this.scene = scene;
  }

  executeGeneration() {
      this.generateUnits()
      this.generateWeapons()
      this.generateEnvironment()
  }


  private generateWeapons() {
    new RandWeaponGenerator(0x6495ed, this.scene).generate();
    new ChainWeaponGenerator(0xff0000, this.scene).generate();
  }

  private generateUnits() {
    new CircleGenerator(
      0x6495ed,
      this.scene,
      "blueCircle",
      normalCircleRadius
    ).generate();
    new CircleGenerator(
      0xff0000,
      this.scene,
      "redCircle",
      normalCircleRadius
    ).generate();
  }

  private generateEnvironment(){
      new WallPartGenerator(this.scene).generate()
      new BuildingGenerator(this.scene).generate()
  }
}
