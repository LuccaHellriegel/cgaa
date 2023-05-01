import {
  cirlceSizeNames,
  unitArrowHeadConfig,
  WeaponRadius,
  AllWeaponDists,
  unitCircleChainsConfig,
  AllWeaponHeights,
  AllWeaponTopLefts,
} from "./chainWeaponBase";
// DATA
function weaponRadiusPerSize() {
  let result = {};
  for (let unitSize of cirlceSizeNames) {
    let { width } = unitArrowHeadConfig[unitSize];
    let bigRadius = width / 3 / 2;
    let smallRadius = 2 * (bigRadius / 3);
    result[unitSize] = { bigRadius, smallRadius };
  }
  return result as WeaponRadius;
}
export const weaponRadius: WeaponRadius = weaponRadiusPerSize();
function weaponDistsPerSize() {
  let result = {};
  for (let unitSize of cirlceSizeNames) {
    let { bigRadius, smallRadius } = weaponRadius[unitSize];
    let distArrowAndChain = 3 * bigRadius;
    let distBetweenBigCircles = smallRadius * 1.5 + bigRadius * 2;
    let distBetweenBigAndSmallChain = 2 * smallRadius + bigRadius;
    let distBetweenSmallCircles = smallRadius * 3.5;
    result[unitSize] = {
      distArrowAndChain,
      distBetweenBigCircles,
      distBetweenBigAndSmallChain,
      distBetweenSmallCircles,
    };
  }
  return result as AllWeaponDists;
}
export const weaponDists: AllWeaponDists = weaponDistsPerSize();
function weaponHeightPerSize() {
  let result = {};
  for (let unitSize of cirlceSizeNames) {
    let { smallCircles, bigCircles } = unitCircleChainsConfig[unitSize];
    let {
      distArrowAndChain,
      distBetweenBigAndSmallChain,
      distBetweenBigCircles,
      distBetweenSmallCircles,
    } = weaponDists[unitSize];
    let { height } = unitArrowHeadConfig[unitSize];
    let { bigRadius, smallRadius } = weaponRadius[unitSize];
    let arrowPlusBigCircles =
      height / 2 +
      distArrowAndChain +
      distBetweenBigCircles * (bigCircles - 1) +
      bigRadius;
    let fullHeight =
      arrowPlusBigCircles +
      distBetweenBigAndSmallChain +
      distBetweenSmallCircles * (smallCircles - 1) -
      bigRadius +
      smallRadius;
    result[unitSize] = {
      frame0: height,
      frame1: arrowPlusBigCircles,
      frame2: fullHeight,
    };
  }
  return result as AllWeaponHeights;
}
export const weaponHeights: AllWeaponHeights = weaponHeightPerSize();
function weaponTopLeftsPerSize() {
  let result = {};
  let x = 0;
  let y = 0;
  for (let unitSize of cirlceSizeNames) {
    let { width } = unitArrowHeadConfig[unitSize];
    result[unitSize] = {
      frame0: { x, y },
      frame1: { x: x + width, y },
      frame2: { x: x + 2 * width, y },
    };
  }
  return result as AllWeaponTopLefts;
}
export const weaponTopLefts: AllWeaponTopLefts = weaponTopLeftsPerSize();
