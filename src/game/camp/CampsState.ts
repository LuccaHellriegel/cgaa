import { Building } from "../building/Building";
import { CampID } from "../setup/CampSetup";
import { Gameplay } from "../../scenes/Gameplay";
import { EventSetup } from "../setup/EventSetup";

export class CampsState {
	stateDict = {};

	constructor(private scene: Gameplay, buildings: Building[][]) {
		buildings.forEach(buildingArr => {
			this.stateDict[buildingArr[0].campID] = {};
			this.stateDict[buildingArr[0].campID].active = true;
			this.stateDict[buildingArr[0].campID].interactionCircleAlive = true;
			this.stateDict[buildingArr[0].campID].hostile = true;
			this.stateDict[buildingArr[0].campID].activeBuildings = buildingArr.length;
			this.stateDict[buildingArr[0].campID].buildings = {};
			buildingArr.forEach(building => {
				this.stateDict[buildingArr[0].campID].buildings[building.id] = true;
			});
		});

		scene.events.on(EventSetup.buildingDestroyEvent, this.updateBuilding.bind(this));

		scene.events.on(EventSetup.interactionCircleDestroyEvent, this.updateInteraction.bind(this));

		scene.events.on(EventSetup.cooperationEvent, this.updateHostility.bind(this));
	}

	private updateDestroyed(campID: CampID) {
		if (this.stateDict[campID].activeBuildings === 0 && !this.stateDict[campID].interactionCircleAlive) {
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
			return prev && (!this.stateDict[cur].active || !this.stateDict[cur].hostile);
		}, true);
		if (campsConquered) EventSetup.campsConquered(this.scene);
	}
}
