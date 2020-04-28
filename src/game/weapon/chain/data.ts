import { WeaponRadius, AllWeaponDists, AllWeaponHeights, AllWeaponTopLefts, AllWeaponGeoms } from "./types";
import { weaponGeomsPerSize } from "./geom";
import { weaponRadiusPerSize, weaponDistsPerSize, weaponHeightPerSize, weaponTopLeftsPerSize } from "./calc";

// order is deliberate

export const weaponRadius: WeaponRadius = weaponRadiusPerSize();

export const weaponDists: AllWeaponDists = weaponDistsPerSize();

export const weaponHeights: AllWeaponHeights = weaponHeightPerSize();

export const weaponTopLefts: AllWeaponTopLefts = weaponTopLeftsPerSize();

export const weaponGeoms: AllWeaponGeoms = weaponGeomsPerSize();
