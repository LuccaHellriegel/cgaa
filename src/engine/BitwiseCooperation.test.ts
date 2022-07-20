import { BitwiseCooperation } from "./BitwiseCooperation";

test("bitmasks should be correctly produced", () => {
  //GIVEN
  const expectedMasks = [1, 2, 4, 8, 16, 32, 64, 128];
  const cooperation = new BitwiseCooperation(new Array(8), () => {});

  //WHEN
  const actual = cooperation.masks();

  //THEN
  expect(actual).toEqual(expectedMasks);
});

test("empty cooperation should have self cooperation", () => {
  //GIVEN
  const cooperation = new BitwiseCooperation(new Array(8), () => {});
  const masks = cooperation.masks();

  //WHEN
  const actualSelfCooperation = masks
    .map((mask) => cooperation.has(mask, mask))
    .every((b) => b === true);

  //THEN
  expect(actualSelfCooperation).toBe(true);
});

test("empty cooperation should have no not-self cooperation", () => {
  //GIVEN
  const cooperation = new BitwiseCooperation(new Array(8), () => {});
  const masks = cooperation.masks();

  //WHEN
  let actual = false;
  for (let mask of masks) {
    for (let otherMask of masks) {
      if (mask !== otherMask) {
        actual ||= cooperation.has(mask, otherMask);
      }
    }
  }

  //THEN
  expect(actual).toBe(false);
});

test("activating a cooperation should lead to the cooperation being active", () => {
  //GIVEN
  const masks = new BitwiseCooperation(new Array(8), () => {}).masks();

  //WHEN
  let actual = true;
  for (let mask of masks) {
    for (let otherMask of masks) {
      if (mask !== otherMask) {
        const cooperation = new BitwiseCooperation(new Array(8), () => {});
        cooperation.activate(mask, otherMask);
        actual &&= cooperation.has(mask, otherMask);
      }
    }
  }

  //THEN
  expect(actual).toBe(true);
});

test("activating 2 cooperations should lead to the cooperation spreading to already activated cooperations", () => {
  //GIVEN
  const masks = new BitwiseCooperation(new Array(8), () => {}).masks();

  for (let index = 0; index < masks.length; index++) {
    const cooperation = new BitwiseCooperation(new Array(8), () => {});
    const mask = masks[index];
    const otherMask1 = masks[(index + 1) % masks.length];
    const otherMask2 = masks[(index + 2) % masks.length];
    const selectedMasks = [mask, otherMask1, otherMask2];

    //WHEN
    cooperation.activate(otherMask1, mask);
    cooperation.activate(otherMask2, mask);

    //THEN
    expect(cooperation.has(otherMask2, otherMask1)).toBe(true);
    expect(cooperation.has(otherMask1, otherMask2)).toBe(true);
  }
});

test("activating 2 cooperations should not lead to the cooperation spreading to not already activated cooperations", () => {
  //GIVEN
  const masks = new BitwiseCooperation(new Array(8), () => {}).masks();

  for (let index = 0; index < masks.length; index++) {
    const cooperation = new BitwiseCooperation(new Array(8), () => {});
    const mask = masks[index];
    const otherMask1 = masks[(index + 1) % masks.length];
    const otherMask2 = masks[(index + 2) % masks.length];
    const selectedMasks = [mask, otherMask1, otherMask2];

    //WHEN
    cooperation.activate(otherMask1, mask);
    cooperation.activate(otherMask2, mask);

    //THEN
    for (let otherMask of masks) {
      //should not be activated for all other masks!
      if (!selectedMasks.includes(otherMask)) {
        expect(cooperation.has(otherMask, mask)).toBe(false);
        expect(cooperation.has(otherMask, otherMask1)).toBe(false);
        expect(cooperation.has(otherMask, otherMask2)).toBe(false);
      }
    }
  }
});

test("activating 3 cooperations should lead to the cooperation spreading to already activated cooperations", () => {
  //GIVEN
  const masks = new BitwiseCooperation(new Array(8), () => {}).masks();

  for (let index = 0; index < masks.length; index++) {
    const cooperation = new BitwiseCooperation(new Array(8), () => {});
    const mask = masks[index];
    const otherMask1 = masks[(index + 1) % masks.length];
    const otherMask2 = masks[(index + 2) % masks.length];
    const otherMask3 = masks[(index + 3) % masks.length];

    //WHEN
    //combinatoric explosion, so just testing 3 pairs
    cooperation.activate(otherMask1, mask);
    cooperation.activate(otherMask2, mask);
    cooperation.activate(otherMask3, mask);

    //THEN
    expect(cooperation.has(otherMask2, otherMask1)).toBe(true);
    expect(cooperation.has(otherMask1, otherMask2)).toBe(true);
    expect(cooperation.has(otherMask3, otherMask1)).toBe(true);
    expect(cooperation.has(otherMask3, otherMask2)).toBe(true);
    expect(cooperation.has(otherMask2, otherMask3)).toBe(true);
    expect(cooperation.has(otherMask1, otherMask3)).toBe(true);
  }
});

test("activating 3 cooperations should not lead to the cooperation spreading not to already activated cooperations", () => {
  //GIVEN
  const masks = new BitwiseCooperation(new Array(8), () => {}).masks();

  for (let index = 0; index < masks.length; index++) {
    const cooperation = new BitwiseCooperation(new Array(8), () => {});
    const mask = masks[index];
    const otherMask1 = masks[(index + 1) % masks.length];
    const otherMask2 = masks[(index + 2) % masks.length];
    const otherMask3 = masks[(index + 3) % masks.length];
    const selectedMasks = [mask, otherMask1, otherMask2, otherMask3];

    //WHEN
    //combinatoric explosion, so just testing 3 pairs
    cooperation.activate(otherMask1, mask);
    cooperation.activate(otherMask2, mask);
    cooperation.activate(otherMask3, mask);

    //THEN
    for (let otherMask of masks) {
      //should not be activated for all other masks!
      if (!selectedMasks.includes(otherMask)) {
        expect(cooperation.has(otherMask, mask)).toBe(false);
        expect(cooperation.has(otherMask, otherMask1)).toBe(false);
        expect(cooperation.has(otherMask, otherMask2)).toBe(false);
        expect(cooperation.has(otherMask, otherMask3)).toBe(false);
      }
    }
  }
});

test("activating all cooperations should lead to all cooperations being activated", () => {
  //GIVEN
  const cooperation = new BitwiseCooperation(new Array(8), () => {});
  const masks = cooperation.masks();

  //WHEN
  for (let mask of masks) {
    for (let otherMask of masks) {
      cooperation.activate(otherMask, mask);
    }
  }

  //THEN
  for (let mask of masks) {
    for (let otherMask of masks) {
      expect(cooperation.has(otherMask, mask)).toBe(true);
    }
  }
});
