const { performance } = require("perf_hooks");

//=== is faster than == because == trys to do type conversion first!

const perf = (func, reps, prep) => {
	//warm up
	for (let index = 0; index < reps; index++) {
		prep && prep();
		func();
	}

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

const strArr = new Array(1000).fill(0).map((v, i) => i.toString());
const numbArr = new Array(1000).fill(0).map((v, i) => i);

perf(() => {
	for (let str of strArr) {
		for (let str2 of strArr) {
			if (str === str2) {
			}
		}
	}
}, 1000);

perf(() => {
	for (let str of strArr) {
		for (let str2 of strArr) {
			if (str == str2) {
			}
		}
	}
}, 1000);

perf(() => {
	for (let n of numbArr) {
		for (let n2 of numbArr) {
			if (n === n2) {
			}
		}
	}
}, 1000);

perf(() => {
	for (let n of numbArr) {
		for (let n2 of numbArr) {
			if (n == n2) {
			}
		}
	}
}, 1000);
