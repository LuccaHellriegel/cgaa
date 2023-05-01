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

const p1 = () =>
  new Array(20000)
    .fill(0)
    .map(() => ({ id: Math.floor(Math.random() * 100), val: 700 }));

const p2 = () => {
  const vals = p1();
  const vals1 = [];
  const vals2 = [];
  vals.forEach((v) => {
    vals1.push(v.id);
    vals2.push(v.val);
  });
  return [vals1, vals2];
};

const [vals1, vals2] = p2();
perf(() => {
  const target = Math.floor(Math.random() * 100);
  for (let index = 0; index < vals1.length; index++) {
    const element = vals1[index];
    if (element === target) {
      vals2[index] = vals2[index] * 2 - 10;
      return;
    }
  }
}, 10000000);

const vals = p1();
perf(() => {
  const target = Math.floor(Math.random() * 100);
  for (let val of vals) {
    if (val.id === target) {
      val.val = val.val * 2 - 10;
      return;
    }
  }
}, 10000000);

const [vals12, vals22] = p2();
perf(() => {
  const target = Math.floor(Math.random() * 100);
  const index = vals12.findIndex((v) => v === target);
  if (index !== -1) {
    vals22[index] = vals22[index] * 2 - 10;
  }
}, 10000000);

const p3 = () => {
  const vals = p1();
  const res = {};
  vals.forEach((v) => (res[v.id] = v.val));
  return res;
};
const val3 = p3();
perf(() => {
  const target = Math.floor(Math.random() * 100);
  if (val3[target] !== undefined) {
    val3[target] = val3[target] * 2 - 10;
  }
}, 10000000);

const p4 = () => {
  const vals = p1();
  const res = new Map();
  vals.forEach((v) => res.set(v.id, v.val));
  return res;
};
const val4 = p4();
perf(() => {
  const target = Math.floor(Math.random() * 100);
  if (val4.has(target)) {
    val4.set(target, val4.get(target) * 2 - 10);
  }
}, 10000000);
