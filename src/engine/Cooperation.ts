export class Cooperation extends Map<string, Set<string>> {
	cooperationBitArr: Uint8Array;

	constructor(private activateCallback) {
		super();
	}

	init(ids: string[]) {
		this.cooperationBitArr = new Uint8Array(ids.length);
		for (let index = 0; index < ids.length; index++) {
			// pow(2,index)
			this.cooperationBitArr[index] = 1 << index;
		}

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

	activateBitCooperation(primaryBitMask: number, bitMask: number) {
		this.cooperationBitArr[Math.log2(primaryBitMask)] |= bitMask;
		for (let index = 0; index < this.cooperationBitArr.length; index++) {
			const element = this.cooperationBitArr[index];
			//if element has cooperation with bitMask, then AND primaryBitMask otherwise AND 0
			this.cooperationBitArr[index] |= (element & bitMask) == bitMask ? primaryBitMask : 0;
		}
	}

	hasBitCooperation(primaryBitMask: number, bitMask: number) {
		return (this.cooperationBitArr[Math.log2(primaryBitMask)] & bitMask) == bitMask;
	}

	hasCooperation(campID, otherCampID) {
		return campID === otherCampID || this.get(campID).has(otherCampID);
	}
}
