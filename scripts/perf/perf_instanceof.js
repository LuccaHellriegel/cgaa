const { performance } = require("perf_hooks");

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

class TestClass {
	state = { testProperty: null };
	randomProp = "1";
	randomProp2 = null;
	randomProp3 = { prop: 300 };
}

perf(() => {
	const vals = new Array(1000).fill(0).map((v, i) => (i % 2 === 0 ? new TestClass() : new Map()));
	for (let val of vals) {
		if (val instanceof TestClass) {
			val.state.testProperty = "blub";
		}
	}
}, 10000);

perf(() => {
	const vals = new Array(1000).fill(0).map((v, i) => (i % 2 === 0 ? new TestClass() : new Map()));
	for (let val of vals) {
		if (val.state) {
			val.state.testProperty = "blub";
		}
	}
}, 10000);

perf(() => {
	const vals = new Array(1000).fill(0).map((v, i) => (i % 2 === 0 ? new TestClass() : new Map()));
	for (let val of vals) {
		const state = val.state;
		if (state) {
			state.testProperty = "blub";
		}
	}
}, 10000);

perf(() => {
	const vals = new Array(1000).fill(0).map((v, i) => (i % 2 === 0 ? new TestClass() : new Map()));
	for (let val of vals) {
		const state = val.state;
		if (state !== undefined) {
			state.testProperty = "blub";
		}
	}
}, 10000);
