export class CampSetup {
	private constructor() {}

	static campIDs: CampID[] = ["blue", "boss", "yellow", "orange", "green", "purple"];
	static playerCampID: CampID = CampSetup.campIDs[0];
	static bossCampID: CampID = CampSetup.campIDs[1];

	static specialCampIDs: CampID[] = ["blue", "boss"];
	static ordinaryCampIDs: CampID[] = CampSetup.campIDs.filter((id) => !CampSetup.specialCampIDs.includes(id));

	static colorDict: { [key in CampID]: number } = {
		yellow: 0xffff00,
		orange: 0xff8000,
		green: 0x80ff00,
		purple: 0x7f00ff,
		blue: 0x6495ed,
		boss: null,
		none: null,
	};

	static numbOfBuildings = 3;
	static numbOfDiplomats = 1;

	static delayForCampPopulation = 40000;
}

export type CampID = "blue" | "yellow" | "orange" | "green" | "purple" | "boss" | "none";
