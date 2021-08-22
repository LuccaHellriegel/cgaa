import { randomizeArr } from "../engine/random";

export class Rivalries extends Map<string, string> {
	constructor(ids: string[]) {
		super();

		const randIDs = randomizeArr(ids);

		// only works for four camps
		let id = randIDs.pop();
		let secondID = randIDs.pop();
		this.set(id, secondID);
		this.set(secondID, id);

		id = randIDs.pop();
		secondID = randIDs.pop();
		this.set(id, secondID);
		this.set(secondID, id);
	}

	getRival(id) {
		return this.get(id);
	}
}
