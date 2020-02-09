import { CampOrder } from "./CampOrder";
import { Areas } from "../env/area/Areas";
import { Camp } from "./Camp";
import { GameMap } from "../env/GameMap";
import { CampSetup, CampID } from "../setup/CampSetup";

export class Camps {
	arr: Camp[] = [];
	ordinary: Camp[];
	player: Camp;
	boss: Camp;

	constructor(public order: CampOrder, public areas: Areas, gameMap: GameMap) {
		order.order.forEach((id, index) => {
			let camp = new Camp(id, areas.nonEmpty[index], gameMap);
			if (id === CampSetup.playerCampID) this.player = camp;
			if (id === CampSetup.bossCampID) this.boss = camp;
			this.arr.push(camp);
		});

		this.ordinary = this.arr.filter(camp => CampSetup.ordinaryCampIDs.includes(camp.id));
	}

	get(campID: CampID) {
		for (let index = 0; index < this.arr.length; index++) {
			const camp = this.arr[index];
			if (camp.id === campID) return camp;
		}

		throw "Camp with id " + campID + " not found in Camps";
	}
}
