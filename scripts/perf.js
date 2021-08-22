const { performance } = require("perf_hooks");

const perf = (func, reps, prep) => {
	var zeit = 0;

	for (let index = 0; index < reps; index++) {
		prep && prep();
		var zeit0 = performance.now();
		func();
		var zeit1 = performance.now();
		zeit += zeit1 - zeit0;
	}

	console.log("Time: " + zeit / reps);
};

// perf(() => {
// 	for (let index = 0; index < 100; index++) {
// 		const res = 1 << index;
// 	}
// }, 10);

// perf(() => {
// 	for (let index = 0; index < 100; index++) {
// 		const res = Math.pow(2, index);
// 	}
// }, 10);

const ids = ["blue", "boss", "yellow", "orange", "green", "purple"];
const bitMasks = ids.map((val, index) => 1 << index);
let cooperationBitArr = new Uint8Array(ids.length);

perf(
	() => {
		for (let index = 0; index < bitMasks.length; index++) {
			const primaryBitMask = bitMasks[index];
			for (let index2 = 0; index2 < bitMasks.length; index2++) {
				if (index != index2) {
					const bitMask = bitMasks[index2];
					let cooperationBit = cooperationBitArr[Math.log2(bitMask)];

					cooperationBitArr[Math.log2(primaryBitMask)] |= bitMask;
					while (cooperationBit >= 1) {
						cooperationBitArr[Math.log2(primaryBitMask)];
					}

					for (let i = 0; i < cooperationBitArr.length; i++) {
						const element = cooperationBitArr[i];
						const bitMask = 1 << i;
						//if element has cooperation with bitMask, then OR primaryBitMask
						if ((element & bitMask) == bitMask) cooperationBitArr[i] |= primaryBitMask;
					}
				}
			}
			// console.log(cooperationBitArr);
			// throw "bla";
		}
	},
	10,
	() => {
		cooperationBitArr = new Uint8Array(ids.length);
		for (let index = 0; index < ids.length; index++) {
			// pow(2,index)
			cooperationBitArr[index] = 1 << index;
		}
	}
);
console.log(cooperationBitArr);

let map = new Map();

perf(
	() => {
		for (let index = 0; index < ids.length; index++) {
			const id = ids[index];
			for (let index2 = 0; index2 < ids.length; index2++) {
				if (index != index2) {
					const otherID = ids[index2];
					map.get(id).add(otherID);

					for (let key of map.keys()) {
						// add id to all cooperations of otherID
						let set = map.get(key);
						if (set.has(otherID)) set.add(id);
					}
				}
			}
		}
	},
	10,
	() => {
		map = new Map();
		for (let id of ids) map.set(id, new Set());
	}
);
console.log(map.entries());

perf(() => {
	for (let index = 0; index < bitMasks.length; index++) {
		const primaryBitMask = bitMasks[index];
		for (let index2 = 0; index2 < bitMasks.length; index2++) {
			const bitMask = bitMasks[index2];

			if ((cooperationBitArr[Math.log2(primaryBitMask)] & bitMask) == bitMask) {
			}
		}
	}
}, 20000);

perf(() => {
	for (let index = 0; index < ids.length; index++) {
		const id = ids[index];
		for (let index2 = 0; index2 < ids.length; index2++) {
			const otherID = ids[index2];
			if (map.get(id).has(otherID)) {
			}
		}
	}
}, 20000);
