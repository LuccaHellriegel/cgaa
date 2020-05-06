export class Cooperation extends Map<string, Set<string>> {
	constructor(private activateCallback) {
		super();
	}

	init(ids: string[]) {
		for (let id of ids) this.set(id, new Set<string>());
	}

	activateCooperation(id, otherID) {
		this.get(id).add(otherID);

		for (let key of this.keys()) {
			// add id to all cooperations of otherID
			let set = this.get(key);
			if (set.has(otherID)) set.add(id);
		}

		this.activateCallback(id, otherID);
	}

	hasCooperation(campID, otherCampID) {
		return campID === otherCampID || this.get(campID).has(otherCampID);
	}
}
