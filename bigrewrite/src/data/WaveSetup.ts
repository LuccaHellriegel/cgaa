import { UnitSetup } from "./UnitSetup";

export class WaveSetup {
  private constructor() {}

  static waveSize = 3;

  static groupCompDict = {
    Normal: [UnitSetup.smallCircleWithChain, UnitSetup.smallCircleWithChain],
    Small: [UnitSetup.normalCircleWithChain, UnitSetup.normalCircleWithChain],
    Big: [UnitSetup.bigCircleWithChain, UnitSetup.bigCircleWithChain],
  };

  static timeBetweenWaves = 15000;
}
