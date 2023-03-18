import { CampID } from "./CampSetup";

export class EventSetup {
  private constructor() {}

  static healPlayer = "heal-player";

  static partialDamage = "damage-";

  static partialReroutingEvent = "reroute-";

  static soulsDict = {
    Shooter: 100,
    Healer: 200,
    Big: 100,
    Normal: 60,
    Small: 40,
  };

  static soulsGained = "souls-gained";
  static soulsSpent = "souls-spent";

  static gainSouls(scene: Phaser.Scene, type) {
    scene.events.emit(EventSetup.soulsGained, this.soulsDict[type]);
  }

  static interactionCircleDestroyEvent = "interactionCircle-destroyed";

  static buildingDestroyEvent = "building-destroyed";

  static destroyBuilding(
    scene: Phaser.Scene,
    campID: CampID,
    buildingID: string
  ) {
    scene.events.emit(this.buildingDestroyEvent, { campID, buildingID });
  }

  static campDestroyEvent = "camp-destroyed";

  static destroyCamp(scene: Phaser.Scene, campID: CampID) {
    scene.events.emit(this.campDestroyEvent, campID);
  }

  static cooperationEvent = "cooperation-initialized";

  static cooperate(scene: Phaser.Scene, campID: CampID) {
    scene.events.emit(this.cooperationEvent, campID);
  }

  static conqueredEvent = "camps-conquered";

  static campsConquered(scene: Phaser.Scene) {
    scene.events.emit(this.conqueredEvent);
  }

  static gameOverEvent = "game-over";

  static startWaveEvent = "start-wave";

  static startWave(scene: Phaser.Scene, campID: CampID) {
    scene.events.emit(this.startWaveEvent, campID);
  }

  static endWaveEvent = "end-wave";

  static endWave(scene: Phaser.Scene, campID: CampID) {
    scene.events.emit(this.endWaveEvent, campID);
  }

  static questAcceptedEvent = "quest-accepted";

  static towerBuildEvent = "tower-build";

  static towerSoldEvent = "tower-sold";

  static canBuildShooter = "can-build-shooter";
  static cannotBuildShooter = "can-not-build-shooter";

  static canBuildHealer = "can-build-healer";
  static cannotBuildHealer = "can-not-build-healer";

  static essentialUnitKilledEvent = "unit-killed";
  static essentialUnitsKilled = "essential-units-killed";
}
