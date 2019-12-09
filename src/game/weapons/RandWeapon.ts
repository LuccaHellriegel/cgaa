import { CompositePolygon } from "../base/polygons/CompositePolygon";
import { Weapon } from "./Weapon";
import { normalCircleRadius } from "../../globals/globalSizes";

export class RandWeapon extends Weapon {
	constructor(scene, x, y, weaponGroup, owner) {
		let polygonArr = [
			new CompositePolygon([[x, y, 10, 64, "rect"]]),
			new CompositePolygon([
				[x, y, 10, 64, "rect"],
				[x, y - 22, 64, 20, "rect"]
			])
		];

		let offSetArr = [
			[normalCircleRadius, -normalCircleRadius],
			[normalCircleRadius, -normalCircleRadius]
		];
		super(scene, x, y, "randWeapon", weaponGroup, polygonArr, offSetArr, owner);
		this.setSize(this.polygonArr[polygonArr.length - 1].width, this.polygonArr[polygonArr.length - 1].height);

		this.amount = 2;
	}
}
