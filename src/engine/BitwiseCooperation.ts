export class BitwiseCooperation {
	//maximum supported elements: 8
	private bitArr: Uint8Array;
	private maskArray: number[] = [];

	constructor(elementCount: number) {
		this.bitArr = new Uint8Array(elementCount);
		for (let index = 0; index < elementCount; index++) {
			// pow(2,index)
			const mask = 1 << index;
			this.bitArr[index] = mask;
			this.maskArray.push(mask);
		}
	}

	masks() {
		return this.maskArray;
	}

	activate(toBeAdded: number, primaryBitMask: number) {
		const toBeAddedIndex = Math.log2(toBeAdded);

		//if element has cooperation with primaryBitMask (which is also true for itself!),
		//then add cooperation with toBeAdded and add cooperation with element to toBeAdded
		//dont need to add it to primaryBitMasks-index separately this way
		for (let index = 0; index < this.bitArr.length; index++) {
			if ((this.bitArr[index] & primaryBitMask) == primaryBitMask) {
				this.bitArr[toBeAddedIndex] |= this.maskArray[index];
				this.bitArr[index] |= toBeAdded;
			}
		}
	}

	has(bitMask: number, primaryBitMask: number) {
		return (this.bitArr[Math.log2(primaryBitMask)] & bitMask) == bitMask;
	}
}
