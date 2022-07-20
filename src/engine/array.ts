export function arrayMiddle(arr: any[]) {
  return arr[Math.floor(arr.length / 2)];
}

export function array2DFind(arr: any[][], test) {
  for (let row = 0; row < arr.length; row++) {
    for (let column = 0; column < arr[0].length; column++) {
      if (test(arr[row][column], row, column)) return [row, column];
    }
  }
}

function array2DFunc(arr: any[][], func) {
  for (let row = 0; row < arr.length; row++) {
    for (let column = 0; column < arr[0].length; column++) {
      func(arr[row][column], row, column);
    }
  }
}

export function array2DApply(arr: any[][], apply) {
  const result = [];

  array2DFunc(arr, (value, row, column) => {
    const applied = apply(value, row, column);
    if (applied) result.push(applied);
  });

  return result;
}

export function array2DApplyConcat(arr: any[][], apply) {
  let result = [];

  array2DFunc(arr, (value, row, column) => {
    const applied = apply(value, row, column);
    if (applied) result = result.concat(applied);
  });

  return result;
}

export function splitArr(
  arr: any[],
  tester: (lastElement, currentElement) => boolean
) {
  let splitArrs = [[arr[0]]];
  let splitArrsIndex = 0;
  let lastElement = arr[0];
  for (let index = 1; index < arr.length; index++) {
    const currentElement = arr[index];

    const insertSplit = tester(lastElement, currentElement);

    // switch to next arr
    if (insertSplit) {
      splitArrsIndex++;
      splitArrs.push([]);
    }
    splitArrs[splitArrsIndex].push(currentElement);
    lastElement = currentElement;
  }
  return splitArrs;
}
