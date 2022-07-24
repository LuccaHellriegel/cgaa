import { Gameplay } from "../scenes/Gameplay";
import { Building } from "../buildings/Building";
import { CampID } from "../config/CampSetup";
import { EventSetup } from "../config/EventSetup";

const initCampState = (buildings: Building[][]) => {
  const stateDict = {};
  buildings.forEach((buildingArr) => {
    stateDict[buildingArr[0].campID] = {};
    stateDict[buildingArr[0].campID].active = true;
    stateDict[buildingArr[0].campID].interactionCircleAlive = true;
    stateDict[buildingArr[0].campID].hostile = true;
    stateDict[buildingArr[0].campID].activeBuildings = buildingArr.length;
    stateDict[buildingArr[0].campID].buildings = {};
    buildingArr.forEach((building) => {
      stateDict[buildingArr[0].campID].buildings[building.id] = true;
    });
  });
  return stateDict;
};

export class CampsState {
  stateDict = {};

  constructor(private scene: Gameplay, buildings: Building[][]) {
    this.stateDict = initCampState(buildings);

    scene.events.on(
      EventSetup.buildingDestroyEvent,
      this.updateBuilding.bind(this)
    );

    scene.events.on(
      EventSetup.interactionCircleDestroyEvent,
      this.updateInteraction.bind(this)
    );

    scene.events.on(
      EventSetup.cooperationEvent,
      this.updateHostility.bind(this)
    );
  }

  private updateDestroyed(campID: CampID) {
    if (
      this.stateDict[campID].activeBuildings === 0 &&
      !this.stateDict[campID].interactionCircleAlive
    ) {
      this.stateDict[campID].active = false;
      EventSetup.destroyCamp(this.scene, campID);
      this.updateConquered();
    }
  }

  private updateBuilding(obj) {
    this.stateDict[obj.campID].buildings[obj.buildingID] = false;
    this.stateDict[obj.campID].activeBuildings--;
    this.updateDestroyed(obj.campID);
  }

  private updateInteraction(campID: CampID) {
    this.stateDict[campID].interactionCircleAlive = false;
    this.updateDestroyed(campID);
  }

  isActive(campID: CampID) {
    return this.stateDict[campID].active;
  }

  isBuildingActive(campID: CampID, buildingID: string) {
    return this.stateDict[campID].buildings[buildingID];
  }

  isHostile(campID: CampID) {
    return this.stateDict[campID].hostile;
  }

  private updateHostility(campID: CampID) {
    this.stateDict[campID].hostile = false;
    this.updateConquered();
  }

  private updateConquered() {
    let campsConquered = Object.keys(this.stateDict).reduce((prev, cur) => {
      return (
        prev && (!this.stateDict[cur].active || !this.stateDict[cur].hostile)
      );
    }, true);
    if (campsConquered) EventSetup.campsConquered(this.scene);
  }
}
