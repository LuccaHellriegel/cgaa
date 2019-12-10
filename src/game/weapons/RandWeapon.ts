import { CompositePolygon } from "../base/polygons/CompositePolygon";
import { Weapon } from "./Weapon";

const randWeaponConfig = {
	Small: { width: 5, height: 32, secondRectWidth: 32, secondRectHeight: 10, yCorrection: -22, amount: 2 },
	Normal: { width: 10, height: 64, secondRectWidth: 64, secondRectHeight: 20, yCorrection: -22, amount: 5 },
	Big: { width: 15, height: 80, secondRectWidth: 80, secondRectHeight: 25, yCorrection: -22, amount: 10 }
};

export class RandWeapon extends Weapon {
	constructor(scene, x, y, weaponGroup, owner, ownerSize, ownerSizeName) {
		let sizes = randWeaponConfig[ownerSizeName];
		let polygonArr = [
			new CompositePolygon([[x, y, sizes.width, sizes.height, "rect"]]),
			new CompositePolygon([
				[x, y, sizes.width, sizes.height, "rect"],
				[x, y - sizes.yCorrection, sizes.secondRectWidth, sizes.secondRectHeight, "rect"]
			])
		];

		let offSetArr = [
			[ownerSize, -ownerSize],
			[ownerSize, -ownerSize]
		];
		super(scene, x, y, ownerSizeName + "randWeapon", weaponGroup, polygonArr, offSetArr, owner, ownerSize);
		this.setSize(this.polygonArr[polygonArr.length - 1].width, this.polygonArr[polygonArr.length - 1].height);

		this.amount = sizes.amount;
	}
}
