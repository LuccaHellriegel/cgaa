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

const vals = new Array(1000).fill(0).map((v, i) => i);
const health = 700;

perf(() => {
  let current = health;
  for (let val of vals) {
    const rest = current - val;
    if (rest <= 0) {
      current = 0;
    } else {
      current = rest;
    }
    current = health;
  }
}, 100000);

perf(() => {
  let current = health;
  for (let val of vals) {
    current = Math.max(0, current - val);
    current = health;
  }
}, 100000);
